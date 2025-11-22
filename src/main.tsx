import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure styles are processed before rendering to avoid layout warning
requestAnimationFrame(() => {
  const root = document.getElementById('root')
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
})
