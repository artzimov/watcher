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
          <nav>
            <NavLink to="/" end>Wantlist</NavLink>
            <NavLink to="/collection">Collection</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
