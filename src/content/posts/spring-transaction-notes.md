---
title: Spring 事务与 AOP：注解背后发生了什么
description: 从代理、传播行为到自调用失效，把 @Transactional 的边界想清楚。
date: 2026-06-24
tags: [后端]
---

第一次遇到「事务没生效」时，我把 `@Transactional` 加在了方法上，日志也打印了，数据库就是没有回滚。

后来才明白，注解本身不开启事务，真正干活的是 Spring 在背后生成的代理对象。理解这一层，很多奇怪的现象就都能解释了。

## 从一次失效说起

当时的代码大概是这样的：同一个类里，方法 A 调用方法 B，事务注解写在 B 上。

外部请求进来调用 A，A 是普通方法，没有经过代理；A 内部直接调用 B，走的是 `this`，也就绕过了代理。注解还在，但拦截器根本没有机会执行。

所以事务失效不是 Spring 的 bug，而是我对「代理」这件事没有概念。

## 代理：注解真正的执行者

Spring 事务的本质是 AOP：在目标方法前后织入开启、提交、回滚的逻辑。

如果目标类实现了接口，默认用 JDK 动态代理；没有接口时用 CGLIB 生成子类。无论哪种，容器里放的都是代理对象，调用方拿到的也是代理。

代理在方法执行前从连接池取连接、关闭自动提交，方法正常返回就提交，抛出符合条件的异常就回滚。

把这个过程想清楚之后，就能理解几个常见限制：private 方法不能被代理、final 方法不能被 CGLIB 覆写、自调用会绕过代理。

## 传播行为怎么记

七种传播行为名字很多，但可以按两个问题来记：当前有没有事务，以及要不要新建一个。

`REQUIRED` 是默认值：有事务就加入，没有就新建。`REQUIRES_NEW` 不管外面有没有，都挂起当前事务另开一个，适合日志、流水这类不能跟着回滚的记录。

`NESTED` 是嵌套事务，依赖保存点，外层回滚会带着内层一起回滚，内层回滚不影响外层。`SUPPORTS` 有就加入、没有就非事务执行；`NOT_SUPPORTED` 挂起事务；`MANDATORY` 要求必须已有事务；`NEVER` 要求不能有事务。

真正写代码时用得最多的是前三个，其余知道语义即可。

## 回滚规则

默认只有 `RuntimeException` 和 `Error` 会触发回滚，受检异常不会。

这不是设计缺陷，而是约定：受检异常通常表示调用方可以处理的业务情况，框架不替你做决定。如果确实需要，可以显式写 `@Transactional(rollbackFor = Exception.class)`。

另一个常见的坑是捕获异常后不再抛出。异常被吞掉，代理收不到，事务自然照常提交。

## AOP 的两种织入方式

Spring AOP 用运行期代理，只能拦截方法调用，够用也简单。

AspectJ 支持编译期和加载期织入，能拦截字段访问、构造器，性能也更好，但需要额外的编译配置。绝大多数业务项目用 Spring AOP 就够了。

切点决定「拦谁」，通知决定「什么时候做什么」。事务只是通知的一种，日志、权限、幂等也都可以放在这里。

## 事务与锁、与消息的边界

事务里最不该做的是远程调用。网络不可控，一次超时就会把数据库连接和锁一起拖住。

另一个容易忽略的是消息发送。如果先发消息再提交事务，消费者可能在数据还没落库时就来查询；如果先提交再发消息，又可能在中间失败。

比较稳妥的做法是事务提交后再发，例如使用 `TransactionSynchronization` 或 `@TransactionalEventListener`，必要时再配合本地消息表做补偿。

## 一段代码

```java
@Service
public class OrderService {

    private final OrderMapper orderMapper;
    private final StockService stockService;

    public OrderService(OrderMapper orderMapper, StockService stockService) {
        this.orderMapper = orderMapper;
        this.stockService = stockService;
    }

    @Transactional(rollbackFor = Exception.class)
    public void create(OrderCommand command) {
        orderMapper.insert(command.toOrder());
        // 同库操作放在同一事务里
        stockService.deduct(command.getSkuId(), command.getCount());
        // 远程调用与消息发送放到事务提交之后
    }
}
```

这段代码本身不复杂，难的是判断哪些操作应该留在事务里、哪些必须挪出去。判断标准只有一个：它失败了，能不能和数据库一起回滚。

## 学完之后

现在写事务方法之前，我会先问三个问题：这个方法会不会被同类调用、异常会不会被吞掉、里面有没有远程操作。

三个问题都能答清楚，事务大概率就是安全的。注解很短，边界却需要想很久。
