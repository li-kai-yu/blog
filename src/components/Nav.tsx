import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { allNavItems, moreItems, navItems, site } from '../data/site'
import { ChevronDown, Close, Mail, Menu } from './Icons'
import LetterDialog from './LetterDialog'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [letterRead, setLetterRead] = useState(
    () =>
      typeof window !== 'undefined' && window.localStorage.getItem('elio-letter-read') === '1',
  )
  const location = useLocation()
  const moreRef = useRef<HTMLDivElement>(null)

  const moreActive = moreItems.some((item) => location.pathname.startsWith(item.to))

  const openLetter = () => {
    setLetterOpen(true)
    setMenuOpen(false)
    setMoreOpen(false)
    if (!letterRead) {
      setLetterRead(true)
      window.localStorage.setItem('elio-letter-read', '1')
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!moreOpen) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [moreOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMoreOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="site-nav__inner">
          <Link to="/" className="logo" aria-label={`${site.name} · 回到首页`}>
            <span className="logo__mark">E.</span>
            <span className="logo__text">
              {site.name}
              <em>{site.latin}</em>
            </span>
          </Link>

          <nav className="nav-links" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="nav-more" ref={moreRef}>
              <button
                type="button"
                className={`nav-more__btn${moreActive ? ' is-active' : ''}`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((value) => !value)}
              >
                更多
                <ChevronDown />
              </button>

              <div className={`nav-more__menu${moreOpen ? ' is-open' : ''}`}>
                {moreItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-more__link${isActive ? ' is-active' : ''}`
                    }
                    tabIndex={moreOpen ? 0 : -1}
                  >
                    {item.label}
                    <em>{item.en}</em>
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className={`nav-mail${letterRead ? '' : ' is-unread'}`}
              aria-label={letterRead ? '打开来信' : '打开来信，1 封未读'}
              title="写给你的一封信"
              onClick={openLetter}
            >
              <span className="nav-mail__icon">
                <Mail />
                {letterRead ? (
                  <span className="nav-mail__badge nav-mail__badge--dot" aria-hidden="true" />
                ) : (
                  <span className="nav-mail__badge">1</span>
                )}
              </span>
              <span className="nav-mail__label">来信</span>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="nav-menu-btn"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <nav className="mobile-menu__nav" aria-label="移动端主导航">
            {allNavItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `mobile-menu__link${isActive ? ' is-active' : ''}`
                }
                style={{ transitionDelay: menuOpen ? `${120 + index * 45}ms` : '0ms' }}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-menu__index">{item.index}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <span>{site.tagline}</span>
            <span>© {new Date().getFullYear()} {site.name}</span>
          </div>
        </div>
      </header>

      <LetterDialog open={letterOpen} onClose={() => setLetterOpen(false)} />
    </>
  )
}
