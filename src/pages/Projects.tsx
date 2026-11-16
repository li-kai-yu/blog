import { useState } from 'react'
import Reveal from '../components/Reveal'
import { projects } from '../data/projects'
import { usePageMeta } from '../lib/usePageMeta'

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null)
  usePageMeta('项目 · Elio Li', '后端工程、AI 应用与一些交互实验的实践记录。')

  return (
    <>
      <section className="page-head container">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          PROJECTS / SELECTED WORK
        </p>
        <h1>
          做一些具体的事，
          <br />
          并把它<span className="ink-mark">做好。</span>
        </h1>
        <p className="page-head__lead">
          我相信工程能力长在真实的约束里。
          <br />
          这些项目记录了我对性能、数据与体验的取舍。
        </p>
      </section>

      <section className="container projects">
        {projects.map((project, index) => {
          const open = openId === project.id
          return (
            <Reveal key={project.id} delay={index * 50}>
              <article className={`project project--${project.tone}${open ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="project__head"
                  aria-expanded={open}
                  aria-controls={`project-detail-${project.id}`}
                  onClick={() => setOpenId(open ? null : project.id)}
                >
                  <span className="project__index">{project.index}</span>

                  <span className="project__main">
                    <span className="project__latin">{project.latin}</span>
                    <span className="project__title-row">
                      <span className="project__name">{project.name}</span>
                      <span className="project__status">{project.status}</span>
                    </span>
                    <span className="project__summary">{project.summary}</span>
                    <span className="project__tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                  </span>

                  <span className="project__thumb" aria-hidden="true">
                    <span className="project__thumb-ring" />
                    <span className="project__thumb-mark">{project.index}</span>
                  </span>

                  <span className="project__toggle" aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </button>

                <div
                  className="project__detail"
                  id={`project-detail-${project.id}`}
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="project__detail-inner">
                    <div className="project__details">
                      {project.details.map((detail) => (
                        <div className="project__detail-item" key={detail.label}>
                          <span>{detail.label}</span>
                          <p>{detail.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="project__year">YEAR / {project.year}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}

        <p className="projects__note">更多实验，正在路上。</p>
      </section>
    </>
  )
}
