// Route tree — a single home route nested under the shared Layout.
// Wantlist/Collection are tabs within Home, not separate routes.
import { Routes, Route } from "react-router-dom"
import { Layout } from "./Layout"
import { Home } from "./pages/Home"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
