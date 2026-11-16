import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { useLocalTime } from '../lib/useLocalTime'
import { ArrowUpRight } from './Icons'

const FOOTER_LINES: Record<string, { zh: string; en: string }> = {
  '/': { zh: '保持好奇，', en: 'take it easy.' },
  '/writing': { zh: '把话写下来，', en: 'words will stay.' },
  '/moments': { zh: '今天也辛苦了，', en: 'rest a little.' },
  '/projects': { zh: '做点喜欢的事，', en: 'build with heart.' },
  '/interview': { zh: '别急，慢慢来，', en: 'trust yourself.' },
  '/lab': { zh: '玩一会儿吧，', en: 'play is progress.' },
  '/about': { zh: '很高兴认识你，', en: 'nice to meet you.' },
  '/resume': { zh: '一步一步来，', en: 'one step at a time.' },
}

const POST_LINE = { zh: '谢谢你读到这里，', en: 'thanks for staying.' }
const FALLBACK_LINE = { zh: '走错路也有风景，', en: 'wander on.' }

export default function Footer() {
  const time = useLocalTime()
  const year = new Date().getFullYear()
  const { pathname } = useLocation()
  const line = pathname.startsWith('/writing/')
    ? POST_LINE
    : (FOOTER_LINES[pathname] ?? FALLBACK_LINE)

  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <div className="footer-cta__main">
          <p className="eyebrow">
            <span className="eyebrow__dot" />
            STAY IN TOUCH
          </p>
          <h2>
            {line.zh}
            <br />
            <span className="serif">{line.en}</span>
          </h2>
        </div>
        <div className="footer-cta__side">
          <p>
            如果这些文字让你停留了一会儿，
            <br />
            那它们就有了意义。
          </p>
          {site.email ? (
            <a className="text-link" href={`mailto:${site.email}`}>
              写封邮件
              <ArrowUpRight />
            </a>
          ) : (
            <Link className="text-link" to="/about">
              更多关于我
              <ArrowUpRight />
            </Link>
          )}
        </div>
      </div>

      <div className="container footer-meta">
        <span>© {year} {site.name}</span>
        <span className="footer-meta__note">用 React 与一点好奇心手工构建</span>
        <span>{time || '--:--'} UTC+8</span>
      </div>
    </footer>
  )
}
