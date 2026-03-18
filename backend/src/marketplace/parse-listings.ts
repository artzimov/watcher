// Scrapes a Discogs marketplace listing-page HTML into structured ParsedListing rows.
// Used by the Playwright crawler; the email-ingest Apps Script produces compatible payloads independently.
import * as cheerio from "cheerio"

export interface ParsedListing {
  listingId: string
  condition: string | null
  sleeveCondition: string | null
  comments: string | null
  price: number | null
  currency: string | null
  shippingPrice: number | null
  location: string | null
  sellerDiscogsId: string
  sellerName: string
  sellerRating: string | null
}

function parsePrice(text: string): number | null {
  const match = text.replace(/,/g, "").match(/[\d.]+/)
  return match ? Math.round(Number(match[0]) * 100) : null
}

export function parseListings(html: string): ParsedListing[] {
  const $ = cheerio.load(html)
  const listings: ParsedListing[] = []

  $("table.mpitems > tbody > tr").each((_, el) => {
    const row = $(el)

    const titleLink = row.find("a.item_description_title")
    const listingId = (titleLink.attr("href") ?? "").match(/\/sell\/item\/(\d+)/)?.[1]

    if (!listingId) {
      return
    }

    const conditionEl = row
      .find("p.item_condition > span")
      .not(".mplabel")
      .not(".item_sleeve_condition")
      .first()
      .clone()
    conditionEl.find(".has-tooltip").remove()
    const condition = conditionEl.text().trim() || null
    const sleeveCondition = row.find("span.item_sleeve_condition").first().text().trim() || null

    const sellerLink = row.find("td.seller_info a[href^='/seller/']").first()
    const sellerName = sellerLink.text().trim()
    const sellerIdAttr = row.find("[data-seller-id]").first().attr("data-seller-id")
    const sellerRating = row.find("td.seller_info strong").eq(1).text().trim() || null
    const location = row
      .find("td.seller_info li")
      .filter((_, li) => $(li).text().includes("Ships From:"))
      .text()
      .replace("Ships From:", "")
      .trim()

    const priceEl = row.find("span.price").first()
    const price = priceEl.attr("data-pricevalue")
      ? Math.round(Number(priceEl.attr("data-pricevalue")) * 100)
      : null
    const currency = priceEl.attr("data-currency") ?? null
    const shippingText = row.find("span.item_shipping").first().text()
    const shippingPrice = shippingText ? parsePrice(shippingText) : null

    const comments = row
      .find("td.item_description > p.hide_mobile")
      .not(".label_and_cat")
      .first()
      .text()
      .trim() || null

    listings.push({
      listingId,
      condition,
      sleeveCondition,
      comments,
      price,
      currency,
      shippingPrice,
      location: location || null,
      sellerDiscogsId: sellerIdAttr ?? sellerName,
      sellerName,
      sellerRating,
    })
  })

  return listings
}
