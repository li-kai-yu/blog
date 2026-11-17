import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { site } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

type ResumeProject = {
  name: string
  latin: string
  meta: string
  stack: string
  summary: string
  points: { index: string; label: string; text: string }[]
}

const strengths = [
  {
    label: 'Java',
    text: '掌握集合、多线程与线程池，了解 JVM 内存结构与垃圾回收机制。',
  },
  {
    label: 'MySQL',
    text: '掌握索引、事务与锁机制，能借助执行计划分析并优化慢 SQL。',
  },
  {
    label: 'Redis',
    text: '掌握常用数据结构与缓存方案，了解缓存穿透、击穿、雪崩及分布式锁。',
  },
  {
    label: '框架与中间件',
    text: '熟练使用 Spring Boot、MyBatis-Plus，了解 Nacos、Gateway 等微服务组件及 RabbitMQ、Elasticsearch 的基本原理与用法；熟悉 Git、Maven。',
  },
]

const projects: ResumeProject[] = [
  {
    name: 'TraceSage 分布式链路追踪平台',
    latin: 'TRACESAGE / DISTRIBUTED TRACING',
    meta: '独立开发 · 2026.08 – 至今',
    stack:
      'Java 17 / Spring Boot 3 / Spring Cloud Gateway / MyBatis-Plus / MySQL / Redis / RabbitMQ / Elasticsearch',
    summary:
      '基于 DDD 四层架构的微服务可观测平台，用于分布式系统的链路追踪与故障定位，按 IAM、Tracing 两个业务模块拆分服务。',
    points: [
      {
        index: '01',
        label: '架构与公共模块',
        text: '按 IAM、Tracing 两个业务模块拆分微服务，代码按 DDD 四层架构组织，并抽取返回封装、认证鉴权、数据访问等公共模块，通过 Spring Boot 自动装配实现开箱即用，减少重复开发。',
      },
      {
        index: '02',
        label: '网关收口与链路标识',
        text: '由网关统一完成请求鉴权，并生成、透传 TraceId 等身份信息，下游服务直接使用；一次请求全链路携带同一 TraceId，便于故障定位与日志关联。',
      },
      {
        index: '03',
        label: '链路采集与落库',
        text: '通过埋点 SDK 采集调用链数据，经 RabbitMQ 异步上报；消费端完成数据清洗后落库，利用 span_id 主键唯一约束保证消息幂等；MySQL 作为权威存储，Elasticsearch 冗余一份用于检索，双写失败仅记录告警、不影响链路入库。',
      },
      {
        index: '04',
        label: '链路检索与拓扑',
        text: '基于 Elasticsearch 聚合查询实现链路列表、调用瀑布与服务拓扑；列表接口不返回大字段、分页参数设置上限，控制响应体积并优化查询性能。',
      },
      {
        index: '05',
        label: '统一响应与异常',
        text: '统一接口返回结构，将业务异常、未认证、无权限三类异常分别映射为不同状态码，网关与服务端分级兜底，保证各类异常均返回结构化的 JSON 响应。',
      },
    ],
  },
  {
    name: 'MukoBazaar 商城系统',
    latin: 'MUKOBAZAAR / B2C MARKETPLACE',
    meta: '独立开发 · 2026.06 – 2026.08',
    stack: 'Java 17 / Spring Boot 3 / MyBatis-Plus / MySQL / Redis / RabbitMQ',
    summary:
      '从零搭建的 B2C 前后端分离商城后端，负责表结构、接口设计与环境部署，覆盖商品、购物车、订单、支付、优惠券、评价及后台管理。',
    points: [
      {
        index: '01',
        label: '缓存双写',
        text: '每日凌晨及服务启动时将热点商品与库存数据同步写入缓存，保证接口响应速度；库存出现不一致时以数据库为准强制覆盖缓存，避免脏数据长期存在。',
      },
      {
        index: '02',
        label: '库存防超卖',
        text: '针对高并发下同一商品重复售卖的痛点，采用 Redis 原子预扣减、RabbitMQ 异步落库与数据库乐观锁兜底的方案；同时设计 15 分钟预扣减缓存与定时任务扫描的补偿机制，保证最终一致性。',
      },
      {
        index: '03',
        label: '支付回调幂等',
        text: '针对微信、支付宝重复回调导致的重复发货风险，引入订单状态机（待支付 / 支付中 / 已发货）与数据库唯一索引，保证重复回调下只处理一次。',
      },
      {
        index: '04',
        label: '防刷与缓存治理',
        text: '使用布隆过滤器配合 Lua 脚本限流拦截恶意并发请求；采用分布式锁与缓存双写策略，处理热点商品（如节假日促销商品）的缓存穿透与击穿问题。',
      },
    ],
  },
]

export default function Resume() {
  usePageMeta(
    `简历 · ${site.name}`,
    'Elio Li 的 Java 后端开发实习简历：教育背景、专业技能与项目经历。',
  )

  return (
    <>
      <section className="page-head container resume-head">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          RESUME / ONE PAGE
        </p>
        <h1>
          一份简历，
          <br />
          把做过的事<span className="ink-mark">讲清楚。</span>
        </h1>
        <p className="page-head__lead">
          Java 后端开发实习 · {site.grade} · 2029 届
          <br />
          教育背景、专业技能与项目经历，都整理在这一页里。
        </p>
        <div className="resume-actions">
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            打印 / 保存 PDF
            <ArrowUpRight />
          </button>
          <Link to="/about" className="btn btn--ghost">
            返回关于
            <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="container resume-wrap">
        <article className="resume-sheet">
          <header className="resume-sheet__head">
            <div className="resume-sheet__intro">
              <p className="resume-sheet__eyebrow">JAVA BACKEND ENGINEER · INTERN</p>
              <h2>{site.name}</h2>
              <p className="resume-sheet__role">Java 后端开发工程师（实习）</p>
              <p className="resume-sheet__meta">
                2029 届 · {site.grade} · 求职意向：Java 后端开发实习
              </p>
            </div>

            <ul className="resume-contact">
              <li>
                <span>EMAIL</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span>LOCATION</span>
                <strong>
                  {site.location} · {site.school}
                </strong>
              </li>
            </ul>
          </header>

          <section className="resume-section">
            <div className="resume-section__title">
              <h3>教育背景</h3>
              <em>EDUCATION</em>
            </div>
            <div className="resume-edu">
              <div>
                <strong>{site.school}</strong>
                <span>{site.major}（本科）</span>
              </div>
              <time>{site.period}</time>
            </div>
            <p className="resume-section__desc">
              主修课程：数据结构、操作系统、计算机网络、数据库原理、Java 程序设计。
            </p>
          </section>

          <section className="resume-section">
            <div className="resume-section__title">
              <h3>个人优势</h3>
              <em>STRENGTHS</em>
            </div>
            <ul className="resume-strengths">
              {strengths.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-section">
            <div className="resume-section__title">
              <h3>项目经历</h3>
              <em>PROJECTS</em>
            </div>

            {projects.map((project) => (
              <article className="resume-project" key={project.name}>
                <header className="resume-project__head">
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.latin}</p>
                  </div>
                  <span>{project.meta}</span>
                </header>

                <p className="resume-project__stack">
                  <span>技术栈</span>
                  {project.stack}
                </p>
                <p className="resume-project__summary">{project.summary}</p>

                <ol className="resume-project__points">
                  {project.points.map((point) => (
                    <li key={point.index}>
                      <span className="resume-project__index">{point.index}</span>
                      <div>
                        <strong>{point.label}</strong>
                        <p>{point.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </section>

          <footer className="resume-sheet__foot">
            <span>感谢阅读，期待与你聊聊。</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </footer>
        </article>
      </section>
    </>
  )
}
