import { useEffect, useRef, useState } from 'react'

const ROUNDS = 5
const BEST_KEY = 'lab.reaction.best'

type Phase = 'idle' | 'waiting' | 'ready' | 'early' | 'result' | 'done'

function readBest() {
  try {
    const stored = Number(localStorage.getItem(BEST_KEY))
    return Number.isFinite(stored) && stored > 0 ? stored : null
  } catch {
    return null
  }
}

export default function ReactionGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [times, setTimes] = useState<number[]>([])
  const [lastTime, setLastTime] = useState<number | null>(null)
  const [early, setEarly] = useState(0)
  const [best, setBest] = useState<number | null>(readBest)
  const startAt = useRef(0)
  const timeout = useRef<number | null>(null)

  const clearTimer = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
      timeout.current = null
    }
  }

  const arm = () => {
    clearTimer()
    setPhase('waiting')
    timeout.current = window.setTimeout(
      () => {
        startAt.current = performance.now()
        setPhase('ready')
      },
      1300 + Math.random() * 2200,
    )
  }

  const begin = () => {
    clearTimer()
    setTimes([])
    setLastTime(null)
    setEarly(0)
    arm()
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  const click = () => {
    if (phase === 'idle' || phase === 'done') {
      begin()
      return
    }

    if (phase === 'waiting') {
      clearTimer()
      setEarly((value) => value + 1)
      setPhase('early')
      timeout.current = window.setTimeout(arm, 900)
      return
    }

    if (phase === 'ready') {
      const elapsed = Math.round(performance.now() - startAt.current)
      const nextTimes = [...times, elapsed]
      setTimes(nextTimes)
      setLastTime(elapsed)
      setPhase('result')

      if (best === null || elapsed < best) {
        setBest(elapsed)
        try {
          localStorage.setItem(BEST_KEY, String(elapsed))
        } catch {
          /* 忽略隐私模式下的写入失败 */
        }
      }

      clearTimer()
      timeout.current = window.setTimeout(
        () => {
          if (nextTimes.length >= ROUNDS) {
            setPhase('done')
          } else {
            arm()
          }
        },
        900,
      )
    }
  }

  const average =
    times.length > 0 ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length) : 0

  const bestTime = times.length > 0 ? Math.min(...times) : 0
  const worstTime = times.length > 0 ? Math.max(...times) : 0
  const bestRound = times.length > 0 ? times.indexOf(bestTime) + 1 : 0
  const deviation =
    times.length > 0
      ? Math.round(
        Math.sqrt(
          times.reduce((sum, value) => sum + (value - average) ** 2, 0) / times.length,
        ),
      )
      : 0
  const firstHalf =
    times.length >= 2 ? Math.round((times[0] + times[1]) / 2) : average
  const lastHalf =
    times.length >= 2
      ? Math.round((times[times.length - 1] + times[times.length - 2]) / 2)
      : average
  const trend = lastHalf - firstHalf

  const persona =
    average < 220
      ? {
        title: '闪电型选手',
        desc: '从看见绿色到手指落下几乎没有犹豫。你适合需要即时判断的交互，但也要小心，别让“快”变成抢跑。',
      }
      : average < 300
        ? {
          title: '敏捷型选手',
          desc: '进入状态很快，也能在下一轮开始前把手收住。你的优势不是极限速度，而是随时能再来一次。',
        }
        : average < 400
          ? {
            title: '稳健型选手',
            desc: '你更在意点对，而不是点快。放到真实工作里，这种确认之后再动手的习惯，往往更少返工。',
          }
          : {
            title: '慢热型选手',
            desc: '你不是慢，你是在确认之后才行动。先看清再出手，稳定度通常比冲动型更高。',
          }

  const stability =
    deviation < 25
      ? '五轮几乎没有抖动，节奏像一条平线，说明注意力保持得很好。'
      : deviation < 55
        ? '五轮之间有小幅起伏，属于正常范围。注意力有波动，但没有影响整体节奏。'
        : '五轮之间起伏比较明显，可能和疲劳、走神或某一次抢跑有关。'

  const trendText =
    trend <= -15
      ? `后半程比前半程快了约 ${Math.abs(trend)} ms，属于越玩越顺的类型，身体在几轮之后才真正热身。`
      : trend >= 15
        ? `后半程比前半程慢了约 ${trend} ms，注意力开始有一点点消耗。下一次可以缩短局间等待，或者在开始前活动一下手腕。`
        : '前后半程几乎持平，说明你的节奏控制得很好，不靠运气也能稳定复现。'

  const earlyText =
    early === 0
      ? '全程没有抢跑，你对手指的刹车控制得不错。'
      : early <= 2
        ? `有 ${early} 次抢跑，说明手比眼睛更快。把等待当成准备动作，深呼吸一次再等绿色，会更容易稳定。`
        : `有 ${early} 次抢跑，手速已经超过耐心了。下一局试着把手放远一点，等绿色出现再靠近。`

  const bestNote = `最快的一次出现在第 ${bestRound} 轮，${bestRound === 1
      ? '说明你进入状态很快，但后面的表现更值得参考。'
      : bestRound === times.length
        ? '说明你到最后一轮才完全放开，热身需要一点时间。'
        : '说明中间段是你最放松、最顺手的区间。'
    }`

  const advice =
    deviation > 60
      ? '把每一轮当成独立的一次测试，不要在点击前预判上一轮的速度。'
      : early > 0
        ? '等待阶段可以轻轻数两拍，让注意力停在颜色变化上，而不是停在“什么时候该点”。'
        : average < 300
          ? '你的速度已经够用了，接下来可以练“稳定地快”，而不是偶尔更快。'
          : '先保证看清再点击，速度会在稳定之后自然上来。'

  if (phase === 'done') {
    return (
      <div className="game-result game-result--analysis">
        <p className="game-result__eyebrow">REACTION / COMPLETE</p>
        <p className="game-result__big">
          {average} <span>ms</span>
        </p>
        <p className="game-result__sub">五轮平均反应速度</p>

        <div className="reaction-persona">
          <span className="reaction-persona__tag">YOUR TYPE</span>
          <strong>{persona.title}</strong>
          <p>{persona.desc}</p>
        </div>

        <div className="reaction-rounds" aria-label="五轮反应时间">
          {times.map((time, index) => (
            <div className="reaction-round" key={index}>
              <span className="reaction-round__label">0{index + 1}</span>
              <span className="reaction-round__track">
                <i
                  className={time === bestTime ? 'is-best' : undefined}
                  style={{
                    width: `${Math.max(14, Math.round((time / Math.max(worstTime, 1)) * 100))}%`,
                  }}
                />
              </span>
              <em>{time} ms</em>
            </div>
          ))}
        </div>

        <div className="reaction-summary">
          <span>最快 {bestTime} ms · 第 {bestRound} 轮</span>
          <span>最慢 {worstTime} ms</span>
          <span>波动 {deviation} ms</span>
          <span>历史最快 {best ?? bestTime} ms</span>
        </div>

        <div className="reaction-analysis">
          <p>
            <strong>稳定度</strong>
            {stability}
          </p>
          <p>
            <strong>节奏</strong>
            {trendText}
          </p>
          <p>
            <strong>出手</strong>
            {earlyText}
          </p>
          <p>
            <strong>最快一轮</strong>
            {bestNote}
          </p>
          <p className="reaction-analysis__advice">
            <strong>建议</strong>
            {advice}
          </p>
        </div>

        <div className="reaction-actions">
          <button type="button" className="btn btn--primary btn--small" onClick={begin}>
            再来一次
          </button>
        </div>
      </div>
    )
  }

  const labels: Record<Phase, { main: string; sub: string }> = {
    idle: { main: '点击开始', sub: `共 ${ROUNDS} 轮，测试你的平均反应` },
    waiting: { main: '等一等…', sub: '看到绿色再点击' },
    ready: { main: '现在！', sub: '立刻点击' },
    early: { main: '太快啦', sub: '等泡泡变绿再出手' },
    result: { main: lastTime ? `${lastTime} ms` : '', sub: '下一轮准备中…' },
    done: { main: '', sub: '' },
  }

  return (
    <div className="reaction-game">
      <div className="game-stats">
        <span>
          第 {Math.min(times.length + 1, ROUNDS)} / {ROUNDS} 轮
        </span>
        <span>最快纪录 {best ? `${best} ms` : '—'}</span>
      </div>

      <button
        type="button"
        className={`reaction-stage is-${phase}`}
        onClick={click}
        aria-label={labels[phase].main}
      >
        <span className="reaction-stage__halo" aria-hidden="true" />
        <span className="reaction-stage__main">{labels[phase].main}</span>
        <span className="reaction-stage__sub">{labels[phase].sub}</span>
      </button>

      <div className="reaction-dots" aria-hidden="true">
        {Array.from({ length: ROUNDS }).map((_, index) => (
          <span key={index} className={index < times.length ? 'is-done' : ''} />
        ))}
      </div>
    </div>
  )
}
