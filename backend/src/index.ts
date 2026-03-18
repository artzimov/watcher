import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { wantlistRoutes } from "./routes/wantlist"
import { collectionRoutes } from "./routes/collection"
import { listingsRoutes } from "./routes/listings"

const app = new Hono()

app.use("/api/*", cors())

app.get("/health", (c) => c.json({ status: "ok" }))

app.route("/api/wantlist", wantlistRoutes)
app.route("/api/collection", collectionRoutes)
app.route("/api/listings", listingsRoutes)

const port = 8787

serve({ fetch: app.fetch, port }, () => {
  console.log(`backend listening on http://localhost:${port}`)
})
