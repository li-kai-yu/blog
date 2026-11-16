import { useEffect, useRef, useState } from 'react'

const ROUNDS = 8

type HueRound = {
  target: string
  options: string[]
}

function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

function makeRound(round: number): HueRound {
  const delta = Math.max(5, 24 - round * 2.4)
  const hue = Math.floor(Math.random() * 360)
  const target = `hsl(${hue} 48% 62%)`
  const offsets = [delta, -delta, delta * 1.7, -delta * 1.7, delta * 2.4]
  const options = shuffle([
    target,
    ...offsets.map((offset) => `hsl(${(hue + offset + 360) % 360} 48% 62%)`),
  ])
  return { target, options }
}

export default function HueGame() {
  const [roundIndex, setRoundIndex] = useState(0)
  const [round, setRound] = useState<HueRound>(() => makeRound(0))
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  const pick = (color: string) => {
    if (picked || finished) return
    setPicked(color)
    const correct = color === round.target
    const nextScore = score + (correct ? 1 : 0)

    if (correct) setScore(nextScore)

    timeout.current = window.setTimeout(() => {
      if (roundIndex === ROUNDS - 1) {
        setScore(nextScore)
        setFinished(true)
      } else {
        const next = roundIndex + 1
        setRoundIndex(next)
        setRound(makeRound(next))
        setPicked(null)
      }
    }, 680)
  }

  const reset = () => {
    if (timeout.current) window.clearTimeout(timeout.current)
    setRoundIndex(0)
    setRound(makeRound(0))
    setScore(0)
    setPicked(null)
    setFinished(false)
  }

  if (finished) {
    const verdict =
      score >= 7 ? '色彩感知很敏锐。' : score >= 5 ? '已经很不错了。' : '再来一轮，眼睛会热起来。'

    return (
      <div className="game-result">
        <p className="game-result__eyebrow">HUE SENSE / COMPLETE</p>
        <p className="game-result__big">
          {score} <span>/ {ROUNDS}</span>
        </p>
        <p className="game-result__sub">{verdict}</p>
        <button type="button" className="btn btn--primary btn--small" onClick={reset}>
          再玩一次
        </button>
      </div>
    )
  }

  return (
    <div className="hue-game">
      <div className="game-stats">
        <span>
          第 {roundIndex + 1} / {ROUNDS} 轮
        </span>
        <span>得分 {score}</span>
      </div>

      <p className="hue-game__prompt">找到与这个颜色完全一致的那一块。</p>

      <div className="hue-target-wrap">
        <span className="hue-target" style={{ background: round.target }} aria-hidden="true" />
        <span className="hue-target-label">目标颜色</span>
      </div>

      <div className="hue-options" role="group" aria-label="颜色选项">
        {round.options.map((color, index) => {
          const isPicked = picked === color
          const isCorrect = Boolean(picked) && color === round.target
          const isWrong = isPicked && color !== round.target

          return (
            <button
              key={`${color}-${index}`}
              type="button"
              className={`hue-option${isCorrect ? ' is-correct' : ''}${
                isWrong ? ' is-wrong' : ''
              }`}
              style={{ background: color }}
              onClick={() => pick(color)}
              disabled={Boolean(picked)}
              aria-label={`颜色选项 ${index + 1}`}
            />
          )
        })}
      </div>

      <p className={`hue-feedback${picked ? ' is-visible' : ''}`} aria-live="polite">
        {picked
          ? picked === round.target
            ? '完全正确。'
            : '差一点点，正确答案已经亮起来了。'
          : ' '}
      </p>
    </div>
  )
}
