import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from '../components/Icons'
import { formatDateCN, getPost, getPosts } from '../lib/posts'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

export default function PostPage() {
  const { slug = '' } = useParams()
  const post = getPost(slug)
  const posts = getPosts()
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('')

  usePageMeta(post ? `${post.title} · Elio Li` : '文章未找到 · Elio Li', post?.description)

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [slug])

  useEffect(() => {
    if (!post || post.toc.length === 0) return
    setActiveId(post.toc[0].id)

    const headings = post.toc
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -72% 0px', threshold: 0 },
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [post])

  if (!post) return <NotFound />

  const index = posts.findIndex((item) => item.slug === post.slug)
  const newer = index > 0 ? posts[index - 1] : undefined
  const older = index < posts.length - 1 ? posts[index + 1] : undefined

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <article className="post container">
        <Link to="/writing" className="back-link">
          <ArrowRight className="icon-flip" />
          全部文章
        </Link>

        <header className="post-head">
          <div className="post-head__grid">
            <div>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h1>{post.title}</h1>
              <p className="post-head__desc">{post.description}</p>
              <div className="post-meta">
                <span>{formatDateCN(post.date)}</span>
                <i />
                <span>{post.readingMinutes} 分钟阅读</span>
              </div>
            </div>
            <div className="post-head__art" aria-hidden="true">
              <span className="post-head__art-orbit" />
              <span className="post-head__art-orbit post-head__art-orbit--inner" />
              <span className="post-head__art-index">
                No.{String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </header>

        <div className="post-layout">
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.toc.length > 0 ? (
            <aside className="post-toc">
              <p className="eyebrow">ON THIS PAGE</p>
              <nav aria-label="文章目录">
                {post.toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`post-toc__link post-toc__link--h${item.level}${activeId === item.id ? ' is-active' : ''
                      }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
              <span className="post-toc__line" aria-hidden="true" />
            </aside>
          ) : null}
        </div>

        <footer className="post-foot">
          <p className="post-foot__note">感谢你读到这里。愿代码与生活，都保持轻盈。</p>

          <div className="post-nav">
            {newer ? (
              <Link to={`/writing/${newer.slug}`} className="post-nav__card">
                <span className="post-nav__label">
                  <ArrowRight className="icon-flip" />
                  上一篇
                </span>
                <span className="post-nav__title">{newer.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {older ? (
              <Link to={`/writing/${older.slug}`} className="post-nav__card post-nav__card--next">
                <span className="post-nav__label">
                  下一篇
                  <ArrowRight />
                </span>
                <span className="post-nav__title">{older.title}</span>
              </Link>
            ) : null}
          </div>

          <Link to="/writing" className="text-link post-foot__back">
            回到全部文章
            <ArrowUpRight />
          </Link>
        </footer>
      </article>
    </>
  )
}
