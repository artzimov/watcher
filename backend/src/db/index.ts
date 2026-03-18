// Drizzle DB client singleton, backed by Neon serverless Postgres.
// Imported by every module that needs to read/write the database.
import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const db = drizzle(process.env.DATABASE_URL)
