export type Project = {
  id: string
  index: string
  name: string
  latin: string
  summary: string
  year: string
  status: string
  tags: string[]
  tone: 'sage' | 'peach' | 'lilac' | 'sky' | 'clay'
  details: { label: string; text: string }[]
}

export const projects: Project[] = [
  {
    id: 'tracesage',
    index: '01',
    name: 'TraceSage',
    latin: 'TRACESAGE / DISTRIBUTED TRACING',
    summary:
      '基于 DDD 四层架构的微服务可观测平台：网关生成 TraceId，埋点采集调用链，落库后还原成瀑布图与服务拓扑。',
    year: '2026',
    status: '进行中',
    tags: ['Spring Cloud', 'DDD', 'RabbitMQ', 'Elasticsearch'],
    tone: 'sage',
    details: [
      {
        label: '架构与公共模块',
        text: '按 IAM、Tracing 两个业务模块拆分微服务，代码按 DDD 四层架构组织；把返回封装、认证鉴权、数据访问抽成公共模块，通过 Spring Boot 自动装配开箱即用，减少重复开发。',
      },
      {
        label: '网关收口与链路标识',
        text: '由网关统一完成请求鉴权，生成并向下游透传 TraceId 等身份信息；一次请求全链路携带同一个 TraceId，日志与调用记录都能串起来，故障定位有了统一入口。',
      },
      {
        label: '链路采集与落库',
        text: '通过埋点 SDK 采集调用链数据，经 RabbitMQ 异步上报；消费端清洗后落库，利用 span_id 主键唯一约束保证消息幂等。MySQL 作为权威存储，Elasticsearch 冗余一份用于检索，双写失败只记录告警、不影响链路入库。',
      },
      {
        label: '链路检索与拓扑',
        text: '基于 Elasticsearch 聚合查询实现链路列表、调用瀑布与服务拓扑；列表接口不返回大字段、分页参数设置上限，控制响应体积并优化查询性能。',
      },
      {
        label: '统一响应与异常',
        text: '统一接口返回结构，把业务异常、未认证、无权限三类异常分别映射为不同状态码，网关与服务端分级兜底，保证各类异常都返回结构化的 JSON 响应。',
      },
    ],
  },
  {
    id: 'mukobazaar',
    index: '02',
    name: 'MukoBazaar',
    latin: 'MUKOBAZAAR / PERSONAL MARKETPLACE',
    summary:
      '从零搭建的 B2C 前后端分离商城后端：商品、购物车、订单、支付与搜索串成一条完整链路。',
    year: '2026',
    status: '已完成',
    tags: ['Spring Boot', 'Redis', 'RabbitMQ', 'Elasticsearch'],
    tone: 'clay',
    details: [
      {
        label: '核心业务',
        text: '负责商品、购物车、订单、支付、优惠券、评价及后台管理等模块的接口开发，完成表结构设计与接口文档编写，用明确的状态机管理订单流转，让异常分支也有可预期的出口。',
      },
      {
        label: '登录鉴权',
        text: '基于 RBAC 模型完成身份认证与接口级权限校验，Token 存储于 Redis，支持主动退出登录。',
      },
      {
        label: '商品检索',
        text: '使用 Elasticsearch 实现全文检索与多条件筛选，替代数据库模糊查询；Elasticsearch 异常时自动回退数据库查询，保证检索可用性。',
      },
      {
        label: '缓存与库存',
        text: '采用 Caffeine 与 Redis 两级缓存加速热点商品访问；通过用户维度幂等防止重复下单，库存条件更新防止超卖。',
      },
      {
        label: '消息与订单',
        text: '使用 RabbitMQ 延迟消息实现订单超时关闭、库存回补与优惠券释放。',
      },
    ],
  },
  {
    id: 'zhiyu',
    index: '03',
    name: '知屿',
    latin: 'ZHIYU / RAG ASSISTANT',
    summary: '把散落的文档变成可以对话的知识库，支持流式回答与引用溯源。',
    year: '2026',
    status: '进行中',
    tags: ['LangChain4j', 'RAG', 'PostgreSQL', 'React'],
    tone: 'lilac',
    details: [
      {
        label: '切分策略',
        text: '按标题层级与语义段落切分文档，保留来源与章节元数据，让每一次召回都有上下文可依。',
      },
      {
        label: '检索链路',
        text: '向量召回叠加关键词检索，对候选片段进行重排，减少「看起来相关」却答非所问的噪声。',
      },
      {
        label: '回答体验',
        text: '通过 SSE 流式输出答案，并在文末标注引用片段，让用户可以回到原文自行验证。',
      },
    ],
  },
  {
    id: 'bubble-lab',
    index: '04',
    name: '泡泡实验室',
    latin: 'BUBBLE LAB / PLAYGROUND',
    summary: '这个站点里的一页互动实验：柔软的泡泡物理，加上三款两分钟的小游戏。',
    year: '2026',
    status: '持续更新',
    tags: ['React', 'TypeScript', 'CSS', 'Interaction'],
    tone: 'sky',
    details: [
      {
        label: '轻量物理',
        text: '用 requestAnimationFrame 驱动泡泡的漂浮与避让，所有位移都在 GPU 友好的 transform 上完成。',
      },
      {
        label: '游戏设计',
        text: '记忆配对、色感挑战与反应测试刻意保持短小，适合在阅读的间隙玩一局。',
      },
      {
        label: '体验降级',
        text: '尊重系统的「减少动态效果」设置，让动效成为加分项，而不是使用门槛。',
      },
    ],
  },
]
