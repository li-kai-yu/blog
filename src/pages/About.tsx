import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { catImage, cats } from '../data/cats'
import { facts, learningPath, skills } from '../data/profile'
import { site } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

const stackGroups = [
  { label: '语言', items: ['Java', 'TypeScript', 'SQL'] },
  { label: '后端', items: ['Spring Boot', 'MySQL', 'Redis', 'RabbitMQ'] },
  { label: 'AI', items: ['LangChain4j', 'RAG', 'Prompt'] },
  { label: '前端', items: ['React', 'Vite', 'CSS'] },
]

const principles = [
  {
    index: '01',
    title: '先正确，再优雅',
    text: '能跑通只是起点。清晰的边界、可预期的失败，比技巧更值得花时间。',
  },
  {
    index: '02',
    title: '清晰胜过聪明',
    text: '让代码和生活都少一点解释成本，是我长期练习的方向。',
  },
  {
    index: '03',
    title: '细节是体验的一部分',
    text: '一个顺滑的过渡、一句准确的提示，都会改变人使用产品时的感受。',
  },
]

const studyCat = cats.find((cat) => cat.id === 'sesame') ?? cats[0]

export default function About() {
  usePageMeta(
    `关于 · ${site.name}`,
    `关于 ${site.name}：${site.school} ${site.major}，关注后端工程、AI 应用与前端体验。`,
  )

  return (
    <>
      <section className="page-head container">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          ABOUT / A LITTLE MORE
        </p>
        <h1>
          把复杂留给系统，
          <br />
          把<span className="ink-mark">温柔</span>留给体验。
        </h1>
        <p className="page-head__lead">
          你好，我是 {site.name}。在洛阳读软件工程，
          <br />
          这里记录代码、思考，以及一些认真做出来的小东西。
        </p>
      </section>

      <section className="container about-facts">
        {facts.map((fact) => (
          <div className="about-fact" key={fact.label}>
            <span>{fact.label}</span>
            {fact.href ? (
              <a href={fact.href}>{fact.value}</a>
            ) : (
              <strong>{fact.value}</strong>
            )}
            <em>{fact.en}</em>
          </div>
        ))}
      </section>

      <section className="container about-grid">
        <Reveal className="about-portrait">
          <div className="about-portrait__card">
            <span className="about-portrait__tag">PORTRAIT / 2026</span>
            <div className="about-portrait__photo">
              <img
                src={catImage(studyCat)}
                alt={`${studyCat.role} ${studyCat.name}：${studyCat.caption}`}
                loading="lazy"
              />
              <span className="about-portrait__badge">SLOW &amp; STEADY</span>
            </div>
            <div className="about-portrait__foot">
              <span>{site.name}</span>
              <span>{site.role}</span>
            </div>
          </div>
        </Reveal>

        <div className="about-copy">
          <Reveal>
            <p className="about-lead">
              我是一名全栈开发者，主要精力在后端工程，也喜欢把前端体验打磨到顺手。
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              在{site.school}读{site.major}，日常与 Java、Spring Boot、MySQL、Redis
              打交道，正在学习基于 LangChain4j 的 Agent 开发。比起追新，我更想弄清楚
              每项技术背后的取舍：它解决了什么问题，又带来了什么代价。
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p>
              写博客对我来说不是输出焦虑，而是整理思路。把一件事讲清楚的过程，
              往往能暴露自己还没想明白的地方。剩下的一点时间，会分给狗和咖啡。
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="stack-grid">
              {stackGroups.map((group) => (
                <div className="stack-group" key={group.label}>
                  <span className="stack-group__label">{group.label}</span>
                  <div className="stack-group__items">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container about-sections">
        <Reveal>
          <div className="about-block">
            <div className="about-block__head">
              <p className="eyebrow">NOW / 最近</p>
              <span className="about-block__line" />
            </div>
            <div className="now-list">
              <div className="now-item">
                <span className="now-item__index">01</span>
                <div>
                  <h3>正在学习</h3>
                  <p>LangChain4j 与 Agent 的工程化落地。</p>
                </div>
              </div>
              <div className="now-item">
                <span className="now-item__index">02</span>
                <div>
                  <h3>正在整理</h3>
                  <p>MySQL 与 Redis 的知识地图，把实践重新串成体系。</p>
                </div>
              </div>
              <div className="now-item">
                <span className="now-item__index">03</span>
                <div>
                  <h3>正在打磨</h3>
                  <p>这个博客的排版、动效与狗狗同事们的日常。</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="about-block">
            <div className="about-block__head">
              <p className="eyebrow">PRINCIPLES / 相信的事</p>
              <span className="about-block__line" />
            </div>
            <div className="principle-list">
              {principles.map((principle) => (
                <div className="principle" key={principle.index}>
                  <span className="principle__index">{principle.index}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container about-resume" id="resume">
        <Reveal>
          <div className="about-block__head">
            <p className="eyebrow">RESUME / 简历</p>
            <span className="about-block__line" />
          </div>
        </Reveal>

        <div className="resume-grid">
          <Reveal className="resume-card">
            <span className="resume-card__tag">EDUCATION</span>
            <h2>{site.school}</h2>
            <p className="resume-card__meta">
              {site.major} · 本科 · {site.grade} / {site.location}
            </p>
            <p className="resume-card__desc">
              主修 Java 后端与计算机基础，把课程项目一路做成可以真正跑起来的系统。
              从单体到缓存、消息队列与搜索，再到现在正在尝试的 AI Agent。
            </p>

            <div className="resume-path">
              <span className="resume-path__label">学习路径</span>
              <div className="resume-path__items">
                {learningPath.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="resume-card resume-card--skills" delay={90}>
            <span className="resume-card__tag">SKILLS</span>
            <h2>技能与方向</h2>
            <p className="resume-card__meta">后端工程 · AI 应用 · 前端体验</p>

            <div className="skill-list">
              {skills.map((skill) => (
                <div className="skill" key={skill.label}>
                  <div className="skill__meta">
                    <span>{skill.label}</span>
                    <em>{skill.value}%</em>
                  </div>
                  <div
                    className="skill__track"
                    role="progressbar"
                    aria-valuenow={skill.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={skill.label}
                  >
                    <span style={{ width: `${skill.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <p className="resume-card__note">自评进度，仅代表当前的熟练度，不代表终点。</p>

            <div className="resume-card__actions">
              <Link to="/resume" className="btn btn--primary btn--small">
                查看完整简历
                <ArrowUpRight />
              </Link>
              <a className="text-link" href={`mailto:${site.email}`}>
                写封邮件
                <ArrowRight />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container about-cta">
        <Reveal>
          <div className="about-cta__inner">
            <div>
              <p className="eyebrow">KEEP EXPLORING</p>
              <h2>如果你也喜欢做点有趣的东西。</h2>
            </div>
            <div className="about-cta__actions">
              <Link to="/moments" className="btn btn--primary">
                看看狗狗动态
                <ArrowUpRight />
              </Link>
              <Link to="/writing" className="text-link">
                读读文章
                <ArrowRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
