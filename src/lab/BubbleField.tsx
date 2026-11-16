import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { GAMES, type GameId } from './games'
import { MYSTICS, type MysticId } from './mystic'

type BubbleSpec = {
  id: string
  label: string
  glyph: string
  kind: 'tech' | 'game' | 'mystic'
  game?: GameId
  mystic?: MysticId
  message?: string
  x: number
  y: number
  size: number
  tone: number
}

type BubbleState = {
  id: string
  baseX: number
  baseY: number
  r: number
  ox: number
  oy: number
  vx: number
  vy: number
  phase: number
  drift: number
  rx: number
  ry: number
}

const TONES: [string, string, string][] = [
  ['#f6e3d3', '#ecc3ad', '#d39a7f'],
  ['#e2ebdd', '#c3d6bf', '#9db79b'],
  ['#e8e1f1', '#d0c2e4', '#b0a0ca'],
  ['#dde9f0', '#bcd3e0', '#94b2c5'],
  ['#f4e9cf', '#e8d6a9', '#cdb57c'],
  ['#f1dfe3', '#e0c1c9', '#c49ba7'],
]

const SPECS: BubbleSpec[] = [
  { id: 'memory', label: '记忆配对', glyph: '◫', kind: 'game', game: 'memory', x: 26, y: 38, size: 156, tone: 1 },
  { id: 'hue', label: '色感挑战', glyph: '◒', kind: 'game', game: 'hue', x: 62, y: 27, size: 150, tone: 0 },
  { id: 'reaction', label: '反应测试', glyph: '◎', kind: 'game', game: 'reaction', x: 74, y: 68, size: 158, tone: 3 },
  { id: 'react', label: 'React', glyph: 'Re', kind: 'tech', message: '界面是状态的影子', x: 9, y: 22, size: 100, tone: 3 },
  { id: 'typescript', label: 'TypeScript', glyph: 'TS', kind: 'tech', message: '把约束写进未来', x: 46, y: 11, size: 88, tone: 2 },
  { id: 'java', label: 'Java', glyph: 'Ja', kind: 'tech', message: '慢一点，但稳', x: 89, y: 19, size: 104, tone: 0 },
  { id: 'redis', label: 'Redis', glyph: 'R', kind: 'tech', message: '快，是因为路径短', x: 13, y: 64, size: 108, tone: 5 },
  { id: 'mysql', label: 'MySQL', glyph: 'My', kind: 'tech', message: '答案常常藏在数据里', x: 42, y: 60, size: 112, tone: 4 },
  { id: 'agent', label: 'Agent', glyph: 'AI', kind: 'tech', message: '让模型学会使用工具', x: 56, y: 84, size: 120, tone: 2 },
  { id: 'git', label: 'Git', glyph: 'Gi', kind: 'tech', message: '每次提交，都是给未来的信', x: 90, y: 50, size: 96, tone: 0 },
  { id: 'vite', label: 'Vite', glyph: 'Vi', kind: 'tech', message: '启动快，才有心流', x: 7, y: 86, size: 94, tone: 1 },
  { id: 'css', label: 'CSS', glyph: '{}', kind: 'tech', message: '细节即质感', x: 83, y: 87, size: 100, tone: 5 },
  { id: 'zodiac', label: '星座', glyph: '✶', kind: 'mystic', mystic: 'zodiac', x: 17, y: 11, size: 96, tone: 2 },
  { id: 'almanac', label: '吉日', glyph: '☼', kind: 'mystic', mystic: 'almanac', x: 75, y: 43, size: 102, tone: 1 },
  { id: 'divination', label: '算卦', glyph: '☯', kind: 'mystic', mystic: 'divination', x: 20, y: 78, size: 94, tone: 4 },
  { id: 'tarot', label: '塔罗', glyph: '✧', kind: 'mystic', mystic: 'tarot', x: 10, y: 52, size: 100, tone: 5 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

type BubbleFieldProps = {
  onOpenGame: (game: GameId) => void
  onOpenMystic: (mystic: MysticId) => void
  paused?: boolean
}

export default function BubbleField({ onOpenGame, onOpenMystic, paused = false }: BubbleFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const bubbleRefs = useRef(new Map<string, HTMLButtonElement>())
  const statesRef = useRef<BubbleState[]>([])
  const boundsRef = useRef({ width: 0, height: 0 })
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const pausedRef = useRef(paused)
  const timeoutsRef = useRef<number[]>([])
  const [scale, setScale] = useState(1)
  const [ready, setReady] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(() => new Set())
  const [toast, setToast] = useState<{ id: number; text: string; x: number; y: number } | null>(
    null,
  )
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return

    const measure = () => {
      const rect = field.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const nextScale = rect.width < 640 ? 0.58 : rect.width < 960 ? 0.8 : 1
      boundsRef.current = { width: rect.width, height: rect.height }
      setScale(nextScale)

      const existing = new Map(statesRef.current.map((state) => [state.id, state]))
      statesRef.current = SPECS.map((spec) => {
        const size = spec.size * nextScale
        const r = size / 2
        const previous = existing.get(spec.id)
        const baseX = clamp((spec.x / 100) * rect.width, r + 16, rect.width - r - 16)
        const baseY = clamp((spec.y / 100) * rect.height, r + 16, rect.height - r - 16)

        if (previous) {
          return { ...previous, baseX, baseY, r }
        }

        return {
          id: spec.id,
          baseX,
          baseY,
          r,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
          drift: 6 + Math.random() * 8,
          rx: 0,
          ry: 0,
        }
      })

      statesRef.current.forEach((state) => {
        const element = bubbleRefs.current.get(state.id)
        if (!element) return
        const x = clamp(state.baseX, state.r + 8, rect.width - state.r - 8)
        const y = clamp(state.baseY, state.r + 8, rect.height - state.r - 8)
        element.style.transform = `translate3d(${x - state.r}px, ${y - state.r}px, 0)`
      })

      setReady(true)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(field)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = (now: number) => {
      const delta = Math.min((now - last) / 16.6667, 2)
      last = now

      if (!pausedRef.current) {
        const { width, height } = boundsRef.current
        const pointer = pointerRef.current

        statesRef.current.forEach((state) => {
          if (width === 0 || height === 0) return

          const driftX = reduceMotion ? 0 : Math.sin(now / 4200 + state.phase) * state.drift
          const driftY = reduceMotion ? 0 : Math.cos(now / 5200 + state.phase) * state.drift

          let forceX = -state.ox * 0.016
          let forceY = -state.oy * 0.016

          if (pointer.active && !reduceMotion) {
            const bubbleX = state.baseX + driftX + state.ox
            const bubbleY = state.baseY + driftY + state.oy
            const dx = bubbleX - pointer.x
            const dy = bubbleY - pointer.y
            const distance = Math.hypot(dx, dy) || 1
            const reach = state.r + 150

            if (distance < reach) {
              const power = (1 - distance / reach) * 0.85
              forceX += (dx / distance) * power
              forceY += (dy / distance) * power
            }
          }

          state.vx = (state.vx + forceX) * 0.9
          state.vy = (state.vy + forceY) * 0.9
          state.ox = clamp(state.ox + state.vx * delta, -130, 130)
          state.oy = clamp(state.oy + state.vy * delta, -130, 130)

          const x = clamp(
            state.baseX + driftX + state.ox,
            state.r + 8,
            width - state.r - 8,
          )
          const y = clamp(
            state.baseY + driftY + state.oy,
            state.r + 8,
            height - state.r - 8,
          )

          let targetRx = 0
          let targetRy = 0

          if (pointer.active && !reduceMotion) {
            const dx = pointer.x - x
            const dy = pointer.y - y
            const distance = Math.hypot(dx, dy) || 1
            const reach = state.r + 240

            if (distance < reach) {
              const power = (1 - distance / reach) * 0.9
              targetRx = clamp((-dy / (state.r * 2.2)) * 18 * power, -10, 10)
              targetRy = clamp((dx / (state.r * 2.2)) * 18 * power, -10, 10)
            }
          }

          state.rx += (targetRx - state.rx) * 0.14
          state.ry += (targetRy - state.ry) * 0.14

          const element = bubbleRefs.current.get(state.id)
          if (element) {
            element.style.transform = `translate3d(${x - state.r}px, ${y - state.r}px, 0)`
            element.style.setProperty('--rx', `${state.rx.toFixed(2)}deg`)
            element.style.setProperty('--ry', `${state.ry.toFixed(2)}deg`)
          }
        })
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const field = fieldRef.current
    if (!field) return
    const rect = field.getBoundingClientRect()
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    }
  }

  const pop = (spec: BubbleSpec, event: ReactMouseEvent<HTMLButtonElement>) => {
    const field = fieldRef.current
    const rect = field?.getBoundingClientRect()
    const element = bubbleRefs.current.get(spec.id)
    const inner = element?.querySelector<HTMLElement>('.bubble__inner')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (inner && !reduceMotion && typeof inner.animate === 'function') {
      inner.animate(
        [
          { transform: 'scale(1) translateZ(0)', opacity: 1, filter: 'blur(0px)' },
          { transform: 'scale(1.3) translateZ(46px)', opacity: 0, filter: 'blur(6px)' },
        ],
        { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
      )
    }

    setHidden((previous) => {
      const next = new Set(previous)
      next.add(spec.id)
      return next
    })

    const toastId = Date.now()
    const x = rect ? clamp(event.clientX - rect.left, 110, rect.width - 110) : 0
    const y = rect ? clamp(event.clientY - rect.top, 60, rect.height - 40) : 0
    setToast({ id: toastId, text: spec.message ?? '', x, y })
    setBurst({ id: toastId, x, y })

    const burstTimer = window.setTimeout(() => {
      setBurst((current) => (current?.id === toastId ? null : current))
    }, 760)

    const hideTimer = window.setTimeout(() => {
      setToast((current) => (current?.id === toastId ? null : current))
    }, 2000)

    const respawnTimer = window.setTimeout(() => {
      const bubble = bubbleRefs.current.get(spec.id)
      bubble
        ?.querySelectorAll('.bubble__inner')
        .forEach((node) => node.getAnimations().forEach((animation) => animation.cancel()))
      setHidden((previous) => {
        const next = new Set(previous)
        next.delete(spec.id)
        return next
      })
    }, 2600)

    timeoutsRef.current.push(burstTimer, hideTimer, respawnTimer)
  }

  const toneOf = (spec: BubbleSpec) => TONES[spec.tone % TONES.length]

  return (
    <div
      ref={fieldRef}
      className={`bubble-field${ready ? ' is-ready' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
    >
      <span className="bubble-field__glow bubble-field__glow--one" aria-hidden="true" />
      <span className="bubble-field__glow bubble-field__glow--two" aria-hidden="true" />
      <span className="bubble-field__grid" aria-hidden="true" />
      <span className="bubble-field__caption">MOVE · TOUCH · PLAY</span>

      {SPECS.map((spec, index) => {
        const tone = toneOf(spec)
        const isHidden = hidden.has(spec.id)
        const isGame = spec.kind === 'game' && spec.game
        const isMystic = spec.kind === 'mystic' && spec.mystic

        return (
          <button
            key={spec.id}
            type="button"
            ref={(element) => {
              if (element) bubbleRefs.current.set(spec.id, element)
              else bubbleRefs.current.delete(spec.id)
            }}
            className={`bubble${spec.kind === 'game' ? ' bubble--game' : ''}${spec.kind === 'mystic' ? ' bubble--mystic' : ''
              }${isHidden ? ' is-hidden' : ''}`}
            style={
              {
                '--bubble-size': `${Math.round(spec.size * scale)}px`,
                '--c1': tone[0],
                '--c2': tone[1],
                '--c3': tone[2],
                '--enter-delay': `${index * 45}ms`,
              } as CSSProperties
            }
            onClick={(event) => {
              if (isGame) onOpenGame(spec.game as GameId)
              else if (isMystic) onOpenMystic(spec.mystic as MysticId)
              else pop(spec, event)
            }}
            disabled={isHidden}
            tabIndex={isHidden ? -1 : 0}
            aria-hidden={isHidden || undefined}
            aria-label={
              isGame
                ? `打开小游戏：${GAMES[spec.game as GameId].name}`
                : isMystic
                  ? `打开占卜：${MYSTICS[spec.mystic as MysticId].name}`
                  : `${spec.label}，${spec.message ?? ''}。点击看看`
            }
          >
            <span className="bubble__inner">
              {isGame ? <span className="bubble__badge">PLAY</span> : null}
              {isMystic ? <span className="bubble__badge bubble__badge--mystic">MYSTIC</span> : null}
              <span className="bubble__glyph">{spec.glyph}</span>
              <span className="bubble__label">{spec.label}</span>
            </span>
          </button>
        )
      })}

      {burst ? (
        <span
          key={burst.id}
          className="bubble-burst"
          style={{ left: burst.x, top: burst.y }}
          aria-hidden="true"
        >
          <span />
          {Array.from({ length: 6 }).map((_, index) => (
            <i key={index} style={{ '--a': `${index * 60 + 12}deg` } as CSSProperties} />
          ))}
        </span>
      ) : null}

      {toast ? (
        <div
          key={toast.id}
          className="bubble-toast"
          style={{ left: toast.x, top: toast.y }}
          role="status"
        >
          {toast.text}
        </div>
      ) : null}
    </div>
  )
}
