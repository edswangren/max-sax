import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { installInteractionUnlock } from './audio/synth'

// Prime Web Audio + iOS audio session on the first user interaction so the
// first ear-training Play tap is always audible.
installInteractionUnlock()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
