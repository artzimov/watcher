// Persistent shell — renders the header with logo and an <Outlet /> for page content.
// No nav links: Wantlist/Collection live as tabs inside Home, not separate routes.
import { NavLink, Outlet } from "react-router-dom"

export function Layout() {
  return (
    <>
      <header>
        <div className="header-inner">
          <NavLink to="/" className="brand">
            <img src="/eye_logo_s.png" alt="Watcher" />
            <span className="brand-name">Watcher</span>
          </NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
