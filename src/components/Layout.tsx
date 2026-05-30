import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import EagleLogo from './EagleLogo'

const NAV_INLINE = "hidden min-[480px]:flex items-center gap-4"
const NAV_BURGER_HIT = "min-[480px]:hidden"

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    function onClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const linkCls = "text-ink/80 hover:text-royal transition-colors font-bold text-sm"

  return (
    <div className="min-h-screen flex flex-col">
      <header ref={headerRef} className="relative bg-brass border-b-4 border-royal shadow-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-x-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-tight text-ink hover:text-ink/70 transition-colors leading-none"
          >
            <EagleLogo size={42} variant="royal" className="-my-1 shrink-0" />
            <span>
              <span className="text-royal">Max</span><span className="text-ink">SAX</span><span className="text-royal">.</span>
            </span>
          </Link>

          <nav className={NAV_INLINE}>
            <Link to="/" className={linkCls}>Home</Link>
            <Link to="/metronome" className={linkCls}>Metronome</Link>
            <Link to="/history" className={linkCls}>History</Link>
            <Link to="/weak-spots" className="text-ink/80 hover:text-maroon transition-colors font-bold text-sm">Weak&nbsp;Spots</Link>
            <Link to="/settings" className={linkCls}>Settings</Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`${NAV_BURGER_HIT} ml-auto text-ink p-2 -mr-2 rounded-lg hover:bg-ink/10 active:bg-ink/20 transition-colors`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            className={`${NAV_BURGER_HIT} absolute right-2 top-full mt-1 min-w-[180px] bg-ink-light border border-royal/40 rounded-xl shadow-xl overflow-hidden z-50`}
          >
            <Link to="/" className="block px-5 py-3 text-cream hover:bg-royal hover:text-white transition-colors font-bold border-b border-ink-lighter">Home</Link>
            <Link to="/metronome" className="block px-5 py-3 text-cream hover:bg-royal hover:text-white transition-colors font-bold border-b border-ink-lighter">Metronome</Link>
            <Link to="/history" className="block px-5 py-3 text-cream hover:bg-royal hover:text-white transition-colors font-bold border-b border-ink-lighter">History</Link>
            <Link to="/weak-spots" className="block px-5 py-3 text-cream hover:bg-maroon hover:text-white transition-colors font-bold border-b border-ink-lighter">Weak Spots</Link>
            <Link to="/settings" className="block px-5 py-3 text-cream hover:bg-brass hover:text-ink transition-colors font-bold">Settings</Link>
          </div>
        )}
      </header>
      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
