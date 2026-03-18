// Launches a headless, cookie-authenticated Playwright browser session against discogs.com.
// Used by the marketplace crawler since listing pages require a logged-in session (no public API).
import "dotenv/config"
import { chromium, type BrowserContext } from "playwright"

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

function parseCookieHeader(header: string) {
  return header.split(";").map((pair) => {
    const index = pair.indexOf("=")
    return {
      name: pair.slice(0, index).trim(),
      value: pair.slice(index + 1).trim(),
      domain: ".discogs.com",
      path: "/",
    }
  })
}

export async function withAuthedPage<T>(fn: (page: import("playwright").Page) => Promise<T>): Promise<T> {
  const cookieHeader = process.env.DISCOGS_SESSION_COOKIE

  if (!cookieHeader) {
    throw new Error("DISCOGS_SESSION_COOKIE is not set")
  }

  const browser = await chromium.launch({ headless: true })

  let context: BrowserContext | undefined

  try {
    context = await browser.newContext({ userAgent: USER_AGENT })
    await context.addCookies(parseCookieHeader(cookieHeader))
    const page = await context.newPage()
    return await fn(page)
  } finally {
    await context?.close()
    await browser.close()
  }
}
