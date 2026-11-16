import { useDeferredValue, useState } from 'react'
import PostRow from '../components/PostRow'
import Reveal from '../components/Reveal'
import { Search } from '../components/Icons'
import { getAllTags, getPosts } from '../lib/posts'
import { usePageMeta } from '../lib/usePageMeta'

export default function Writing() {
  const posts = getPosts()
  const tags = getAllTags()
  const [activeTag, setActiveTag] = useState('全部')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  usePageMeta('博客 · Elio Li', '技术文章、工程实践与一些关于设计的思考。')

  const keyword = deferredQuery.trim().toLowerCase()
  const filtered = posts.filter((post) => {
    const matchesTag = activeTag === '全部' || post.tags.includes(activeTag)
    const matchesQuery =
      !keyword ||
      post.title.toLowerCase().includes(keyword) ||
      post.description.toLowerCase().includes(keyword) ||
      post.tags.some((tag) => tag.toLowerCase().includes(keyword))
    return matchesTag && matchesQuery
  })

  const groups = filtered.reduce<Record<string, typeof filtered>>((result, post) => {
    const year = post.date.slice(0, 4)
      ; (result[year] ??= []).push(post)
    return result
  }, {})
  const order = new Map(filtered.map((post, index) => [post.slug, index]))

  const resetFilters = () => {
    setActiveTag('全部')
    setQuery('')
  }

  return (
    <>
      <section className="page-head container">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          WRITING / {String(posts.length).padStart(2, '0')} NOTES
        </p>
        <h1>
          写下来的，
          <br />
          才算真正<span className="ink-mark">想过。</span>
        </h1>
        <p className="page-head__lead">
          关于后端工程、前端体验与 AI 实践的长短句。
          <br />
          不追热点，只记录那些值得反复想清楚的问题。
        </p>
      </section>

      <section className="container writing-body">
        <div className="writing-toolbar">
          <div className="filter-row" role="group" aria-label="按标签筛选">
            {['全部', ...tags].map((tag) => (
              <button
                type="button"
                key={tag}
                className={`filter-chip${activeTag === tag ? ' is-active' : ''}`}
                aria-pressed={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <label className="search-field">
            <Search />
            <span className="sr-only">搜索文章</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、摘要或标签"
            />
          </label>
        </div>

        <div className="writing-count">
          <span>共 {filtered.length} 篇</span>
          <span className="writing-count__rule" />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">没有找到相关的文字。</p>
            <p>换个关键词，或者回到全部文章。</p>
            <button type="button" className="btn btn--ghost" onClick={resetFilters}>
              清除筛选
            </button>
          </div>
        ) : (
          <div className="writing-list">
            {Object.entries(groups).map(([year, yearPosts]) => (
              <div className="year-group" key={year}>
                <div className="year-label">
                  <span>{year}</span>
                  <span>{String(yearPosts.length).padStart(2, '0')} 篇</span>
                </div>
                <div className="post-list">
                  {yearPosts.map((post) => (
                    <Reveal key={post.slug}>
                      <PostRow
                        post={post}
                        index={String((order.get(post.slug) ?? 0) + 1).padStart(2, '0')}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
