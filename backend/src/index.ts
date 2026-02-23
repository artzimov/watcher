import { Hono } from "hono"
import { serve } from "@hono/node-server"

const app = new Hono()

app.get("/health", (c) => c.json({ status: "ok" }))

const port = 8787

serve({ fetch: app.fetch, port }, () => {
  console.log(`backend listening on http://localhost:${port}`)
})
