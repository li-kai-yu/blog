import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Close, Refresh } from '../components/Icons'
import {
  ALMANAC_HOURS,
  ALMANAC_JI,
  ALMANAC_YI,
  HEXAGRAMS,
  LUCKY_COLORS,
  MOODS,
  MOVING_LINES,
  MYSTICS,
  TAROT_CARDS,
  ZODIACS,
  ZODIAC_LINES,
  dayKey,
  hashString,
  pickIndex,
  pickUnique,
  todayZodiacIndex,
  type MysticId,
  type TarotCard,
} from './mystic'

type MysticDialogProps = {
  initial: MysticId
  onClose: () => void
}

type TarotSlot = {
  card: TarotCard
  reversed: boolean
  flipped: boolean
}

function drawSpread(): TarotSlot[] {
  const seed = Math.floor(Math.random() * 1_000_000_000)
  return pickUnique(TAROT_CARDS, 3, seed).map((card, index) => ({
    card,
    reversed: ((seed >> (index + 3)) & 1) === 1,
    flipped: false,
  }))
}

export default function MysticDialog({ initial, onClose }: MysticDialogProps) {
  const [tab, setTab] = useState<MysticId>(initial)
  const [zodiacIndex, setZodiacIndex] = useState(todayZodiacIndex)
  const [dayIndex, setDayIndex] = useState(0)
  const [hourIndex, setHourIndex] = useState(0)
  const [cast, setCast] = useState(0)
  const [spread, setSpread] = useState<TarotSlot[]>(() => drawSpread())

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

  const days = useMemo(() => {
    const base = new Date()
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(base)
      date.setDate(base.getDate() + index)
      const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
      return {
        key: dayKey(date),
        label: index === 0 ? '今天' : index === 1 ? '明天' : `周${weekday}`,
        short: `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
      }
    })
  }, [])

  const today = dayKey(new Date())
  const sign = ZODIACS[zodiacIndex]
  const zodiacSeed = hashString(`${sign.name}-${today}`)
  const luck = 62 + (zodiacSeed % 37)
  const mood = MOODS[pickIndex(zodiacSeed, MOODS.length, 1)]
  const zodiacLine = ZODIAC_LINES[pickIndex(zodiacSeed, ZODIAC_LINES.length, 2)]
  const luckyColor = LUCKY_COLORS[pickIndex(zodiacSeed, LUCKY_COLORS.length, 3)]
  const luckyNumber = pickIndex(zodiacSeed, 9, 4) + 1
  const match = ZODIACS[(zodiacIndex + 4 + (zodiacSeed % 5)) % ZODIACS.length]
  const zodiacYi = pickUnique(ALMANAC_YI, 2, zodiacSeed + 5)
  const zodiacJi = pickUnique(ALMANAC_JI, 2, zodiacSeed + 13)

  const almanacSeed = hashString(`almanac-${days[dayIndex].key}`)
  const almanacYi = pickUnique(ALMANAC_YI, 3, almanacSeed)
  const almanacJi = pickUnique(ALMANAC_JI, 2, almanacSeed + 11)
  const almanacHours = pickUnique(ALMANAC_HOURS, 3, almanacSeed + 23)

  const castSeed = hashString(`gua-${cast}-${today}`)
  const hexagram = HEXAGRAMS[castSeed % HEXAGRAMS.length]
  const movingLine = 1 + ((castSeed >> 4) % 6)

  const allFlipped = spread.every((slot) => slot.flipped)

  const flipCard = (index: number) => {
    setSpread((previous) =>
      previous.map((slot, slotIndex) =>
        slotIndex === index && !slot.flipped ? { ...slot, flipped: true } : slot,
      ),
    )
  }

  return createPortal(
    <div
      className="mystic-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="mystic-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mystic-title"
      >
        <header className="mystic-dialog__head">
          <div>
            <p className="eyebrow">
              {MYSTICS[tab].latin} / 仅供娱乐
            </p>
            <h2 id="mystic-title">{MYSTICS[tab].name}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="game-dialog__close"
            aria-label="关闭"
            onClick={onClose}
          >
            <Close />
          </button>
        </header>

        <div className="mystic-tabs" role="tablist" aria-label="占卜类型">
          {(Object.keys(MYSTICS) as MysticId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`mystic-tab${tab === id ? ' is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              <span aria-hidden="true">{MYSTICS[id].glyph}</span>
              {MYSTICS[id].name}
            </button>
          ))}
        </div>

        <p className="mystic-hint">{MYSTICS[tab].hint}</p>

        <div className="mystic-body">
          {tab === 'zodiac' ? (
            <div className="mystic-zodiac">
              <div className="zodiac-grid" role="group" aria-label="选择星座">
                {ZODIACS.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={index === zodiacIndex}
                    className={`zodiac-chip${index === zodiacIndex ? ' is-active' : ''}`}
                    onClick={() => setZodiacIndex(index)}
                  >
                    <span aria-hidden="true">{item.glyph}</span>
                    <em>{item.name.replace('座', '')}</em>
                  </button>
                ))}
              </div>

              <div className="zodiac-card">
                <div className="zodiac-card__head">
                  <span className="zodiac-card__glyph" aria-hidden="true">
                    {sign.glyph}
                  </span>
                  <div className="zodiac-card__id">
                    <strong>{sign.name}</strong>
                    <span>
                      {sign.latin} · {sign.element} · {sign.range}
                    </span>
                  </div>
                  <span className="zodiac-card__score">
                    {luck}
                    <em>今日运势</em>
                  </span>
                </div>

                <p className="zodiac-card__mood">今日关键词 · {mood}</p>
                <p className="zodiac-card__line">{zodiacLine}</p>

                <div className="zodiac-card__facts">
                  <span>
                    <i style={{ backgroundColor: luckyColor.hex }} aria-hidden="true" />
                    {luckyColor.name}
                  </span>
                  <span>幸运数字 · {luckyNumber}</span>
                  <span>契合星座 · {match.name}</span>
                </div>

                <div className="zodiac-card__tokens">
                  <span className="is-yi">宜 {zodiacYi.join(' · ')}</span>
                  <span className="is-ji">忌 {zodiacJi.join(' · ')}</span>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'almanac' ? (
            <div className="almanac">
              <div className="almanac-days" role="group" aria-label="选择日期">
                {days.map((day, index) => (
                  <button
                    key={day.key}
                    type="button"
                    aria-pressed={index === dayIndex}
                    className={`almanac-day${index === dayIndex ? ' is-active' : ''}`}
                    onClick={() => {
                      setDayIndex(index)
                      setHourIndex(0)
                    }}
                  >
                    <span>{day.label}</span>
                    <em>{day.short}</em>
                  </button>
                ))}
              </div>

              <div className="almanac-lists">
                <div>
                  <p className="almanac-label is-yi">宜</p>
                  <div className="almanac-tokens">
                    {almanacYi.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="almanac-label is-ji">忌</p>
                  <div className="almanac-tokens is-ji">
                    {almanacJi.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="almanac-hours">
                <p className="almanac-label">吉时</p>
                <div className="almanac-hours__grid" role="group" aria-label="选择吉时">
                  {almanacHours.map((hour, index) => (
                    <button
                      key={hour.name}
                      type="button"
                      aria-pressed={index === hourIndex}
                      className={`almanac-hour${index === hourIndex ? ' is-active' : ''}`}
                      onClick={() => setHourIndex(index)}
                    >
                      <span>{hour.name}</span>
                      <em>{hour.range}</em>
                    </button>
                  ))}
                </div>
                <p className="almanac-note">
                  已选 · {almanacHours[hourIndex].name}｜{almanacHours[hourIndex].note}
                </p>
              </div>
            </div>
          ) : null}

          {tab === 'divination' ? (
            <div className="gua">
              <div className="gua-figure" aria-hidden="true">
                {hexagram.lines
                  .slice()
                  .reverse()
                  .map((yang, index) => {
                    const lineNumber = 6 - index
                    return (
                      <div
                        className={`gua-line${lineNumber === movingLine ? ' is-moving' : ''}`}
                        key={lineNumber}
                      >
                        <span className="gua-line__no">{lineNumber}</span>
                        {yang ? (
                          <span className="gua-bar" />
                        ) : (
                          <span className="gua-bar gua-bar--yin">
                            <i />
                            <i />
                          </span>
                        )}
                      </div>
                    )
                  })}
                <span className="gua-symbol">{hexagram.symbol}</span>
              </div>

              <div className="gua-copy">
                <p className="gua-name">{hexagram.name}卦</p>
                <p className="gua-judgement">「{hexagram.judgement}」</p>
                <p className="gua-reading">{hexagram.reading}</p>
                <p className="gua-moving">{MOVING_LINES[movingLine - 1]}</p>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => setCast((value) => value + 1)}
                >
                  <Refresh />
                  再摇一卦
                </button>
              </div>
            </div>
          ) : null}

          {tab === 'tarot' ? (
            <div className="tarot">
              <div className="tarot-deck">
                {spread.map((slot, index) => (
                  <div className="tarot-slot" key={`${slot.card.latin}-${index}`}>
                    <span className="tarot-slot__label">{['过去', '现在', '未来'][index]}</span>
                    <button
                      type="button"
                      className={`tarot-card${slot.flipped ? ' is-flipped' : ''}`}
                      aria-label={
                        slot.flipped
                          ? `${slot.card.name}，${slot.reversed ? '逆位' : '正位'}`
                          : `翻开${['过去', '现在', '未来'][index]}的卡牌`
                      }
                      onClick={() => flipCard(index)}
                    >
                      <span className="tarot-card__inner">
                        <span className="tarot-card__face tarot-card__back">
                          <span aria-hidden="true">✧</span>
                          <em>TAROT</em>
                        </span>
                        <span className="tarot-card__face tarot-card__front">
                          <em className="tarot-card__roman">{slot.card.roman}</em>
                          <span className="tarot-card__glyph" aria-hidden="true">
                            {slot.card.glyph}
                          </span>
                          <strong>{slot.card.name}</strong>
                          <i>{slot.reversed ? '逆位' : '正位'}</i>
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="tarot-notes">
                {spread.map((slot, index) => (
                  <div key={index} className={slot.flipped ? 'is-on' : ''}>
                    <span>
                      {['过去', '现在', '未来'][index]} · {slot.card.name}
                      {slot.flipped ? ` · ${slot.reversed ? '逆位' : '正位'}` : ''}
                    </span>
                    <p>
                      {slot.flipped
                        ? slot.reversed
                          ? slot.card.reversed
                          : slot.card.upright
                        : '点开卡牌，看看它想说什么。'}
                    </p>
                  </div>
                ))}
              </div>

              {allFlipped ? (
                <p className="mystic-note">给开发者的提示 · {spread[1].card.dev}</p>
              ) : null}

              <div className="mystic-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => setSpread(drawSpread())}
                >
                  <Refresh />
                  重新洗牌
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <footer className="mystic-dialog__foot">
          <span>仅供娱乐 · 别让占卜替你做决定</span>
          <span>ESC 关闭</span>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
