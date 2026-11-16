import { useEffect, useRef, useState } from 'react'
import type { Cat } from '../data/cats'
import { catImage } from '../data/cats'
import { ChevronLeft, ChevronRight, Paw } from './Icons'

type CatCarouselProps = {
  items: Cat[]
}

export default function CatCarousel({ items }: CatCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = (index: number) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelectorAll<HTMLElement>('.cat-card')[index]
    if (!card) return
    const padding = parseFloat(getComputedStyle(rail).paddingLeft) || 0
    rail.scrollTo({ left: Math.max(0, card.offsetLeft - padding), behavior: 'smooth' })
    activeRef.current = index
    setActive(index)
  }

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const cards = Array.from(rail.querySelectorAll<HTMLElement>('.cat-card'))
        if (!cards.length) return
        const padding = parseFloat(getComputedStyle(rail).paddingLeft) || 0
        const anchor = rail.scrollLeft + padding
        let nearest = 0
        let min = Infinity
        cards.forEach((card, index) => {
          const distance = Math.abs(card.offsetLeft - anchor)
          if (distance < min) {
            min = distance
            nearest = index
          }
        })
        activeRef.current = nearest
        setActive(nearest)
      })
    }

    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      goTo((activeRef.current + 1) % items.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [paused, items.length])

  return (
    <div
      className="cat-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="狗狗角色轮播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="cat-rail" ref={railRef}>
        {items.map((cat, index) => (
          <article
            className="cat-card"
            key={cat.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length} · ${cat.role} ${cat.name}`}
          >
            <figure className="cat-card__media">
              <img
                src={catImage(cat)}
                alt={`${cat.role} ${cat.name}：${cat.desc}`}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              <figcaption className="cat-card__role">
                <Paw size={13} />
                {cat.role}
              </figcaption>
              <span className="cat-card__no" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            </figure>

            <div className="cat-card__body">
              <div className="cat-card__head">
                <h3>{cat.name}</h3>
                <span>{cat.latin}</span>
              </div>
              <p>{cat.desc}</p>
              <div className="cat-card__traits">
                {cat.traits.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
        <span className="cat-rail__spacer" aria-hidden="true" />
      </div>

      <div className="cat-controls">
        <div className="cat-dots" role="tablist" aria-label="选择狗狗角色">
          {items.map((cat, index) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`查看${cat.role} ${cat.name}`}
              className={`cat-dot${active === index ? ' is-active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <div className="cat-arrows">
          <button
            type="button"
            className="cat-arrow"
            aria-label="上一只狗"
            onClick={() => goTo((activeRef.current - 1 + items.length) % items.length)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="cat-arrow"
            aria-label="下一只狗"
            onClick={() => goTo((activeRef.current + 1) % items.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}
