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
    id: 'zhiyu',
    index: '01',
    name: '知屿',
    latin: 'ZHIYU / RAG ASSISTANT',
    summary: '把散落的文档变成可以对话的知识库，支持流式回答与引用溯源。',
    year: '2026',
    status: '进行中',
    tags: ['LangChain4j', 'RAG', 'PostgreSQL', 'React'],
    tone: 'sage',
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
    id: 'mukobazaar',
    index: '02',
    name: 'MukoBazaar',
    latin: 'MUKOBAZAAR / PERSONAL MARKETPLACE',
    summary: '从零设计的个人集市项目：把商品、订单、搜索与异步消息串成一条完整链路。',
    year: '2026',
    status: '已完成',
    tags: ['Spring Boot', 'Redis', 'RabbitMQ', 'Elasticsearch'],
    tone: 'clay',
    details: [
      {
        label: '业务闭环',
        text: '围绕用户、商品、购物车与订单搭建主流程，用明确的状态机管理订单流转，让异常分支也有可预期的出口。',
      },
      {
        label: '异步与一致性',
        text: '把下单后的通知、库存确认等非核心动作交给 RabbitMQ，消费端以业务唯一键保证幂等，关键校验仍留在同步链路。',
      },
      {
        label: '搜索与体验',
        text: '商品检索接入 Elasticsearch，支持关键词、分类与价格筛选，并通过增量同步把 MySQL 的变更维护到索引里。',
      },
    ],
  },
  {
    id: 'bubble-lab',
    index: '03',
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
