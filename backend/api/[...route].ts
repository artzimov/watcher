// Vercel Function entry point — catches all /api/* requests and forwards them to the Hono app.
// Lives inside backend/ since this project's Vercel "Root Directory" is set to backend.
// Runs on the Node.js runtime (not Edge) since dotenv/config and the Neon driver expect Node built-ins.
import { handle } from "hono/vercel"
import app from "../src/app.js"

export const config = {
  runtime: "nodejs",
}

// Named "fetch" export (not default) signals the Web fetch-style handler contract to Vercel's
// Node.js runtime — a default export is assumed to be the legacy (req, res) => void signature.
export const fetch = handle(app)
