// Vercel Function entry point — catches all /api/* requests and forwards them to the Hono app.
// Runs on the Node.js runtime (not Edge) since dotenv/config and the Neon driver expect Node built-ins.
import { handle } from "hono/vercel"
import { app } from "../backend/src/app"

export const config = {
  runtime: "nodejs",
}

export default handle(app)
