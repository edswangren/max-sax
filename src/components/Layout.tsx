import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import SaxLogo from './SaxLogo'

const NAV_INLINE = "hidden min-[480px]:flex items-center gap-4"
const NAV_BURGER_HIT = "min-[480px]:hidden"

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  // close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // close on outside click
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

  const linkCls = "text-ink/75 hover:text-ink transition-colors font-bold text-sm"

  return (
    <div className="min-h-screen flex flex-col">
      <header ref={headerRef} className="bg-brass relative">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-x-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-tight text-ink hover:text-ink/70 transition-colors leading-none"
          >
            <SaxLogo size={32} className="-my-1" />
            <span>
              <span className="text-maroon">Max</span><span className="text-ink">SAX</span><span className="text-maroon">.</span>
            </span>
          </Link>

          {/* Inline nav — visible only when there's room */}
          <nav className={NAV_INLINE}>
            <Link to="/" className={linkCls}>Home</Link>
            <Link to="/history" className={linkCls}>History</Link>
            <Link to="/weak-spots" className="text-ink/75 hover:text-maroon transition-colors font-bold text-sm">Weak&nbsp;Spots</Link>
            <Link to="/settings" className={linkCls}>Settings</Link>
          </nav>

          {/* Hamburger — visible only when nav wouldn't fit */}
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

        {/* Dropdown panel — only when burger is the active control */}
        {menuOpen && (
          <div
            className={`${NAV_BURGER_HIT} absolute right-2 top-full mt-1 min-w-[180px] bg-ink-light border border-ink-lighter rounded-xl shadow-xl overflow-hidden z-50`}
          >
            <Link to="/" className="block px-5 py-3 text-cream hover:bg-brass hover:text-ink transition-colors font-bold border-b border-ink-lighter">Home</Link>
            <Link to="/history" className="block px-5 py-3 text-cream hover:bg-brass hover:text-ink transition-colors font-bold border-b border-ink-lighter">History</Link>
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
