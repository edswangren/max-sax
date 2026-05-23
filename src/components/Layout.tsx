import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brass px-6 py-4 flex items-center gap-6">
        <Link to="/" className="text-3xl font-black tracking-tight text-ink hover:text-ink/70 transition-colors leading-none">
          <span className="text-maroon">Max</span><span className="text-ink">SAX</span><span className="text-maroon">.</span>
        </Link>
        <nav className="flex gap-4 text-sm font-bold">
          <Link to="/" className="text-ink/70 hover:text-ink transition-colors">Home</Link>
          <Link to="/history" className="text-ink/70 hover:text-ink transition-colors">History</Link>
          <Link to="/weak-spots" className="text-ink/70 hover:text-maroon transition-colors">Weak Spots</Link>
          <Link to="/settings" className="text-ink/70 hover:text-ink transition-colors ml-auto">Settings</Link>
        </nav>
      </header>
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
