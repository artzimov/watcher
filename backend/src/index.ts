// Local dev entry point — starts the Hono app on a persistent Node server via @hono/node-server.
// Production on Vercel uses api/[[...route]].ts instead, which wraps the same app for serverless.
import { serve } from "@hono/node-server"
import { app } from "./app.js"

const port = 8787

serve({ fetch: app.fetch, port }, () => {
  console.log(`backend listening on http://localhost:${port}`)
})
