import { useEffect, useRef, useState } from 'react'

const SYMBOLS = ['⚛️', '🐍', '☕', '🗄️', '🧠', '⚙️', '🚀', '🧩']

type Card = {
  uid: number
  symbol: string
}

function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

function buildDeck(): Card[] {
  return shuffle(
    [...SYMBOLS, ...SYMBOLS].map((symbol, uid) => ({
      uid,
      symbol,
    })),
  )
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(buildDeck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [locked, setLocked] = useState(false)
  const timeouts = useRef<number[]>([])

  const won = matched.length === SYMBOLS.length

  useEffect(() => {
    if (!running || won) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running, won])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const reset = () => {
    timeouts.current.forEach((timer) => window.clearTimeout(timer))
    timeouts.current = []
    setDeck(buildDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setLocked(false)
  }

  const flip = (card: Card, index: number) => {
    if (locked || won) return
    if (flipped.includes(index) || matched.includes(card.symbol)) return

    if (!running) setRunning(true)

    if (flipped.length === 0) {
      setFlipped([index])
      return
    }

    if (flipped.length === 1) {
      const firstIndex = flipped[0]
      const firstCard = deck[firstIndex]
      setFlipped([firstIndex, index])
      setMoves((value) => value + 1)
      setLocked(true)

      const isMatch = firstCard.symbol === card.symbol
      const timer = window.setTimeout(
        () => {
          if (isMatch) {
            setMatched((value) => [...value, card.symbol])
          }
          setFlipped([])
          setLocked(false)
        },
        isMatch ? 460 : 780,
      )
      timeouts.current.push(timer)
    }
  }

  const formatTime = (value: number) =>
    `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`

  return (
    <div className="memory-game">
      <div className="game-stats">
        <span>步数 {moves}</span>
        <span>用时 {formatTime(seconds)}</span>
        <span>配对 {matched.length} / {SYMBOLS.length}</span>
      </div>

      <div className="memory-grid" role="group" aria-label="记忆配对卡片">
        {deck.map((card, index) => {
          const isMatched = matched.includes(card.symbol)
          const isFlipped = flipped.includes(index) || isMatched

          return (
            <button
              key={card.uid}
              type="button"
              className={`memory-card${isFlipped ? ' is-flipped' : ''}${
                isMatched ? ' is-matched' : ''
              }`}
              onClick={() => flip(card, index)}
              disabled={isMatched || locked}
              aria-label={isFlipped ? `已翻开：${card.symbol}` : `第 ${index + 1} 张卡片，未翻开`}
            >
              <span className="memory-card__inner">
                <span className="memory-card__back" aria-hidden="true">
                  K.
                </span>
                <span className="memory-card__front" aria-hidden="true">
                  {card.symbol}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="game-actions">
        <button type="button" className="btn btn--ghost btn--small" onClick={reset}>
          重新开始
        </button>
      </div>

      {won ? (
        <div className="game-result game-result--overlay">
          <p className="game-result__eyebrow">ALL MATCHED</p>
          <p className="game-result__big">全部找到</p>
          <p className="game-result__sub">
            用了 {moves} 步，{formatTime(seconds)}。
          </p>
          <button type="button" className="btn btn--primary btn--small" onClick={reset}>
            再来一局
          </button>
        </div>
      ) : null}
    </div>
  )
}
