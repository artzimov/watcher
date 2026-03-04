import { NavLink, Outlet } from "react-router-dom"

export function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/" end>Wantlist</NavLink>
          <NavLink to="/collection">Collection</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
