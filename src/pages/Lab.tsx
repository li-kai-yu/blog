import { useState } from 'react'
import Reveal from '../components/Reveal'
import { Play, Refresh } from '../components/Icons'
import BubbleField from '../lab/BubbleField'
import GameDialog from '../lab/GameDialog'
import MysticDialog from '../lab/MysticDialog'
import { GAMES, type GameId } from '../lab/games'
import { MYSTICS, type MysticId } from '../lab/mystic'
import { usePageMeta } from '../lib/usePageMeta'

export default function Lab() {
  const [game, setGame] = useState<GameId | null>(null)
  const [mystic, setMystic] = useState<MysticId | null>(null)
  const [fieldKey, setFieldKey] = useState(0)

  usePageMeta(
    '泡泡实验室 · Elio Li',
    '一片会回应你的小空间：柔软的泡泡、三款小游戏，还有星座、良辰吉日、算卦与塔罗占卜。',
  )

  return (
    <>
      <section className="page-head container lab-head">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          INTERACTIVE PLAYGROUND / 01
        </p>
        <h1>
          泡泡<span className="ink-mark">实验室</span>
        </h1>
        <p className="page-head__lead">
          一片会回应你的小空间。移动鼠标，泡泡会轻轻躲开；
          <br />
          点开大泡泡玩游戏，点开金色泡泡，抽一张今天的签。
        </p>
        <div className="lab-head__row">
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => setFieldKey((value) => value + 1)}
          >
            <Refresh />
            重新排列
          </button>
          <span className="lab-head__hint">轻推 · 点击 · 放松</span>
        </div>
      </section>

      <section className="container lab-stage">
        <BubbleField
          key={fieldKey}
          paused={game !== null || mystic !== null}
          onOpenGame={(next) => setGame(next)}
          onOpenMystic={(next) => setMystic(next)}
        />
        <div className="lab-legend">
          <span>
            <i className="lab-legend__dot lab-legend__dot--game" />
            大泡泡是小游戏
          </span>
          <span>
            <i className="lab-legend__dot lab-legend__dot--mystic" />
            金色泡泡是今日占卜
          </span>
          <span>
            <i className="lab-legend__dot" />
            小泡泡点开有惊喜
          </span>
          <span className="lab-legend__key">Tab 选中 · 回车打开</span>
        </div>

        <div className="lab-oracle">
          <span className="lab-oracle__label">TODAY&apos;S ORACLE</span>
          {(Object.keys(MYSTICS) as MysticId[]).map((id) => (
            <button
              key={id}
              type="button"
              className="lab-oracle__btn"
              onClick={() => setMystic(id)}
            >
              <span aria-hidden="true">{MYSTICS[id].glyph}</span>
              {MYSTICS[id].name}
            </button>
          ))}
        </div>
      </section>

      <section className="container lab-games">
        <div className="section-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              MINI GAMES
            </p>
            <h2>
              选一个<span className="ink-mark">小游戏</span>
            </h2>
          </div>
          <span className="lab-games__note">每局不超过两分钟</span>
        </div>

        <div className="lab-games__grid">
          {(Object.keys(GAMES) as GameId[]).map((id, index) => {
            const meta = GAMES[id]
            return (
              <Reveal key={id} delay={index * 70}>
                <button type="button" className="game-card" onClick={() => setGame(id)}>
                  <span className="game-card__top">
                    <span className="game-card__index">0{index + 1}</span>
                    <span className="game-card__glyph" aria-hidden="true">
                      {meta.glyph}
                    </span>
                  </span>
                  <span className="game-card__name">{meta.name}</span>
                  <span className="game-card__desc">{meta.card}</span>
                  <span className="game-card__cta">
                    开始游戏
                    <Play />
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      {game ? <GameDialog game={game} onClose={() => setGame(null)} /> : null}
      {mystic ? <MysticDialog initial={mystic} onClose={() => setMystic(null)} /> : null}
    </>
  )
}
