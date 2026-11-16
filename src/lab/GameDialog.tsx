import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Close } from '../components/Icons'
import { GAMES, type GameId } from './games'
import HueGame from './games/HueGame'
import MemoryGame from './games/MemoryGame'
import ReactionGame from './games/ReactionGame'

type GameDialogProps = {
  game: GameId
  onClose: () => void
}

export default function GameDialog({ game, onClose }: GameDialogProps) {
  const meta = GAMES[game]
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div
      className="game-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="game-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-title"
      >
        <header className="game-dialog__head">
          <div>
            <p className="eyebrow">{meta.latin}</p>
            <h2 id="game-title">{meta.name}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="game-dialog__close"
            aria-label="关闭游戏"
            onClick={onClose}
          >
            <Close />
          </button>
        </header>

        <p className="game-dialog__desc">{meta.description}</p>

        <div className="game-dialog__body">
          {game === 'memory' ? <MemoryGame /> : null}
          {game === 'hue' ? <HueGame /> : null}
          {game === 'reaction' ? <ReactionGame /> : null}
        </div>

        <footer className="game-dialog__foot">
          <span>{meta.hint}</span>
          <span>ESC 关闭</span>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
