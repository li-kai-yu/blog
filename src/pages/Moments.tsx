import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { ArrowRight, ArrowUpRight, Paw } from '../components/Icons'
import { catImage, cats } from '../data/cats'
import { site } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

type VisualKind =
  | 'focus'
  | 'social'
  | 'slack'
  | 'meal'
  | 'battery'
  | 'night'
  | 'calendar'

type DogPanel = {
  kicker: string
  title: string
  intro: string
  stats: { label: string; value: string }[]
  note: string
  visual: VisualKind
}

const panels: Record<string, DogPanel> = {
  mochi: {
    kicker: 'WORK LOG',
    title: '今日工作台',
    intro: '上午写接口，下午改需求，键盘几乎没停过。',
    stats: [
      { label: '专注时长', value: '4h 12m' },
      { label: '提交次数', value: '6 次' },
      { label: '有效代码', value: '+312 行' },
      { label: '被打断', value: '2 次' },
    ],
    note: '今日关键词：编译通过。',
    visual: 'focus',
  },
  pudding: {
    kicker: 'SOCIAL METER',
    title: '今日社交',
    intro: '大部分时间在睡觉，剩下一点时间留给你。',
    stats: [
      { label: '打招呼', value: '12 次' },
      { label: '被摸头', value: '23 次' },
      { label: '新朋友', value: '3 位' },
      { label: '社交余额', value: '18%' },
    ],
    note: '电量不高，但对你永远在线。',
    visual: 'social',
  },
  latte: {
    kicker: 'SLACK REPORT',
    title: '摸鱼时长',
    intro: '沙发第二格，阳光正好，今日摸鱼 KPI 已完成。',
    stats: [
      { label: '今日摸鱼', value: '3h 26m' },
      { label: '全站排名', value: '1 / 7' },
      { label: '最佳地点', value: '沙发第二格' },
      { label: '返工率', value: '0%' },
    ],
    note: '距离今日摸鱼目标还差 34 分钟。',
    visual: 'slack',
  },
  biscuit: {
    kicker: 'MEAL TRACKER',
    title: '干饭进度',
    intro: '两顿正餐，一次加餐，碗底已经检查过。',
    stats: [
      { label: '今日干饭', value: '2 顿' },
      { label: '距离下一顿', value: '00:47' },
      { label: '最爱', value: '冻干鸡肉' },
      { label: '碗底干净度', value: '100%' },
    ],
    note: '干饭是头等大事，其他都可以排队。',
    visual: 'meal',
  },
  bean: {
    kicker: 'CHARGE STATUS',
    title: '剩余电量',
    intro: '蜷成一团，挨着充电线，正在缓慢回血。',
    stats: [
      { label: '当前电量', value: '82%' },
      { label: '午睡时长', value: '1h 35m' },
      { label: '充电姿势', value: '侧躺团子' },
      { label: '预计满电', value: '15:40' },
    ],
    note: '先充会儿电，再继续发光。',
    visual: 'battery',
  },
  pepper: {
    kicker: 'NIGHT SHIFT',
    title: '夜间在线',
    intro: '城市熄灯之后，它才刚开始上班。',
    stats: [
      { label: '凌晨在线', value: '2h 08m' },
      { label: '最晚提交', value: '01:47' },
      { label: '夜间代码', value: '96 行' },
      { label: '看住的灯', value: '1,204 盏' },
    ],
    note: '你负责代码，我负责看夜景。',
    visual: 'night',
  },
  sesame: {
    kicker: 'STUDY CALENDAR',
    title: '学习日历',
    intro: '十一月，陪读记录。每一天都有一个小小的进度。',
    stats: [
      { label: '本周学习', value: '5 天' },
      { label: '连续打卡', value: '12 天' },
      { label: '最长专注', value: '2h 40m' },
      { label: '今日状态', value: '在读书' },
    ],
    note: '书可以慢慢读，我就在这儿。',
    visual: 'calendar',
  },
}

const focusWeek = [
  { day: '一', hours: 2.4 },
  { day: '二', hours: 3.6 },
  { day: '三', hours: 1.8 },
  { day: '四', hours: 3.2 },
  { day: '五', hours: 4.2 },
  { day: '六', hours: 0.8 },
  { day: '日', hours: 0.3 },
]

const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1)
const calendarMarked = new Set([2, 3, 5, 6, 9, 10, 12, 13])
const calendarToday = 13

const meals = [
  { time: '08:10', name: '早餐', state: '已光盘' },
  { time: '12:30', name: '午餐', state: '已光盘' },
  { time: '18:30', name: '晚餐', state: '准备中' },
]

const nightLog = [
  { time: '22:00', label: '出门巡逻一圈', key: false },
  { time: '00:00', label: '回到窗边值班', key: false },
  { time: '01:47', label: '陪你提交最后一次代码', key: true },
  { time: '02:30', label: '城市熄灯，它还在', key: false },
]

function PanelVisual({ visual }: { visual: VisualKind }) {
  if (visual === 'focus') {
    const max = Math.max(...focusWeek.map((item) => item.hours))
    return (
      <div className="dog-panel__visual">
        <div className="panel-bars" aria-hidden="true">
          {focusWeek.map((item, index) => (
            <div className="panel-bars__col" key={item.day}>
              <span className="panel-bars__value">{item.hours}h</span>
              <span className="panel-bars__track">
                <span
                  className={`panel-bars__bar${index === 4 ? ' is-today' : ''}`}
                  style={{ height: `${Math.round((item.hours / max) * 84)}px` }}
                />
              </span>
              <span className="panel-bars__label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (visual === 'social') {
    return (
      <div className="dog-panel__visual">
        <div className="panel-gauge" aria-hidden="true">
          <div className="panel-gauge__bar">
            <span style={{ width: '18%' }} />
          </div>
          <div className="panel-gauge__labels">
            <span>社交余额</span>
            <strong>18%</strong>
          </div>
        </div>
      </div>
    )
  }

  if (visual === 'slack') {
    return (
      <div className="dog-panel__visual">
        <div className="panel-donut" aria-hidden="true">
          <div className="panel-donut__ring">
            <span>86%</span>
          </div>
          <div className="panel-donut__copy">
            <strong>今日摸鱼 3h 26m</strong>
            <span>目标 4h · 还差 34 分钟</span>
            <span>姿势：肚皮朝上，眼睛半闭</span>
          </div>
        </div>
      </div>
    )
  }

  if (visual === 'meal') {
    return (
      <div className="dog-panel__visual">
        <ul className="panel-meals">
          {meals.map((meal) => (
            <li className={meal.state === '已光盘' ? 'is-done' : undefined} key={meal.name}>
              <span>{meal.time}</span>
              <strong>{meal.name}</strong>
              <em>{meal.state}</em>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (visual === 'battery') {
    return (
      <div className="dog-panel__visual">
        <div className="panel-battery" aria-hidden="true">
          <div className="panel-battery__row">
            <span className="panel-battery__shell">
              <span className="panel-battery__fill" style={{ width: '82%' }} />
            </span>
            <span className="panel-battery__cap" />
          </div>
          <p>82% · 充电中 · 预计 15:40 满电</p>
        </div>
      </div>
    )
  }

  if (visual === 'night') {
    return (
      <div className="dog-panel__visual">
        <div className="panel-night">
          {nightLog.map((entry) => (
            <div className={`panel-night__row${entry.key ? ' is-key' : ''}`} key={entry.time}>
              <span className="panel-night__time">{entry.time}</span>
              <span className="panel-night__dot" aria-hidden="true" />
              <span className="panel-night__label">{entry.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="dog-panel__visual">
      <div className="panel-calendar">
        <div className="panel-calendar__head">
          <strong>2026 / 11</strong>
          <span>NOVEMBER</span>
        </div>
        <div className="panel-calendar__week" aria-hidden="true">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="panel-calendar__grid">
          {calendarDays.map((day) => (
            <span
              className={`panel-calendar__day${calendarMarked.has(day) ? ' is-marked' : ''}${day === calendarToday ? ' is-today' : ''
                }`}
              key={day}
            >
              {day}
            </span>
          ))}
        </div>
        <div className="panel-calendar__legend">
          <span>
            <i className="is-marked" />
            有学习记录
          </span>
          <span>
            <i className="is-today" />
            今天
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Moments() {
  usePageMeta(
    `动态 · ${site.name}`,
    '狗狗同事们的日常片段：程序汪、社交汪、摸鱼汪、干饭汪、充电汪、巡夜汪与伴读汪。',
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const active = cats.find((cat) => cat.id === activeId) ?? null
  const activePanel = active ? panels[active.id] : null

  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveId(null)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [active])

  return (
    <>
      <section className="page-head container">
        <p className="eyebrow">
          <Paw size={11} />
          MOMENTS / 狗狗动态
        </p>
        <h1>
          今天也有在
          <br />
          <span className="ink-mark">好好生活</span>。
        </h1>
        <p className="page-head__lead">
          代码会报错，需求会改，但狗依然会在下午三点躺平。
          <br />
          这里记录七位同事的日常，也记录一些慢下来的时刻。
        </p>
      </section>

      <section className="container moments-strip">
        <div>
          <strong>07</strong>
          <span>位狗同事</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>轮流营业</span>
        </div>
        <div>
          <strong>12,480</strong>
          <span>行有效代码</span>
        </div>
      </section>

      <section className="container moments-grid">
        {cats.map((cat, index) => {
          const panel = panels[cat.id]
          const isFeature = index === 0

          return (
            <Reveal
              key={cat.id}
              delay={index * 50}
              className={`moment-cell${isFeature ? ' moment-cell--feature' : ''}`}
            >
              <article
                className={`moment-card${isFeature ? ' moment-card--feature' : ''}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`查看${cat.role} ${cat.name}的${panel.title}`}
                onClick={() => setActiveId(cat.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveId(cat.id)
                  }
                }}
              >
                <figure className="moment-card__media">
                  <img
                    src={catImage(cat)}
                    alt={`${cat.role} ${cat.name}：${cat.caption}`}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                  <figcaption className="moment-card__role">
                    <Paw size={12} />
                    {cat.role}
                  </figcaption>
                </figure>

                <div className="moment-card__body">
                  <div className="moment-card__meta">
                    <span>{cat.date}</span>
                    <span>
                      {cat.name} · {cat.latin}
                    </span>
                  </div>
                  <p className="moment-card__caption">{cat.caption}</p>
                  <div className="moment-card__traits">
                    {cat.traits.map((trait) => (
                      <span key={trait}>{trait}</span>
                    ))}
                  </div>
                  <span className="moment-card__open">
                    点开看看 · {panel.title}
                    <ArrowUpRight />
                  </span>
                </div>
              </article>
            </Reveal>
          )
        })}
      </section>

      <section className="container moments-outro">
        <Reveal>
          <div className="moments-outro__inner">
            <div>
              <p className="eyebrow">STOP AND SNIFF</p>
              <h2>愿你今天的 bug 少一点，摸鱼的时间多一点。</h2>
            </div>
            <Link to="/" className="btn btn--ghost">
              回到首页
              <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </section>

      {active && activePanel && createPortal(
        <div className="dog-panel" onClick={() => setActiveId(null)}>
          <div
            className="dog-panel__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dog-panel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dog-panel__close"
              aria-label="关闭"
              autoFocus
              onClick={() => setActiveId(null)}
            >
              ×
            </button>

            <figure className="dog-panel__media">
              <img
                src={catImage(active)}
                alt={`${active.role} ${active.name}`}
                style={{
                  objectPosition: active.id === 'latte' ? '28% 45%' : 'center 45%',
                }}
              />
              <figcaption className="dog-panel__role">
                <Paw size={12} />
                {active.role}
              </figcaption>
              <div className="dog-panel__id">
                <strong>{active.name}</strong>
                <span>{active.latin}</span>
              </div>
            </figure>

            <div className="dog-panel__main">
              <p className="dog-panel__kicker">
                {activePanel.kicker} / {active.name.toUpperCase()}
              </p>
              <h2 className="dog-panel__title" id="dog-panel-title">
                {activePanel.title}
              </h2>
              <p className="dog-panel__intro">{activePanel.intro}</p>

              <dl className="dog-panel__stats">
                {activePanel.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <PanelVisual visual={activePanel.visual} />

              <p className="dog-panel__note">{activePanel.note}</p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
