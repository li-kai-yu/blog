import { useDeferredValue, useState } from 'react'
import Reveal from '../components/Reveal'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from '../components/Icons'
import { interviewCategories, interviewQuestions } from '../data/interview'
import { usePageMeta } from '../lib/usePageMeta'

const categories = ['全部', ...interviewCategories]

export default function Interview() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(interviewQuestions[0]?.id ?? null)
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === 'undefined' || window.matchMedia('(min-width: 901px)').matches,
  )
  const deferredQuery = useDeferredValue(query)

  usePageMeta(
    '八股 · Elio Li',
    '把常见的后端面试题整理成自己的话：Java、MySQL、Redis、Spring、消息队列与计算机网络。',
  )

  const keyword = deferredQuery.trim().toLowerCase()
  const filtered = interviewQuestions.filter((item) => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory
    const matchesQuery =
      !keyword ||
      item.question.toLowerCase().includes(keyword) ||
      item.answer.some((paragraph) => paragraph.toLowerCase().includes(keyword)) ||
      item.points?.some((point) => point.toLowerCase().includes(keyword))
    return matchesCategory && matchesQuery
  })

  const countOf = (category: string) =>
    category === '全部'
      ? interviewQuestions.length
      : interviewQuestions.filter((item) => item.category === category).length

  const resetFilters = () => {
    setActiveCategory('全部')
    setQuery('')
  }

  const jumpToAnswer = (id: string) => {
    setOpenId(id)
    window.setTimeout(() => {
      const body = document.getElementById(`qa-body-${id}`)
      if (!body) return
      const top = body.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top, behavior: 'smooth' })
    }, 560)
  }

  return (
    <>
      <section className="page-head container">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          INTERVIEW / {String(interviewQuestions.length).padStart(2, '0')} QUESTIONS
        </p>
        <h1>
          把八股，
          <br />
          答成自己的<span className="ink-mark">理解。</span>
        </h1>
        <p className="page-head__lead">
          面试题只是索引，真正重要的是背后的取舍。
          <br />
          这里记录我整理过的答案，以及愿意继续追问的地方。
        </p>
      </section>

      <section
        className={`container interview-layout${sidebarOpen ? '' : ' is-collapsed'}`}
      >
        <aside className="interview-sidebar" aria-label="八股分类目录">
          <div className="interview-sidebar__head">
            <div className="interview-sidebar__label">
              <span className="interview-sidebar__title">分类目录</span>
              <span className="interview-sidebar__latin">INTERVIEW / INDEX</span>
            </div>
            <button
              type="button"
              className="interview-sidebar__toggle"
              aria-expanded={sidebarOpen}
              aria-controls="interview-categories"
              aria-label={sidebarOpen ? '收起分类侧栏' : '展开分类侧栏'}
              onClick={() => setSidebarOpen((value) => !value)}
            >
              {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>

          {sidebarOpen ? (
            <>
              <nav
                id="interview-categories"
                className="interview-cats"
                aria-label="按知识分类筛选"
              >
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`interview-cat${activeCategory === category ? ' is-active' : ''
                      }`}
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span className="interview-cat__name">{category}</span>
                    <span className="interview-cat__count">{countOf(category)}</span>
                  </button>
                ))}
              </nav>

              <p className="interview-sidebar__note">
                {interviewCategories.length} 个分类 · {interviewQuestions.length} 问
              </p>
            </>
          ) : (
            <span className="interview-sidebar__rail" aria-hidden="true">
              CATEGORIES
            </span>
          )}
        </aside>

        <div className="interview-main">
          <div className="interview-toolbar">
            <div className="interview-toolbar__meta">
              <span className="interview-toolbar__category">
                {activeCategory === '全部' ? '全部题目' : activeCategory}
              </span>
              <span className="interview-toolbar__count" aria-live="polite">
                共 {filtered.length} 问
              </span>
            </div>

            <label className="search-field interview-search">
              <Search />
              <span className="sr-only">搜索八股题</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索题目或关键词"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__title">没有找到相关的问题。</p>
              <p>换个关键词，或者回到全部分类。</p>
              <button type="button" className="btn btn--ghost" onClick={resetFilters}>
                清除筛选
              </button>
            </div>
          ) : (
            <div className="qa-list">
              {filtered.map((item, index) => {
                const open = openId === item.id
                return (
                  <Reveal key={item.id} delay={Math.min(index * 25, 180)}>
                    <article className={`qa${open ? ' is-open' : ''}`}>
                      <button
                        type="button"
                        className="qa__head"
                        aria-expanded={open}
                        aria-controls={`qa-body-${item.id}`}
                        onClick={() => (open ? setOpenId(null) : jumpToAnswer(item.id))}
                      >
                        <span className="qa__index">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="qa__main">
                          <span className="qa__category">{item.category}</span>
                          <span className="qa__question">{item.question}</span>
                        </span>
                        <span className="qa__toggle" aria-hidden="true">
                          <ChevronDown size={14} />
                        </span>
                      </button>

                      <div
                        className="qa__body"
                        id={`qa-body-${item.id}`}
                        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                      >
                        <div className="qa__body-inner">
                          <div className="qa__answer">
                            {item.answer.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                            {item.points ? (
                              <ul>
                                {item.points.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}

          <p className="qa-note">答案会继续补充，也会继续被推翻。</p>
        </div>
      </section>
    </>
  )
}
