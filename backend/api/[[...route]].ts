// Vercel Function entry point — catches all /api/* requests and forwards them to the Hono app.
// Lives inside backend/ so Vercel finds it relative to the "backend" service root (see vercel.json).
// Runs on the Node.js runtime (not Edge) since dotenv/config and the Neon driver expect Node built-ins.
import { handle } from "hono/vercel"
import { app } from "../src/app.js"

export const config = {
  runtime: "nodejs",
}

export default handle(app)
