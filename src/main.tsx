import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/base.css'
import './styles/home.css'
import './styles/moments.css'
import './styles/writing.css'
import './styles/projects.css'
import './styles/interview.css'
import './styles/about.css'
import './styles/resume.css'
import './styles/lab.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
