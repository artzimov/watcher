// Drizzle DB client singleton, backed by Neon serverless Postgres.
// Imported by every module that needs to read/write the database.
// Uses the HTTP-based neon-http driver (not neon-serverless/Pool) since no code here needs
// multi-statement transactions — this avoids needing a WebSocket polyfill on plain Node.js runtimes.
import "dotenv/config"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const db = drizzle(neon(process.env.DATABASE_URL))
