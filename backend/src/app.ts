// Hono app definition — wires wantlist/collection/listings routes.
// Shared between the local dev server (src/index.ts) and the Vercel Function (api/[[...route]].ts).
import { Hono } from "hono"
import { cors } from "hono/cors"
import { wantlistRoutes } from "./routes/wantlist"
import { collectionRoutes } from "./routes/collection"
import { listingsRoutes } from "./routes/listings"

export const app = new Hono()

app.use("/api/*", cors())

app.get("/health", (c) => c.json({ status: "ok" }))

app.route("/api/wantlist", wantlistRoutes)
app.route("/api/collection", collectionRoutes)
app.route("/api/listings", listingsRoutes)
