import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('页面未找到 · Elio Li')

  return (
    <section className="not-found container">
      <div className="not-found__bubble" aria-hidden="true">
        <span>404</span>
      </div>
      <p className="eyebrow">LOST IN THE BUBBLES</p>
      <h1>这页像泡泡一样，消失了。</h1>
      <p>你访问的页面不存在，或者已经被我收进了抽屉。</p>
      <Link to="/" className="btn btn--primary">
        回到首页
        <ArrowRight />
      </Link>
    </section>
  )
}
