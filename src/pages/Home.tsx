import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CatCarousel from '../components/CatCarousel'
import Reveal from '../components/Reveal'
import { ArrowRight, ArrowUpRight, Paw } from '../components/Icons'
import { cats, heroCat, catImage } from '../data/cats'
import { facts, skills } from '../data/profile'
import { site } from '../data/site'
import { formatDate, getPosts } from '../lib/posts'
import { usePageMeta } from '../lib/usePageMeta'

const stack = [
  'Java',
  'Spring Boot',
  'MySQL',
  'Redis',
  'RabbitMQ',
  'LangChain4j',
  'React',
  'TypeScript',
  'Vite',
]

const whispers = [
  '把日子过成一条慢慢亮的曲线。',
  '不着急，先把这一行写明白。',
  '代码会跑通，狗会先睡着。',
  '今天也留一点空白给自己。',
  '喜欢的事，值得多一点耐心。',
]

export default function Home() {
  const posts = getPosts().slice(0, 3)
  usePageMeta(`${site.name} · ${site.tagline}`, site.description)

  const stageRef = useRef<HTMLDivElement>(null)
  const [whisper, setWhisper] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return
    }

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const rect = stage.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        stage.style.setProperty('--mx', `${(x * 16).toFixed(2)}px`)
        stage.style.setProperty('--my', `${(y * 14).toFixed(2)}px`)
      })
    }
    const onLeave = () => {
      stage.style.setProperty('--mx', '0px')
      stage.style.setProperty('--my', '0px')
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <section className="hero container">
        <div className="hero__copy">
          <p className="eyebrow hero-anim" style={{ animationDelay: '60ms' }}>
            <span className="eyebrow__dot" />
            SOFTWARE ENGINEERING · DOG PERSON
          </p>

          <h1 className="hero__title hero-anim" style={{ animationDelay: '140ms' }}>
            把复杂留给系统，
            <br />
            把<span className="ink-mark">柔软</span>留给日常。
          </h1>

          <p className="hero__lead hero-anim" style={{ animationDelay: '230ms' }}>
            我是 Elio Li，在洛阳河南科技大学读软件工程专业，目前大二上，目标是成为一名全栈开发工程师。在这里记录代码、学习路线，也养了一群不会掉毛的狗。
          </p>

          <div className="hero__facts hero-anim" style={{ animationDelay: '300ms' }}>
            <span>{site.grade}</span>
            <span>2029 届</span>
            <span>全栈方向</span>
          </div>

          <div className="hero__actions hero-anim" style={{ animationDelay: '360ms' }}>
            <Link to="/writing" className="btn btn--primary">
              阅读博客
              <ArrowRight />
            </Link>
            <Link to="/about" className="btn btn--ghost">
              <Paw size={14} />
              认识一下我
            </Link>
            <Link to="/resume" className="text-link hero__resume">
              查看简历
              <ArrowUpRight />
            </Link>
          </div>

          <p className="hero__scroll hero-anim" style={{ animationDelay: '440ms' }}>
            <span className="hero__scroll-arrow" aria-hidden="true">
              ↓
            </span>
            向下滑，还有六只狗在等你
          </p>
        </div>

        <div className="hero__stage hero-anim" style={{ animationDelay: '300ms' }} ref={stageRef}>
          <span className="hero-stage__sun" aria-hidden="true" />
          <figure className="hero-cat">
            <div className="hero-cat__frame">
              <img
                src={catImage(heroCat)}
                alt={`${heroCat.role} ${heroCat.name}：${heroCat.desc}`}
                loading="eager"
              />
              <span className="hero-cat__grain" aria-hidden="true" />
            </div>
            <figcaption className="hero-cat__foot">
              <span>
                {heroCat.name}
                <em>{heroCat.latin}</em>
              </span>
              <span>{heroCat.role}</span>
            </figcaption>
            <span className="hero-cat__stamp" aria-hidden="true">
              EST. 2026
            </span>
          </figure>

          <figure className="hero-mini" aria-hidden="true">
            <img src={catImage(cats[2])} alt="" loading="eager" />
            <figcaption>
              <span>sunbeam club</span>
              <em>15:00</em>
            </figcaption>
          </figure>

          <span className="hero-chip hero-chip--one">Java</span>
          <span className="hero-chip hero-chip--four">狗派</span>
        </div>
      </section>

      <button
        type="button"
        className="daily-note container"
        onClick={() => setWhisper((index) => (index + 1) % whispers.length)}
        aria-label="换一句今日随想"
      >
        <span className="daily-note__head">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            今日随想 / DAILY MUSINGS
          </span>
          <span className="daily-note__hint">
            点一下换一句
            <span className="daily-note__shuffle" aria-hidden="true">
              ↻
            </span>
          </span>
        </span>

        <span className="daily-note__text" aria-live="polite">
          <span className="daily-note__whisper" key={whisper}>
            {whispers[whisper]}
          </span>
        </span>
      </button>

      <div className="marquee" aria-label="常用技术栈">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy} aria-hidden={copy === 1}>
              {stack.map((item) => (
                <span className="marquee__item" key={`${copy}-${item}`}>
                  {item}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="section container" id="cats">
        <Reveal>
          <div className="section-head cat-head">
            <div>
              <p className="eyebrow">
                <Paw size={11} />
                MEET THE DOGS / 狗狗同事 · FILM 07
              </p>
              <h2>
                汪の日常，<span className="serif">soft hours</span>
              </h2>
            </div>
            <p className="section-head__note">
              七位不写代码的同事，
              <br />
              负责把日子过软一点。
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <CatCarousel items={cats} />
        </Reveal>
      </section>

      <section className="section container">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__dot" />
                LATEST WRITING
              </p>
              <h2>
                最近写下的<span className="serif"> words</span>
              </h2>
            </div>
            <Link to="/writing" className="text-link">
              全部文章
              <ArrowUpRight />
            </Link>
          </div>
        </Reveal>

        <div className="home-posts">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 70}>
              <Link to={`/writing/${post.slug}`} className="home-post">
                <span className="home-post__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="home-post__body">
                  <span className="home-post__meta">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.tags.slice(0, 2).join(' · ')}</span>
                  </span>
                  <span className="home-post__title">{post.title}</span>
                  <span className="home-post__desc">{post.description}</span>
                </span>
                <span className="home-post__arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" id="me">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__dot" />
                ME / 关于我
              </p>
              <h2>
                一个正在长大的<span className="serif"> developer</span>
              </h2>
            </div>
            <Link to="/about" className="text-link">
              完整的关于页
              <ArrowUpRight />
            </Link>
          </div>
        </Reveal>

        <div className="me-block">
          <Reveal className="me-card">
            <div className="me-card__head">
              <span className="me-card__avatar" aria-hidden="true">
                E.
              </span>
              <div>
                <h3>{site.name}</h3>
                <p>{site.role}</p>
              </div>
            </div>

            <p className="me-card__intro">
              在后端工程里练习把问题想清楚，也在前端体验里练习把细节做顺手。
              目前正在学习 LangChain4j，想把模型能力接进真实的业务链路。
            </p>

            <dl className="me-facts">
              {facts.map((fact) => (
                <div className="me-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    {fact.href ? <a href={fact.href}>{fact.value}</a> : fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="me-card__actions">
              <Link to="/resume" className="btn btn--primary btn--small">
                查看简历
                <ArrowUpRight />
              </Link>
              <a href={`mailto:${site.email}`} className="text-link">
                写封邮件
                <ArrowRight />
              </a>
            </div>
          </Reveal>

          <Reveal className="me-skills" delay={110}>
            <div className="me-skills__head">
              <span className="eyebrow">SKILLS / 技能进度</span>
              <em>持续更新</em>
            </div>

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

            <p className="me-skills__note">
              自评进度，不代表终点。比起数字，更在意每一层是否真的理解了。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <Link to="/lab" className="lab-teaser">
            <span className="lab-teaser__glow" aria-hidden="true" />
            <span className="lab-teaser__bubbles" aria-hidden="true">
              <i className="lab-bubble lab-bubble--a" />
              <i className="lab-bubble lab-bubble--b" />
              <i className="lab-bubble lab-bubble--c" />
              <i className="lab-bubble lab-bubble--d" />
              <i className="lab-bubble lab-bubble--e" />
            </span>

            <span className="lab-teaser__copy">
              <span className="eyebrow">
                <span className="eyebrow__dot" />
                INTERACTIVE EXPERIMENT
              </span>
              <span className="lab-teaser__title">泡泡实验室</span>
              <span className="lab-teaser__desc">
                一片会回应你的小空间。移动鼠标，泡泡会轻轻躲开；
                点开大泡泡，还有三款两分钟的小游戏。
              </span>
              <span className="btn btn--primary lab-teaser__cta">
                进去玩一会儿
                <ArrowUpRight />
              </span>
            </span>

            <span className="lab-teaser__play" aria-hidden="true">
              <span className="lab-teaser__play-ring" />
              <span className="lab-teaser__play-text">PLAY</span>
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  )
}
