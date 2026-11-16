import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Nav from './components/Nav'
import About from './pages/About'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Lab from './pages/Lab'
import Moments from './pages/Moments'
import NotFound from './pages/NotFound'
import PostPage from './pages/PostPage'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Writing from './pages/Writing'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="ambient__glow ambient__glow--one" />
        <span className="ambient__glow ambient__glow--two" />
        <span className="ambient__glow ambient__glow--three" />
        <span className="ambient__glow ambient__glow--four" />
        <span className="ambient__silk ambient__silk--one" />
        <span className="ambient__silk ambient__silk--two" />
        <span className="ambient__streak ambient__streak--one" />
        <span className="ambient__streak ambient__streak--two" />
        <span className="ambient__streak ambient__streak--three" />
        <span className="ambient__streak ambient__streak--four" />
      </div>
      <ScrollManager />
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <Nav />
      <main id="main" className="page" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<PostPage />} />
          <Route path="/moments" element={<Moments />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
