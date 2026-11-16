---
title: Redis 缓存的三个边界：穿透、击穿与雪崩
description: 三种问题看起来相似，解法却完全不同。用一张清晰的图，把缓存边界想明白。
date: 2026-10-21
tags: [后端, 数据库]
---

缓存用起来简单，用好却不容易。

很多关于缓存的讨论，最后都会落到三个词上：穿透、击穿、雪崩。它们听起来像同一类问题，实际上分别对应三种不同的失效场景。如果混在一起背面试题，很容易在真实系统里用错方案。

这篇文章不打算罗列名词，而是从请求路径出发，把每个问题放回它发生的位置。

## 先从三个问题说起

假设我们的查询链路是：

```text
请求 -> 缓存 -> 数据库
```

正常情况下，绝大多数请求会在缓存层被拦住，只有少量请求会落到数据库。三种「异常」分别破坏了这个链路的某个环节：

- **穿透**：查询的数据根本不存在，缓存永远不会命中。
- **击穿**：某一个热点 Key 突然过期，大量请求同时涌向数据库。
- **雪崩**：大量 Key 在同一时间失效，或者缓存服务整体不可用。

一句话区分：穿透是「查不到」，击穿是「一个热点没了」，雪崩是「一大片同时没了」。

## 缓存穿透：为不存在的数据兜底

穿透最典型的场景，是恶意请求用不存在的 ID 反复查询。因为数据不存在，缓存里也不会有值，每次请求都会绕过缓存直达数据库。

常见的处理方式有两种。

第一种是**缓存空值**。即使数据库查不到，也把一个特殊标记写进缓存，并设置较短的过期时间。

```java
public Product getProduct(Long id) {
    String key = "product:" + id;
    String cached = redis.opsForValue().get(key);

    if (cached != null) {
        return "NULL".equals(cached) ? null : JSON.parseObject(cached, Product.class);
    }

    Product product = productMapper.selectById(id);
    if (product == null) {
        redis.opsForValue().set(key, "NULL", 2, TimeUnit.MINUTES);
        return null;
    }

    int ttl = 30 + ThreadLocalRandom.current().nextInt(10);
    redis.opsForValue().set(key, JSON.toJSONString(product), ttl, TimeUnit.MINUTES);
    return product;
}
```

这里有两个细节：空值的 TTL 要短，避免数据后来被创建却一直读到空；正常值的 TTL 加一点随机量，顺便降低雪崩风险。

第二种是**布隆过滤器**。它可以在缓存之前快速判断「这个 Key 是否可能存在」，不存在就直接返回。代价是有极低的误判率，以及数据变更时需要同步维护。

如果查询量不大，缓存空值通常就够了。布隆过滤器更适合高并发、恶意请求明显的场景。

## 缓存击穿：给热点 Key 一把锁

击穿发生在单个热点 Key 上。比如首页某个活动信息，缓存刚过期，几千个请求同时发现缓存空了，于是同时去查数据库。

这里有两种常见思路。

**互斥锁**：只允许一个请求回源，其余请求等待或短暂重试。

```java
String lockKey = "lock:product:" + id;
boolean locked = Boolean.TRUE.equals(
    redis.opsForValue().setIfAbsent(lockKey, "1", 10, TimeUnit.SECONDS)
);

if (!locked) {
    Thread.sleep(50);
    return getProduct(id);
}

try {
    Product product = productMapper.selectById(id);
    redis.opsForValue().set("product:" + id, JSON.toJSONString(product), 30, TimeUnit.MINUTES);
    return product;
} finally {
    redis.delete(lockKey);
}
```

这段代码省略了锁的续期与误删问题，真实场景建议用 Lua 校验锁的持有者。但它已经表达了核心思想：**回源这件事，只让一个请求去做**。

**逻辑过期**：Key 本身不设置物理过期，而是在 value 里存一个过期时间。发现逻辑过期后，仍先返回旧值，再异步开启一个线程去重建缓存。

它的优点是读请求永远不会被阻塞，适合对可用性要求极高的热点数据；缺点是会短暂读到旧值，并且实现更复杂。

选择哪一种，取决于业务更能接受「等一下」还是「旧一点」。

## 缓存雪崩：让失效时间错开

雪崩的关键词是「同时」。

最常见的诱因，是大量 Key 被设置了相同的 TTL。解决方式并不复杂：在基础 TTL 上增加一个随机偏移量。

```java
int ttl = 1800 + ThreadLocalRandom.current().nextInt(300);
redis.opsForValue().set(key, value, ttl, TimeUnit.SECONDS);
```

除此之外，还可以考虑：

- **多级缓存**：本地缓存挡住一部分流量，Redis 失效时仍有一层缓冲。
- **限流与降级**：数据库前加一道保护，避免被瞬间打穿。
- **高可用部署**：主从、哨兵或集群，降低缓存服务整体不可用的概率。

如果 Redis 真的整体不可用，任何应用层技巧都只是缓解。此时更重要的是快速失败、限流和降级，而不是让请求无限堆积。

## 一致性别忽略

解决了失效问题，还有一致性问题。

常见的更新策略是：**先更新数据库，再删除缓存**。它比「更新缓存」更稳妥，因为删除操作幂等，也不容易写入旧值。

在高并发下，仍可能出现「删除缓存后，旧读请求把旧值写回」的窗口。对此可以配合延迟双删、消息队列重试删除，或者订阅数据库变更日志（如 Canal）异步清理。

没有一种方案能覆盖所有场景。真正重要的是想清楚：业务能接受多长时间的旧数据？这个问题的答案，决定了你愿意付出多少复杂度。

## 一份简单的检查清单

上线前，可以快速过一遍这几个问题：

- 查询不存在的数据时，缓存层会发生什么？
- 热点 Key 过期的一瞬间，数据库能否扛住回源流量？
- 大量 Key 的过期时间是否足够分散？
- 缓存更新失败时，有没有重试或补偿？
- Redis 不可用时，系统是快速失败还是彻底雪崩？

把这些问题答清楚，比记住三个名词更有用。

缓存不是银弹，它只是用空间和一致性换取了响应速度。理解代价，才能用得踏实。
