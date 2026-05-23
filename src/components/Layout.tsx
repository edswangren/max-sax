import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brass px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-black tracking-tight text-ink hover:text-ink/70 transition-colors leading-none mr-auto sm:mr-0"
        >
          <span className="text-maroon">Max</span><span className="text-ink">SAX</span><span className="text-maroon">.</span>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold items-center">
          <Link to="/" className="text-ink/70 hover:text-ink transition-colors">Home</Link>
          <Link to="/history" className="text-ink/70 hover:text-ink transition-colors">History</Link>
          <Link to="/weak-spots" className="text-ink/70 hover:text-maroon transition-colors">Weak&nbsp;Spots</Link>
          <Link to="/settings" className="text-ink/70 hover:text-ink transition-colors">Settings</Link>
        </nav>
      </header>
      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
