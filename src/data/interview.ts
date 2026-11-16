export type InterviewQuestion = {
  id: string
  category: string
  question: string
  answer: string[]
  points?: string[]
}

export const interviewCategories = [
  'Java 基础',
  '集合',
  '并发',
  'JVM',
  'MySQL',
  'Redis',
  'Spring',
  '消息队列',
  '计算机网络',
  '操作系统',
  '场景设计',
]

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'java-jdk-jre-jvm',
    category: 'Java 基础',
    question: 'JDK、JRE、JVM 分别是什么，之间是什么关系？',
    answer: [
      'JVM 是执行字节码的虚拟机，它屏蔽了操作系统差异，让同一份 class 文件可以在不同平台上运行。JRE 是 Java 运行环境，包含 JVM 和运行所需的核心类库。JDK 则是在 JRE 之上再加上编译器、调试器等开发工具。',
      '所以三者的包含关系是 JDK ⊃ JRE ⊃ JVM。只运行程序装 JRE 就够，开发则必须装 JDK。',
    ],
    points: [
      'JVM 负责加载、验证、解释与即时编译字节码',
      'JRE = JVM + 核心类库',
      'JDK = JRE + javac、jstack、jmap 等工具',
    ],
  },
  {
    id: 'java-equals-hashcode',
    category: 'Java 基础',
    question: '== 和 equals 有什么区别？重写 equals 为什么还要重写 hashCode？',
    answer: [
      '对于基本类型，== 比较的是值；对于引用类型，== 比较的是对象地址。equals 是 Object 提供的方法，默认实现同样比较地址，但类可以重写它来表达「内容相等」，例如 String 比较的是字符序列。',
      'hashCode 的契约是：equals 相等的两个对象，hashCode 必须相等；hashCode 相等的对象，equals 不一定相等。如果只重写 equals，两个内容相同的对象会散列到不同桶里，HashSet、HashMap 就会出现「明明相等却找不到」的问题。',
    ],
  },
  {
    id: 'java-interface-abstract',
    category: 'Java 基础',
    question: '接口和抽象类应该怎么选？',
    answer: [
      '抽象类表达的是「is-a」的继承关系，可以有字段、构造器和普通方法，适合复用一部分实现；接口表达的是「can-do」的能力契约，一个类可以实现多个接口，更适合解耦和组合。',
      'Java 8 之后接口支持 default 和 static 方法，但接口仍然不能有实例字段和构造器。实际设计时，如果只是在若干个强相关类之间抽取公共逻辑，用抽象类；如果是定义一组可替换的能力，用接口。',
    ],
  },
  {
    id: 'java-exception',
    category: 'Java 基础',
    question: '受检异常和非受检异常有什么区别？异常处理有哪些常见误区？',
    answer: [
      '受检异常继承自 Exception 但不包括 RuntimeException，编译器强制要求调用方捕获或声明抛出，代表调用方可以合理恢复的外部问题；非受检异常继承自 RuntimeException，通常代表程序错误，例如空指针、数组越界。',
      '常见误区是捕获后不处理、用异常控制正常流程，以及在 finally 里 return 或抛异常覆盖原始异常。资源释放优先使用 try-with-resources，异常信息要保留 cause 链，避免只打印一句「系统错误」。',
    ],
  },
  {
    id: 'collection-arraylist-linkedlist',
    category: '集合',
    question: 'ArrayList 和 LinkedList 的差异是什么？日常为什么更常用 ArrayList？',
    answer: [
      'ArrayList 底层是动态数组，支持 O(1) 随机访问，尾部追加均摊 O(1)，中间插入删除需要移动元素；LinkedList 底层是双向链表，插入删除本身是 O(1)，但定位元素需要 O(n)，并且每个节点都有额外的指针开销。',
      '实际开发中大量操作是遍历和随机访问，数组连续内存对 CPU 缓存更友好，所以 ArrayList 通常是默认选择。只有在明确需要频繁在两端操作时，才会考虑 ArrayDeque 或 LinkedList。',
    ],
  },
  {
    id: 'collection-hashmap',
    category: '集合',
    question: 'HashMap 的底层结构是什么？扩容和树化的过程是怎样的？',
    answer: [
      'JDK 8 的 HashMap 是数组 + 链表 + 红黑树。插入时根据 hash 定位桶，冲突则挂在链表上；当链表长度达到 8 且数组容量不小于 64 时转为红黑树，退化到 6 时转回链表，避免极端冲突下查询退化为 O(n)。',
      '默认容量 16、负载因子 0.75，元素数量超过阈值就扩容为两倍。扩容时会重新分配元素：要么留在原位置，要么移动到「原位置 + 旧容量」，不需要重新计算完整 hash，这也是容量取 2 的幂的原因之一。',
    ],
  },
  {
    id: 'collection-hashmap-power-of-two',
    category: '集合',
    question: 'HashMap 的容量为什么一定是 2 的幂？',
    answer: [
      '定位桶时使用 (n - 1) & hash 代替取模。当 n 是 2 的幂时，n - 1 的二进制低位全是 1，按位与的结果等价于 hash % n，但位运算更快。',
      '同时，扩容为两倍后，元素的新位置只取决于 hash 在旧容量最高位上是 0 还是 1，因此可以把链表拆成低位和高位两条，避免逐个重新计算索引。容量不是 2 的幂时，这两种优化都会失效。',
    ],
  },
  {
    id: 'collection-concurrenthashmap',
    category: '集合',
    question: 'ConcurrentHashMap 是如何保证线程安全的？',
    answer: [
      'JDK 8 不再使用分段锁，而是对每个桶的头节点加 synchronized，写入前通过 CAS 尝试放置空桶。读操作大多不加锁，依靠 volatile 保证可见性，因此并发读的性能很好。',
      '扩容时支持多线程协助迁移，size 统计使用 CounterCell 分散热点。它不允许 null 键和 null 值，因为并发场景下无法区分「不存在」和「值为空」，这也是与 HashMap 的一个重要差异。',
    ],
  },
  {
    id: 'concurrent-threadpool',
    category: '并发',
    question: '线程池的核心参数有哪些？任务提交后的执行流程是什么？',
    answer: [
      '核心参数包括核心线程数、最大线程数、空闲存活时间、工作队列、线程工厂和拒绝策略。任务提交后，先看核心线程是否已满，未满就创建核心线程；核心线程满了进入队列；队列满了再创建非核心线程直到最大线程数；仍然无法处理时触发拒绝策略。',
      '不要直接使用 Executors 的快捷工厂：固定线程池使用无界队列，可能堆积大量任务导致 OOM；缓存线程池的最大线程数没有上限。更稳妥的做法是显式创建 ThreadPoolExecutor，根据业务 IO/CPU 比例估算线程数并设置容量有限的队列。',
    ],
    points: [
      'CPU 密集型：线程数接近核数',
      'IO 密集型：可适当放大，但要结合下游承载能力',
      '拒绝策略要结合业务选择，不能默认丢弃',
    ],
  },
  {
    id: 'concurrent-synchronized-lock',
    category: '并发',
    question: 'synchronized 和 ReentrantLock 有什么区别？',
    answer: [
      'synchronized 是 JVM 层面的关键字，加锁和解锁由编译器与虚拟机保证，异常时会自动释放；ReentrantLock 是 API 层面的实现，需要手动 unlock，通常放在 finally 中。',
      'ReentrantLock 提供了更灵活的能力：可中断获取锁、公平锁、超时尝试、多个 Condition 条件队列。synchronized 在 JDK 6 之后有偏向锁、轻量级锁等优化，简单同步场景优先使用它；需要高级能力时再选择 ReentrantLock。',
    ],
  },
  {
    id: 'concurrent-volatile',
    category: '并发',
    question: 'volatile 能解决什么问题，不能解决什么问题？',
    answer: [
      'volatile 保证变量的可见性和一定的有序性：写操作会立即刷回主内存，读操作会从主内存重新读取，并通过内存屏障禁止指令重排。它适合状态标志、双重检查锁中的单例引用等场景。',
      '它不保证原子性。像 count++ 这种读、改、写三步操作，即使变量是 volatile，多线程并发仍然会丢失更新，需要用 synchronized 或 AtomicInteger。',
    ],
  },
  {
    id: 'concurrent-threadlocal',
    category: '并发',
    question: 'ThreadLocal 的原理是什么？为什么会发生内存泄漏？',
    answer: [
      '每个 Thread 内部都有一个 ThreadLocalMap，key 是 ThreadLocal 对象本身，value 是线程私有的数据。因此不同线程访问同一个 ThreadLocal，读写的是各自线程里的那份副本，天然隔离。',
      'ThreadLocalMap 的 key 是弱引用，value 是强引用。线程池中的线程长期存活，如果 ThreadLocal 被回收而 value 没有被清理，就会出现 key 为 null 但 value 仍被引用的条目。使用完务必调用 remove，尤其是在线程池场景下。',
    ],
  },
  {
    id: 'jvm-memory',
    category: 'JVM',
    question: 'JVM 的运行时内存区域如何划分？哪些是线程私有的？',
    answer: [
      '线程私有的区域包括程序计数器、虚拟机栈和本地方法栈；线程共享的区域是堆和方法区（JDK 8 之后由元空间实现）。另外还有不属于运行时数据区的直接内存。',
      '堆存放对象实例，是垃圾回收的主战场；虚拟机栈为每个方法创建栈帧，保存局部变量表、操作数栈和返回地址；程序计数器记录当前线程执行到的字节码位置。方法区保存类元信息、常量池和静态变量。',
    ],
  },
  {
    id: 'jvm-object-allocation',
    category: 'JVM',
    question: '一个对象从创建到被使用，大致经历了什么？',
    answer: [
      '遇到 new 指令时，JVM 先检查类是否已加载，然后为对象分配内存。分配方式取决于堆是否规整：指针碰撞或空闲列表。为了减少并发竞争，线程会优先在自己的 TLAB 中分配。',
      '内存分配完成后，对象内存清零，设置对象头中的 Mark Word 和类型指针，再执行构造方法。经过逃逸分析，如果对象不会逃出方法，可能被栈上分配或标量替换，从而减少堆压力。',
    ],
  },
  {
    id: 'jvm-gc-roots',
    category: 'JVM',
    question: 'JVM 如何判断一个对象可以被回收？',
    answer: [
      '主流 JVM 使用可达性分析：从 GC Roots 出发遍历引用链，不可达的对象才可能被回收。GC Roots 包括虚拟机栈中引用的对象、方法区静态属性引用的对象、常量引用的对象、本地方法栈中 JNI 引用的对象等。',
      '引用计数法无法处理循环引用，因此不是 JVM 的选择。对象被标记后还有 finalize 阶段，但该方法执行时机不确定，不应依赖它做资源释放。',
    ],
  },
  {
    id: 'jvm-collectors',
    category: 'JVM',
    question: '常见的垃圾收集器有哪些？G1 和 CMS 的差异是什么？',
    answer: [
      '常见收集器包括 Serial、Parallel、CMS、G1、ZGC。Serial 适合单核小堆；Parallel 关注吞吐量；CMS 以低停顿为目标，但存在碎片和并发失败问题；G1 将堆划分为 Region，可以设定目标停顿时间；ZGC 通过并发标记与染色指针进一步降低停顿。',
      'G1 与 CMS 的核心差异在于内存布局和回收方式：CMS 是分代连续空间，G1 是分区式并按收益优先回收；G1 可以预测停顿，适合大堆和延迟敏感场景，也是 JDK 9 之后的默认收集器。',
    ],
  },
  {
    id: 'mysql-bplus-tree',
    category: 'MySQL',
    question: 'MySQL 的索引为什么选择 B+ 树，而不是 B 树或哈希表？',
    answer: [
      'B+ 树的非叶子节点只存键，不存数据，同样大小的页能容纳更多索引项，树高更低，磁盘 IO 更少；数据全部在叶子节点，并且叶子节点用链表相连，范围查询和排序非常高效。',
      'B 树的非叶子节点也存数据，扇出更小、树更高；哈希索引虽然等值查询是 O(1)，但不支持范围查询和排序，也无法利用最左前缀。InnoDB 的主键索引本身就是聚簇索引，叶子节点直接存放整行数据。',
    ],
  },
  {
    id: 'mysql-mvcc',
    category: 'MySQL',
    question: '事务的隔离级别有哪些？MVCC 是如何实现的？',
    answer: [
      '隔离级别从低到高是读未提交、读已提交、可重复读、串行化。InnoDB 默认使用可重复读，并通过 MVCC 让普通读不加锁也能获得一致性视图。',
      'MVCC 依赖三部分：隐藏的事务 ID 和回滚指针、undo log 中的版本链、以及 ReadView。读已提交在每次查询时生成新的 ReadView，可重复读在事务第一次查询时生成并复用，因此同一事务内能看到相同的快照。',
    ],
    points: [
      '快照读走 MVCC，当前读会加锁',
      '可重复读下仍可能出现幻读，需要间隙锁配合',
    ],
  },
  {
    id: 'mysql-index-failure',
    category: 'MySQL',
    question: '哪些情况下索引会失效？',
    answer: [
      '常见情况包括：对索引列做函数或运算、发生隐式类型转换、使用前导模糊匹配 like \'%xx\'、违反联合索引的最左前缀、使用 or 但两侧并非都有索引，以及优化器判断全表扫描成本更低。',
      '排查时先看 EXPLAIN 的 type、key 和 rows，确认是否真的走了索引，再结合慢查询日志定位。不要迷信「建了索引就一定快」，索引的选择最终由优化器基于统计信息决定。',
    ],
  },
  {
    id: 'mysql-slow-sql',
    category: 'MySQL',
    question: '一条慢 SQL 的排查与优化思路是什么？',
    answer: [
      '先通过慢查询日志或监控定位具体 SQL，再用 EXPLAIN 查看执行计划：是否全表扫描、是否回表、扫描行数是否过大、是否出现临时表或文件排序。',
      '优化通常从索引开始：补齐联合索引、使用覆盖索引减少回表、避免在索引列上做计算。分页过深时可以用游标或延迟关联；数据量确实过大时，再考虑归档、分表或引入缓存。',
    ],
  },
  {
    id: 'redis-fast',
    category: 'Redis',
    question: 'Redis 为什么快？单线程模型会不会成为瓶颈？',
    answer: [
      'Redis 快的主要原因是数据在内存中、核心命令执行是单线程因此没有锁竞争、使用 IO 多路复用处理连接、以及自身高效的数据结构。单线程指的是命令执行，不是整个服务只有一个线程。',
      'Redis 6.0 之后引入了多线程处理网络 IO，但命令仍然串行执行。由于单个命令通常极快，瓶颈更多来自网络往返、大 key、慢命令和持久化，而不是 CPU。',
    ],
  },
  {
    id: 'redis-cache-problems',
    category: 'Redis',
    question: '缓存穿透、击穿、雪崩分别是什么，如何应对？',
    answer: [
      '穿透是查询根本不存在的数据，请求每次都打到数据库；击穿是某个热点 key 失效的瞬间大量请求同时回源；雪崩是大量 key 同时过期或 Redis 整体不可用，导致数据库被瞬间压垮。',
      '穿透可以用空值缓存、布隆过滤器或参数校验；击穿可以用互斥锁重建或逻辑过期；雪崩则要打散过期时间、做多级缓存、限流降级，并保证 Redis 的高可用。',
    ],
  },
  {
    id: 'redis-persistence',
    category: 'Redis',
    question: 'RDB 和 AOF 的区别是什么？该如何选择？',
    answer: [
      'RDB 是某一时刻的内存快照，文件紧凑、恢复快，但两次快照之间的数据可能丢失；AOF 记录写命令，实时性好，但文件更大，恢复时需要重放命令。',
      '实际通常同时开启两者，或者使用混合持久化：以 RDB 作为基础快照，再追加增量 AOF，兼顾恢复速度与数据安全。具体策略要结合能容忍多少数据丢失来定。',
    ],
  },
  {
    id: 'redis-distributed-lock',
    category: 'Redis',
    question: '如何用 Redis 实现一个可靠的分布式锁？',
    answer: [
      '加锁使用 SET key value NX PX timeout，value 必须是当前线程或请求的唯一标识，避免误删别人的锁；解锁必须用 Lua 脚本先比较 value 再删除，保证判断与删除的原子性。',
      '锁的过期时间要覆盖业务执行时间，必要时通过看门狗续期。Redisson 已经封装了这些能力。集群环境下还要考虑主从切换导致锁丢失的问题，RedLock 是一种方案，但本身也存在争议，不能替代业务层的幂等。',
    ],
  },
  {
    id: 'spring-ioc',
    category: 'Spring',
    question: '什么是 IoC 和 DI？Spring 容器解决了什么问题？',
    answer: [
      'IoC 是控制反转：对象的创建和依赖关系不再由调用方主动 new，而是交给容器管理。DI 是依赖注入，是 IoC 的一种实现方式，容器在创建 Bean 时把依赖传进去。',
      '这样做降低了类之间的耦合，方便替换实现、统一管理生命周期，也为 AOP、事务等能力提供了切面入口。代价是对象关系变得隐式，排查问题时要理解容器的行为。',
    ],
  },
  {
    id: 'spring-bean-lifecycle',
    category: 'Spring',
    question: 'Spring Bean 的生命周期是怎样的？',
    answer: [
      '大致流程是：实例化、属性填充、调用 Aware 接口、执行 BeanPostProcessor 的前置处理、初始化方法（afterPropertiesSet 与 init-method）、执行后置处理、进入使用阶段，容器关闭时执行销毁方法。',
      '其中 BeanPostProcessor 是扩展的关键，AOP 代理通常就在后置处理阶段生成。理解生命周期有助于解释「为什么注入的属性在构造器里还是 null」以及初始化顺序问题。',
    ],
  },
  {
    id: 'spring-circular-dependency',
    category: 'Spring',
    question: 'Spring 如何解决循环依赖？哪些循环依赖解决不了？',
    answer: [
      'Spring 通过三级缓存解决单例 Bean 的字段注入循环依赖：一级缓存放完整 Bean，二级缓存放提前暴露的实例，三级缓存放生成代理的工厂。发生循环引用时，可以从三级缓存提前拿到引用，从而打破死循环。',
      '构造器注入的循环依赖无法解决，因为对象还没实例化就无法暴露引用；原型 Bean 也无法解决。Spring Boot 2.6 之后默认禁止循环依赖，本质上是在提醒我们重新审视设计。',
    ],
  },
  {
    id: 'spring-aop',
    category: 'Spring',
    question: 'Spring AOP 的原理是什么？为什么事务有时会失效？',
    answer: [
      'Spring AOP 基于动态代理：目标类实现了接口时默认使用 JDK 代理，否则使用 CGLIB 生成子类。代理对象在方法调用前后织入通知，实现日志、事务、权限等横切逻辑。',
      '事务失效的常见原因是方法自调用，调用的是 this 而不是代理对象；方法不是 public；异常被捕获没有抛出；或者抛出的是非 RuntimeException 且没有配置 rollbackFor。理解代理边界，很多「玄学失效」都能解释。',
    ],
  },
  {
    id: 'mq-why',
    category: '消息队列',
    question: '为什么要使用消息队列？引入 MQ 的代价是什么？',
    answer: [
      '消息队列主要解决三类问题：解耦，让生产者和消费者不必相互依赖；异步，把非核心链路从主流程中拆出去；削峰，用队列缓冲瞬时流量，保护下游系统。',
      '代价同样明显：系统复杂度上升，需要处理消息丢失、重复消费、顺序性和堆积；一致性问题从本地事务变成分布式问题；运维和排查成本也会增加。没有明确收益时，不要为了「架构感」引入 MQ。',
    ],
  },
  {
    id: 'mq-message-loss',
    category: '消息队列',
    question: '如何保证消息不丢失？',
    answer: [
      '消息可能在三个环节丢失：生产者到 Broker、Broker 内部存储、Broker 到消费者。生产端使用确认机制并处理失败重试；Broker 开启持久化并配置合适的刷盘策略；消费端处理成功后再手动 ack，失败时重试或进入死信队列。',
      '同时要接受「至少一次」而不是「恰好一次」的现实，通过业务幂等来消化重复消息。只做其中一环的可靠性，整体仍然可能丢消息。',
    ],
  },
  {
    id: 'mq-idempotent',
    category: '消息队列',
    question: '如何保证消息消费的幂等性？',
    answer: [
      '核心思路是让重复执行不产生额外副作用。常见方案包括：使用业务唯一键做数据库唯一约束；建立去重表记录已处理的消息 ID；用状态机限制流转，例如订单只能从待支付变为已支付一次。',
      '选择哪种方案取决于业务。唯一索引最简单可靠，但要注意事务边界；Redis 去重性能好，但要考虑过期与可靠性。幂等应该设计在消费端，而不是假设消息只会到达一次。',
    ],
  },
  {
    id: 'mq-backlog',
    category: '消息队列',
    question: '消息堆积了应该怎么处理？',
    answer: [
      '先定位原因：是生产端突增、消费者故障，还是单条消息处理过慢。短期可以扩容消费者、提高批量拉取与并发度，或把消息临时转存到其他主题；长期要优化消费逻辑，减少同步远程调用和锁竞争。',
      '还要注意不能盲目扩容：如果瓶颈在数据库或下游接口，增加消费者只会把压力转移过去。必要时先限流，再按优先级处理积压消息，避免雪崩。',
    ],
  },
  {
    id: 'java-string-immutable',
    category: 'Java 基础',
    question: 'String 为什么不可变？String、StringBuilder、StringBuffer 有什么区别？',
    answer: [
      '`String` 内部用 final 修饰的字符数组（JDK 9 之后是 byte 数组加编码标记）保存内容，并且不提供任何修改内容的方法，所有「修改」操作都会返回新对象；类本身也是 final，避免子类破坏不可变性。',
      '不可变带来几个好处：可以安全地作为 `HashMap` 的 key、天然线程安全、字符串常量池可以复用同一份实例。代价是频繁拼接会产生大量临时对象。',
      '`StringBuilder` 与 `StringBuffer` 都是可变字符序列，适合循环拼接。前者不加锁，性能更好，是单线程下的默认选择；后者方法用 synchronized 修饰，线程安全但有额外开销，现在使用较少。',
    ],
    points: [
      '循环内拼接应显式使用 StringBuilder，而不是依赖 + 号',
      'final 修饰引用只保证引用不变，不保证对象内容不可变',
    ],
  },
  {
    id: 'java-generics-erasure',
    category: 'Java 基础',
    question: '什么是泛型擦除？它带来了哪些限制？',
    answer: [
      'Java 泛型在编译期实现，编译后类型参数会被擦除为上界（无界时是 Object），并在需要的地方插入强制类型转换。因此运行时 `List<String>` 与 `List<Integer>` 是同一个类，这是为了兼容泛型出现之前的旧代码。',
      '擦除带来的限制包括：不能 new T()、不能直接创建泛型数组、不能对泛型类型使用 instanceof、静态成员不能使用类的类型参数，也无法仅根据泛型参数重载方法。',
      '如果需要运行时类型信息，可以显式传入 Class 对象，或者借助反射与 TypeReference 保留类型。桥接方法则是编译器为多态调用自动生成的补充方法。',
    ],
  },
  {
    id: 'java-final-finally-finalize',
    category: 'Java 基础',
    question: 'final、finally、finalize 有什么区别？',
    answer: [
      'final 是修饰符：修饰类表示不可被继承，修饰方法表示不可被重写，修饰变量表示只能赋值一次。对于引用变量，final 保证的是引用不变，对象内部状态仍然可以修改。',
      'finally 是异常处理结构的一部分，无论 try 是否抛异常都会执行，通常用来释放资源，只有 JVM 退出等极端情况才不执行。try-with-resources 是更推荐的资源管理方式。',
      'finalize 是 Object 的方法，在对象被回收前由 GC 调用，但执行时机不确定、可能只执行一次甚至不执行，还会拖慢回收。JDK 9 起已标记废弃，不应再用于资源释放。',
    ],
    points: [
      '不要在 finally 中 return 或抛异常，会覆盖原始异常',
      '资源释放优先使用 try-with-resources 或 Cleaner',
    ],
  },
  {
    id: 'collection-arraylist-grow-failfast',
    category: '集合',
    question: 'ArrayList 的扩容机制是怎样的？什么是 fail-fast？',
    answer: [
      'ArrayList 默认使用空数组，第一次添加元素时初始化为 10，之后每次扩容为原来的 1.5 倍，即 oldCapacity + (oldCapacity >> 1)，再通过数组拷贝迁移到新数组。扩容是 O(n) 的复制，已知数据量时应在构造器中指定初始容量。',
      'fail-fast 指迭代过程中如果集合被结构性修改（增删元素导致 modCount 变化），迭代器在下一次 next 时会抛出 ConcurrentModificationException。它通过比较 modCount 与 expectedModCount 实现，是一种尽力而为的检测机制。',
      'fail-fast 不是线程安全保证：多线程并发修改仍可能漏检。单线程中应使用 iterator.remove，并发场景应使用 `CopyOnWriteArrayList` 等并发容器或自行加锁。',
    ],
    points: [
      '增强 for 循环中直接 remove 会触发 fail-fast',
      '扩容通过 Arrays.copyOf 复制到新数组，开销与元素数量成正比',
    ],
  },
  {
    id: 'collection-hashmap-thread-unsafe',
    category: '集合',
    question: 'HashMap 为什么线程不安全？多线程下会出现什么问题？',
    answer: [
      '`HashMap` 没有任何同步措施，put 时对桶的读写、size 自增和扩容迁移都不是原子操作，多线程并发写入会相互覆盖，导致数据丢失。',
      'JDK 8 中并发扩容可能让两个线程同时迁移同一个桶，造成节点重复或丢失；JDK 7 的头插法在并发扩容时还可能形成环形链表，使 get 陷入死循环。此外 size 计数会不准确，modCount 被并发修改还会触发 fail-fast。',
      '解决方式是使用 `ConcurrentHashMap`，或者在外层加锁。Collections.synchronizedMap 虽然安全，但所有操作串行化，高并发下性能较差。',
    ],
  },
  {
    id: 'concurrent-thread-lifecycle',
    category: '并发',
    question: '线程的生命周期有哪几种状态？状态之间如何切换？',
    answer: [
      'Thread.State 中定义了六种状态：NEW、RUNNABLE、BLOCKED、WAITING、TIMED_WAITING、TERMINATED。新建的线程调用 start 后进入 RUNNABLE，等待 CPU 调度。',
      'BLOCKED 是等待进入 synchronized 临界区；WAITING 是调用 wait、join、park 后无限期等待，需要其他线程唤醒；TIMED_WAITING 是带超时的等待，例如 sleep 和带超时的 wait。',
      '状态之间可以双向流转：RUNNABLE 可能因抢锁失败进入 BLOCKED，也可能因等待条件进入 WAITING，被唤醒后回到 RUNNABLE。注意 sleep 不释放锁，wait 会释放锁。',
    ],
    points: [
      '线程不能重复 start，否则抛出 IllegalThreadStateException',
      'BLOCKED 只针对 synchronized，Lock 的等待属于 WAITING',
    ],
  },
  {
    id: 'concurrent-cas-aba',
    category: '并发',
    question: 'CAS 的原理是什么？ABA 问题如何解决？',
    answer: [
      'CAS 即比较并交换，包含内存位置、期望值和新值三个操作数，由 CPU 的原子指令保证比较与写入之间不被打断。Java 通过 Unsafe 的 compareAndSwap 系列方法暴露该能力，`AtomicInteger` 等原子类都基于它实现。',
      'ABA 指的是值从 A 改成 B 又改回 A，CAS 检查时认为没有变化，从而掩盖了中间状态。解决方式是附加版本号或时间戳，JDK 提供了 `AtomicStampedReference`。',
      'CAS 的其他问题是自旋失败时 CPU 空转开销大、只能保证单个变量的原子性，以及高竞争下大量线程反复失败。竞争激烈时加锁反而更合适。',
    ],
    points: [
      '自旋适合临界区短、竞争小的场景',
      '`AtomicReference` 可把多个字段封装为一个对象来保证整体原子性',
    ],
  },
  {
    id: 'concurrent-aqs-reentrantlock',
    category: '并发',
    question: 'AQS 的核心思想是什么？ReentrantLock 如何基于它实现？',
    answer: [
      'AQS 的核心是一个 volatile 的 int 状态 state 加一个 FIFO 双向等待队列，通过 CAS 修改 state 来抢占资源。子类只需实现 tryAcquire 和 tryRelease，定义「什么算获取成功」。',
      '`ReentrantLock` 用 state 表示重入次数：首次获取从 0 改为 1，同一线程再次获取则自增；释放时递减，减到 0 才真正释放并唤醒后继节点。',
      '获取失败的线程被包装成 Node 加入队列并 park，释放时 unpark 队首的后继节点。AQS 同时提供独占与共享两种模式，`CountDownLatch`、`Semaphore` 基于共享模式实现。',
    ],
    points: [
      '队列是 CLH 锁队列的变体，节点用前驱指针判断是否需要阻塞',
      '公平锁在获取前会先检查是否存在有效前驱节点',
    ],
  },
  {
    id: 'jvm-parent-delegation',
    category: 'JVM',
    question: '什么是双亲委派模型？它有什么作用？',
    answer: [
      '双亲委派指类加载器收到加载请求时，先委派给父加载器，父加载器无法完成时才自己尝试加载。层次依次是 Bootstrap、Platform（旧版本为 Extension）、Application 以及自定义加载器。',
      '作用是保证核心类库的唯一性和安全性：例如 java.lang.String 一定由 Bootstrap 加载，用户无法通过自定义类覆盖它；同时避免同一个类被不同加载器重复加载。',
      '它并非强制约束，可以重写 loadClass 打破。Tomcat 的 WebappClassLoader 为了让应用类优先于容器类就做了这类定制，SPI 机制和 JDK 9 的模块化也引入了新的委派方式。',
    ],
    points: [
      'loadClass 负责委派，findClass 才是真正加载',
      '同一个类被不同加载器加载会得到不同的 Class 对象',
    ],
  },
  {
    id: 'jvm-oom-leak',
    category: 'JVM',
    question: '如何排查内存泄漏与 OOM？',
    answer: [
      '先用监控和 jstat 观察老年代占用是否持续上升、Full GC 后是否不下降，确认存在泄漏后再用 jmap 导出堆转储，配合 MAT 分析支配树，找出占用最大的对象和引用链。',
      '常见泄漏来源包括静态集合不断累积、ThreadLocal 未 remove、监听器与回调未注销、连接或流未关闭、本地缓存没有上限。定位到具体业务对象后再回看代码。',
      '如果对象确实应该存在，那就是容量问题，可以调大堆、优化数据结构、分页或流式处理。还要区分 OOM 的类型，堆空间、元空间、直接内存和 GC 开销超限的处理方向完全不同。',
    ],
    points: [
      'dump 前评估文件大小和对线上性能的影响',
      '先看 GC 日志和监控趋势，不要直接 dump',
    ],
  },
  {
    id: 'mysql-acid',
    category: 'MySQL',
    question: '事务的 ACID 分别由什么保证？',
    answer: [
      '原子性由 undo log 保证：事务回滚时按 undo 记录反向恢复；持久性由 redo log 保证：先写日志再刷数据页，崩溃后可以重放。',
      '隔离性主要靠锁和 MVCC：写写之间用行锁，读写之间用 MVCC 提供一致性视图，不同隔离级别对应不同的实现强度。',
      '一致性是最终目标，由上述三者加上应用层的约束共同保证，例如唯一索引、外键和业务校验。数据库只提供机制，业务逻辑本身的正确性仍然要靠代码。',
    ],
    points: [
      'redo log 保证持久性，undo log 保证原子性',
      '一致性不是单独某个机制提供的',
    ],
  },
  {
    id: 'mysql-row-gap-next-key-lock',
    category: 'MySQL',
    question: 'InnoDB 的行锁、间隙锁、临键锁分别是什么？',
    answer: [
      '行锁锁住的是索引记录，而不是整行数据。如果查询没有走索引，InnoDB 会退化为锁住大量记录甚至全表，效果接近表锁。',
      '间隙锁锁的是索引记录之间的开区间，用于阻止其他事务在区间内插入，从而在可重复读下防止幻读。它只在可重复读隔离级别下明显生效，读已提交基本不使用。',
      '临键锁是记录锁加间隙锁，锁住左开右闭区间，是 InnoDB 在可重复读下的默认加锁单位。间隙锁之间不冲突，但会阻塞插入，因此应尽量让更新语句走唯一索引或主键，缩小加锁范围。',
    ],
    points: [
      '唯一索引等值命中时，临键锁会退化为记录锁',
      '间隙锁是防止幻读的关键机制',
    ],
  },
  {
    id: 'mysql-sharding-replication-lag',
    category: 'MySQL',
    question: '分库分表会带来哪些问题？如何应对主从延迟？',
    answer: [
      '分库分表能突破单机容量与连接数限制，但会带来跨库 join、分布式事务、全局排序分页、全局唯一主键和扩容迁移等问题，通常需要在中间件或应用层做路由与结果聚合。',
      '分片键的选择决定成败：要保证数据分布均匀，并且大多数查询能带上分片键，否则会退化为广播查询。常见做法是按用户 ID 哈希，把低频跨片查询交给离线数仓或冗余表。',
      '主从延迟的典型原因是主库并发写入、从库回放能力不足或存在大事务。应对包括写后读走主库、按业务区分强弱一致读、使用半同步复制、拆分大事务、开启并行复制，并对延迟做监控和降级。',
    ],
    points: [
      '不是所有表都需要分片，优先考虑索引优化和归档',
      '跨片分页通常需要各分片多取数据再归并',
    ],
  },
  {
    id: 'redis-data-structures',
    category: 'Redis',
    question: 'Redis 常见数据结构有哪些？底层是如何实现的？',
    answer: [
      '基础类型有 String、List、Hash、Set、ZSet。String 底层是 SDS，记录长度并预留空间，避免频繁扩容；List 在元素少时用 listpack，多时用 quicklist 串联；Hash 与 Set 在小规模时用 listpack 或 intset，增大后转为哈希表。',
      'ZSet 在元素少且较小时用 listpack，元素多或成员较大时使用跳表加字典：字典保证按成员 O(1) 查分数，跳表保证按分数范围查询和排名，平均复杂度为 O(log n)。',
      '跳表通过多级索引实现近似二分，实现比平衡树简单，范围遍历天然有序。此外还有 Bitmap、HyperLogLog、GEO、Stream 等扩展结构，分别用于位统计、基数估算、地理位置和消息流。',
    ],
    points: [
      '小数据量用紧凑编码，超过阈值才转为通用结构',
      '跳表查询从最高层开始逐层下降',
    ],
  },
  {
    id: 'redis-expire-eviction',
    category: 'Redis',
    question: 'Redis 的过期删除策略和内存淘汰策略有哪些？',
    answer: [
      '过期删除采用惰性删除加定期删除：访问 key 时才判断是否过期，同时后台周期性地随机抽查并清理。这样在 CPU 与内存之间折中，但可能残留过期 key。',
      '内存达到 maxmemory 时触发淘汰，策略包括 noeviction、volatile-lru、allkeys-lru、volatile-lfu、allkeys-lfu、volatile-random、allkeys-random、volatile-ttl。',
      '缓存场景通常用 allkeys-lru 或 allkeys-lfu；存储不能丢的数据时用 volatile-* 配合 noeviction 兜底。LRU 关注最近是否使用，LFU 关注使用频率，后者更抗偶发访问。',
    ],
    points: [
      'Redis 的 LRU 是近似实现，采样若干 key 后淘汰最久未用的',
      '过期删除与内存淘汰是两套独立机制',
    ],
  },
  {
    id: 'redis-replication-sentinel-cluster',
    category: 'Redis',
    question: 'Redis 的主从、哨兵、集群有什么区别？',
    answer: [
      '主从复制解决数据备份与读扩展：从节点异步复制主节点数据，主节点故障后需要人工或外部工具切换，不能自动选主。',
      '哨兵在复制基础上增加了监控、自动故障转移和配置通知，客户端通过哨兵获取当前主节点地址。它解决了高可用问题，但容量仍受单机限制。',
      '集群模式通过分槽把数据分布到多个主节点，每个主节点带从节点，支持水平扩容和自动故障转移，但跨槽的多 key 操作受限，需要 hash tag，运维复杂度也更高。',
    ],
    points: [
      '主从复制是哨兵和集群的基础',
      '集群至少需要三个主节点才能形成多数派',
    ],
  },
  {
    id: 'spring-mvc-request-flow',
    category: 'Spring',
    question: 'Spring MVC 的请求处理流程是怎样的？',
    answer: [
      '请求先到达前端控制器 DispatcherServlet，它根据 HandlerMapping 找到对应的处理器和拦截器链，再通过 HandlerAdapter 调用控制器方法。',
      '控制器返回 ModelAndView 或响应体：返回视图时由 ViewResolver 解析并渲染；使用 @ResponseBody 时由 HttpMessageConverter 序列化输出。',
      '过程中拦截器的 preHandle 在调用前执行，postHandle 在视图渲染前执行，afterCompletion 在请求完成后执行，异常由 HandlerExceptionResolver 处理。',
    ],
    points: [
      'DispatcherServlet 是整个流程的调度中心',
      '拦截器基于 HandlerExecutionChain 生效',
    ],
  },
  {
    id: 'spring-boot-autoconfiguration',
    category: 'Spring',
    question: 'Spring Boot 的自动配置原理是什么？',
    answer: [
      'Spring Boot 通过 @SpringBootApplication 组合了 @EnableAutoConfiguration，后者借助 AutoConfigurationImportSelector 读取 META-INF 下的自动配置类清单，再按条件筛选后注册为 Bean。',
      '筛选依赖一系列条件注解：@ConditionalOnClass 判断类路径是否存在，@ConditionalOnMissingBean 保证用户自定义优先，还有 @ConditionalOnProperty 等。',
      '配置属性通过 @ConfigurationProperties 绑定到外部配置。整体思路是约定优于配置：框架提供默认实现，用户只需覆盖需要的部分，也可以在自己的 starter 中提供自动配置清单。',
    ],
    points: [
      '自动配置类本身也是普通配置类',
      '条件注解决定配置是否真正生效',
    ],
  },
  {
    id: 'spring-transaction-propagation',
    category: 'Spring',
    question: 'Spring 的事务传播行为有哪些？REQUIRED 和 REQUIRES_NEW 有什么区别？',
    answer: [
      '传播行为定义事务方法被另一个事务方法调用时如何共享事务，共七种：REQUIRED、REQUIRES_NEW、SUPPORTS、NOT_SUPPORTED、MANDATORY、NEVER、NESTED。',
      'REQUIRED 是默认值：有事务就加入，没有就新建，内外层共用一个事务，任一环节回滚都会导致整体回滚。',
      'REQUIRES_NEW 会挂起当前事务并开启全新事务，两者互不影响：内层回滚不影响外层，外层回滚也不会回滚已提交的内层。适合记录日志等不希望随主业务回滚的场景，但会额外占用一个数据库连接，嵌套过深有连接池耗尽的风险。',
    ],
    points: [
      'NESTED 基于保存点，回滚只影响嵌套部分',
      '传播行为只在通过代理调用时生效',
    ],
  },
  {
    id: 'mq-ordering',
    category: '消息队列',
    question: '如何保证消息的顺序性？',
    answer: [
      '顺序性有两个层面：生产端要保证同一业务键的消息进入同一个分区或队列，消费端要保证同一个队列只被一个消费者串行处理。',
      'Kafka 只保证分区内有序，需要按业务键选择分区；RocketMQ 提供顺序消息，按队列严格有序；RabbitMQ 在单队列单消费者时可以保证顺序。',
      '失败重试也会破坏顺序：重试消息若直接回到队尾就会插队，应放入重试队列并暂停后续消费，或者在消费端用业务版本号、序列号做校验与丢弃。',
    ],
    points: [
      '全局有序通常意味着牺牲并发度',
      '消费端多线程处理同一队列也会乱序',
    ],
  },
  {
    id: 'mq-selection',
    category: '消息队列',
    question: 'RabbitMQ、Kafka、RocketMQ 应该如何选型？',
    answer: [
      'RabbitMQ 基于 Erlang，延迟低、路由灵活，适合中小规模且对可靠性要求高的业务消息，但吞吐量相对有限，大量堆积时性能下降明显。',
      'Kafka 为高吞吐设计，适合日志、埋点、流式处理等大数据场景，生态成熟，但延迟和运维成本更高，消息模型相对简单。',
      'RocketMQ 在吞吐与功能之间折中，支持事务消息、顺序消息、延迟消息和消息回溯，适合电商交易类场景。选型要结合吞吐量、延迟、顺序与事务需求以及团队运维能力，而不是只看压测数字。',
    ],
    points: [
      '先明确业务是业务消息还是数据流',
      '社区活跃度和团队经验也是重要因素',
    ],
  },
  {
    id: 'network-tcp-handshake',
    category: '计算机网络',
    question: 'TCP 为什么需要三次握手？四次挥手又是为什么？',
    answer: [
      '三次握手的过程是：客户端发送 SYN 并带上初始序列号；服务端回复 SYN + ACK，确认客户端并给出自己的序列号；客户端再发 ACK 确认。之后双方进入 ESTABLISHED。',
      '需要三次是因为 TCP 是全双工，双方都要确认「我能发、你能收」。两次握手时服务端无法确认客户端是否收到了自己的 SYN，历史连接请求还可能造成错误建连。三次握手可以同步双方初始序列号并完成双向确认。',
      '四次挥手是因为 TCP 连接是全双工的：主动方发 FIN 表示没有数据要发了，被动方先回 ACK，等自己的数据发完再发 FIN，主动方最后回 ACK 并进入 TIME_WAIT。TIME_WAIT 等待 2MSL，是为了确保最后一个 ACK 能到达，并让旧连接的残留报文在网络中消失。',
    ],
    points: [
      'SYN 会消耗序列号，因此需要 ACK 确认',
      'TIME_WAIT 过长会占用端口，可通过连接复用缓解',
    ],
  },
  {
    id: 'network-http-https',
    category: '计算机网络',
    question: 'HTTP 和 HTTPS 有什么区别？TLS 握手过程是怎样的？',
    answer: [
      'HTTP 明文传输，内容可被窃听和篡改；HTTPS 是 HTTP over TLS，在传输层之上加密，提供机密性、完整性和身份认证，默认端口是 443。',
      'TLS 握手大致过程：客户端发送支持的版本、密码套件和随机数；服务端返回证书和随机数；客户端验证证书链，生成预主密钥并用证书公钥加密发送；双方用这些随机数推导会话密钥，之后使用对称加密通信。',
      '非对称加密只用于密钥交换和身份认证，因为开销大；实际数据传输使用对称加密。TLS 1.3 简化了握手流程，支持 1-RTT 甚至 0-RTT 恢复，并移除了不安全的算法。',
    ],
    points: [
      '证书解决的是「对方是谁」，加密解决的是「内容不被看见」',
      'HTTPS 不能防止服务端本身作恶',
    ],
  },
  {
    id: 'network-url-to-render',
    category: '计算机网络',
    question: '从输入 URL 到页面展示，中间发生了什么？',
    answer: [
      '浏览器先解析 URL 并查询各级缓存，再经 DNS 解析得到 IP，随后建立 TCP 连接，HTTPS 还要完成 TLS 握手。',
      '连接建立后发送 HTTP 请求，服务端可能经过负载均衡、反向代理和应用处理并返回响应；浏览器根据 Content-Type 解析资源，构建 DOM 和 CSSOM，合并为渲染树，再进行布局和绘制，遇到脚本会阻塞解析。',
      '页面加载过程中还会并行请求图片、样式、脚本等子资源，并受连接数、缓存和优先级策略影响。整个过程可以分为导航、网络、渲染几个阶段，排查性能时应先定位耗时在哪一段。',
    ],
    points: [
      'DNS 解析和 TLS 握手是常见的首屏优化点',
      'JS 阻塞解析，CSS 阻塞渲染',
    ],
  },
  {
    id: 'network-http-versions',
    category: '计算机网络',
    question: 'HTTP/1.1、HTTP/2、HTTP/3 有什么区别？',
    answer: [
      'HTTP/1.1 支持持久连接和管道化，但存在队头阻塞，浏览器需要为同一域名开多个连接；每个请求都要携带完整头部，冗余较大。',
      'HTTP/2 引入二进制分帧和多路复用，多个请求共享一个 TCP 连接，支持头部压缩 HPACK 和服务端推送；但 TCP 层仍可能因丢包导致整条连接阻塞。',
      'HTTP/3 基于 QUIC（UDP），在用户态实现可靠传输，流之间互不影响，支持 0-RTT 建连和连接迁移，减少了握手与队头阻塞带来的延迟。',
    ],
    points: [
      'HTTP/2 解决的是应用层队头阻塞',
      'HTTP/3 解决的是传输层队头阻塞',
    ],
  },
  {
    id: 'os-process-thread-coroutine',
    category: '操作系统',
    question: '进程、线程、协程有什么区别？',
    answer: [
      '进程是资源分配的基本单位，拥有独立的地址空间；线程是 CPU 调度的基本单位，同一进程内的线程共享堆和代码段，各自拥有栈和寄存器。进程间通信需要管道、共享内存、消息队列、socket 等方式，线程间通信成本低但要注意同步。',
      '协程是用户态的轻量级线程，由程序自己调度，切换不经过内核，开销远小于线程，适合高并发 IO 场景。一个线程可以承载大量协程，但协程本身不能利用多核，需要与多线程配合。',
      '选择上：需要隔离和稳定性用进程，需要共享数据、并行计算用线程，IO 密集且并发量大时用协程。协程不是银弹，阻塞调用仍会卡住承载它的线程。',
    ],
    points: [
      '线程切换需要内核态参与，协程切换在用户态完成',
      '进程崩溃通常不会影响其他进程，线程崩溃可能拖垮整个进程',
    ],
  },
  {
    id: 'os-virtual-memory',
    category: '操作系统',
    question: '什么是虚拟内存？它有什么作用？',
    answer: [
      '虚拟内存为每个进程提供独立的连续地址空间，由页表映射到物理内存或磁盘。程序访问的是虚拟地址，MMU 结合页表完成地址翻译，进程因此不需要关心物理内存布局。',
      '作用是隔离进程、允许内存超配、简化链接与内存管理，并通过按需分页只加载真正访问的页。缺页时触发中断，从磁盘换入所需页面，必要时按 LRU 等策略换出。',
      '代价是地址翻译开销和缺页延迟，因此引入 TLB 缓存页表项、多级页表减少空间占用。虚拟内存也让文件映射、共享内存和写时复制等机制成为可能。',
    ],
    points: [
      '页表项记录物理页号与权限位',
      '频繁缺页会导致性能急剧下降',
    ],
  },
  {
    id: 'os-io-models',
    category: '操作系统',
    question: '五种 IO 模型分别是什么？IO 多路复用的原理是什么？',
    answer: [
      '五种 IO 模型是：阻塞 IO、非阻塞 IO、IO 多路复用、信号驱动 IO、异步 IO。前四种在数据从内核拷贝到用户空间时仍然是同步的，只有异步 IO 是内核完成全部工作后再通知应用。',
      '阻塞 IO 在等待数据期间线程挂起；非阻塞 IO 需要应用不断轮询，空转浪费 CPU；多路复用通过 select、poll、epoll 同时监听多个文件描述符，就绪后再处理。',
      'epoll 用红黑树管理 fd、用就绪链表返回事件，避免了 select 的遍历和数量限制，在连接多但活跃数少的场景下效率更高。IO 多路复用是 Redis、Nginx、Netty 高并发的基础。',
    ],
    points: [
      'select 和 poll 每次调用都要把 fd 集合拷贝进内核',
      'epoll 支持水平触发和边缘触发',
    ],
  },
  {
    id: 'design-idempotent',
    category: '场景设计',
    question: '接口幂等有哪些实现方案？',
    answer: [
      '幂等的核心是让同一个请求执行多次与执行一次的结果一致。实现的前提是先确定唯一标识：客户端生成的请求 ID、业务单号，或者由关键参数组合成的唯一键。',
      '常见方案包括数据库唯一索引、去重表、状态机流转、Redis 的 SET NX 记录请求 ID，以及乐观锁版本号。金融类场景通常要求数据库唯一约束兜底，缓存方案只能作为前置过滤。',
      '还要注意并发窗口：先查询再插入不是原子的，应依赖唯一约束或分布式锁。重复请求的返回值要与首次一致，否则调用方可能继续重试，幂等就失去了意义。',
    ],
    points: [
      '幂等要设计在服务端，不能假设调用方只请求一次',
      '去重记录需要设置合理的保留时间',
    ],
  },
  {
    id: 'design-distributed-id',
    category: '场景设计',
    question: '分布式 ID 有哪些生成方案？各自有什么取舍？',
    answer: [
      'UUID 本地生成、无网络开销，但无序且较长，作为 InnoDB 主键会加剧页分裂。数据库自增简单可靠，但依赖单点，分库分表后需要设置步长或改用号段。',
      '号段模式从数据库批量取一段 ID 在内存中分配，兼顾有序与性能，是很多公司的基础方案。Redis 的 INCR 性能好，但要考虑持久化与高可用。',
      '雪花算法由时间戳、机器 ID 和序列号组成，趋势递增、性能高，但依赖时钟，发生回拨时需要处理，机器 ID 也要统一分配。选型要看是否需要趋势有序、能否容忍时钟依赖以及系统规模。',
    ],
    points: [
      '趋势递增对 InnoDB 聚簇索引更友好',
      '雪花算法的机器 ID 分配必须唯一',
    ],
  },
  {
    id: 'design-rate-limit',
    category: '场景设计',
    question: '常见限流算法有哪些？令牌桶和漏桶有什么区别？',
    answer: [
      '常见限流算法有固定窗口、滑动窗口、漏桶和令牌桶。固定窗口实现简单，但存在临界突刺问题；滑动窗口把时间切细，精度更高，代价是存储更多计数。',
      '漏桶以固定速率流出，请求先入桶，桶满则拒绝，输出绝对平滑，适合保护下游；令牌桶按固定速率放入令牌，桶内可以积累令牌，因此允许一定程度的突发流量。',
      '实现上单机可以用 Guava RateLimiter 或 Semaphore，分布式用 Redis 加 Lua 保证原子性。限流还要配合降级与排队策略，并区分接口、用户、IP 等维度。',
    ],
    points: [
      '令牌桶允许突发，漏桶不允许',
      '分布式限流要注意时钟与原子性',
    ],
  },
  {
    id: 'design-cache-consistency',
    category: '场景设计',
    question: '如何保证缓存与数据库的一致性？',
    answer: [
      '常见做法是先更新数据库再删除缓存（Cache Aside）。不先删缓存再更新数据库，是因为并发读可能把旧值重新写回缓存；删除而不是更新缓存，是为了避免并发写入的顺序问题。',
      '删除缓存仍可能失败，可以用重试、消息队列补偿或订阅 binlog 异步删除。延迟双删是在更新后延迟一段时间再删一次，用来覆盖读请求回填旧值的窗口，但不能保证强一致。',
      '对一致性要求高的场景，可以让读请求串行化或加分布式锁，或者直接以数据库为准并缩短缓存 TTL。多数业务接受最终一致，关键是评估不一致窗口对业务的影响。',
    ],
    points: [
      '缓存和数据库没有天然的强一致方案',
      '评估一致性应先明确可接受的不一致时长',
    ],
  },
]
