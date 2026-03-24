// Route tree — maps URL paths to page components nested under the shared Layout.
import { Routes, Route } from "react-router-dom"
import { Layout } from "./Layout"
import { Wantlist } from "./pages/Wantlist"
import { Collection } from "./pages/Collection"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Wantlist />} />
        <Route path="collection" element={<Collection />} />
      </Route>
    </Routes>
  )
}

export default App
