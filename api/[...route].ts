// Vercel Function entry point — catches all /api/* requests and forwards them to the Hono app.
// Lives at the repo root so Vercel's zero-config /api convention finds it (Root Directory = repo root).
// Runs on the Node.js runtime (not Edge) since dotenv/config and the Neon driver expect Node built-ins.
import { handle } from "hono/vercel"
import app from "../backend/src/app.js"

export const config = {
  runtime: "nodejs",
}

export default handle(app)
