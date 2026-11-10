import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
/*
 * Initial page is already painted with the
 * correct theme.
 */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove(
      'no-theme-transition',
    );
  });
});