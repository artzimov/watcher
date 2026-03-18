// ─── Config (fill these in before deploying) ───────────────────────────────
var BACKEND_URL   = 'https://YOUR_BACKEND_URL/api/listings/ingest';
var INGEST_SECRET = 'YOUR_INGEST_SECRET';

// Gmail search query — matches Discogs realtime notification emails
var GMAIL_QUERY = 'from:noreply@discogs.com subject:"Discogs Realtime Notification" is:unread';

// ─── Entry point (set this as a time-driven trigger, e.g. every 5 min) ────
function processWantlistEmails() {
  var threads = GmailApp.search(GMAIL_QUERY, 0, 50);

  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      if (!message.isUnread()) return;

      try {
        var listings = parseEmail(message.getBody());
        Logger.log('Parsed ' + listings.length + ' listings from: ' + message.getSubject());

        listings.forEach(function(listing) {
          ingest(listing);
        });
      } catch (e) {
        Logger.log('Error processing email "' + message.getSubject() + '": ' + e.message);
      }

      message.markRead();
    });
  });
}

// ─── Parse all listing blocks from one HTML email body ─────────────────────
function parseEmail(html) {
  // Each listing lives in a section div with this characteristic border style.
  // Split on the opening of each such section to isolate blocks.
  var parts = html.split(/(?=<div[^>]*border-bottom:1px solid[^>]*#ebeae3[^>]*>)/i);
  var listings = [];

  parts.forEach(function(block) {
    // Quick guard: must contain both an image and an "Add To Cart" button
    if (!block.includes('i.discogs.com') || !block.includes('Add To Cart')) return;

    var listing = parseBlock(block);
    if (listing) listings.push(listing);
  });

  return listings;
}

// ─── Parse one listing block into a payload object ─────────────────────────
function parseBlock(block) {
  // Release Discogs ID — encoded in the S3 image URL path segments
  var releaseDiscogsId = extractReleaseId(block);

  // Listing ID — from the Add To Cart tracking URL via 1 HTTP redirect
  var listingId = extractListingId(block);

  if (!releaseDiscogsId || !listingId) {
    Logger.log('Skipping block — missing releaseId or listingId');
    return null;
  }

  // Seller username (Discogs seller page URL ends with /seller/USERNAME/profile)
  var sellerMatch = block.match(/\/seller\/([^/]+)\/profile/);
  var sellerName = sellerMatch ? sellerMatch[1] : extractTextAfterLabel(block, 'Seller:');

  // Seller rating, e.g. "99.81% (380713)"
  var ratingMatch = block.match(/Seller Rating:\s*([\d.]+%)/);
  var sellerRating = ratingMatch ? ratingMatch[1] : null;

  // Media condition
  var condition = extractTextAfterLabel(block, 'Media:');

  // Sleeve condition
  var sleeveCondition = extractTextAfterLabel(block, 'Sleeve:');

  // Ships from
  var location = extractTextAfterLabel(block, 'Ships from:');

  // Price and currency
  var priceData = extractPrice(block);

  return {
    listingId:       listingId,
    releaseDiscogsId: parseInt(releaseDiscogsId, 10),
    sellerDiscogsId:  sellerName || '',
    sellerName:       sellerName || '',
    sellerRating:     sellerRating,
    condition:        condition,
    sleeveCondition:  sleeveCondition,
    price:            priceData ? priceData.cents : null,
    currency:         priceData ? priceData.currency : null,
    shippingPrice:    null,
    location:         location,
    comments:         null,
  };
}

// ─── Extract release Discogs ID from cover image URL ──────────────────────
// Discogs image URLs embed the S3 object path as base64url segments after /w:NNN/
// e.g. .../w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNl.../  decodes to
//      s3://discogs-database-images/R-491235-1188427578.jpeg
function extractReleaseId(block) {
  var imgMatch = block.match(/src="(https:\/\/i\.discogs\.com\/[^"]+\.jpeg)"/);
  if (!imgMatch) return null;

  var imgUrl = imgMatch[1];

  // Everything after /w:NNN/ up to the final .jpeg is the encoded S3 path
  var pathMatch = imgUrl.match(/\/w:\d+\/(.+?)\.jpeg$/);
  if (!pathMatch) return null;

  // Remove URL path separators (/) then decode as standard base64
  var encoded = pathMatch[1].replace(/\//g, '').replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4 !== 0) encoded += '=';

  try {
    var bytes = Utilities.base64Decode(encoded, Utilities.Charset.UTF_8);
    var decoded = Utilities.newBlob(bytes).getDataAsString('UTF-8');
    var idMatch = decoded.match(/R-(\d+)-/);
    return idMatch ? idMatch[1] : null;
  } catch (e) {
    Logger.log('extractReleaseId error: ' + e.message);
    return null;
  }
}

// ─── Extract listing ID via ct.discogs.com redirect ───────────────────────
// ct.discogs.com URLs 302-redirect to e4.knock.app/t/JWT
// The JWT payload has a "url" field: https://www.discogs.com/sell/cart/?add=LISTING_ID
function extractListingId(block) {
  var cartMatch = block.match(/<a href="(https:\/\/ct\.discogs\.com\/c\/[^"]+)"[^>]*>\s*<strong>Add To Cart<\/strong>/i);
  if (!cartMatch) return null;

  // &amp; → & inside the href attribute
  var trackingUrl = cartMatch[1].replace(/&amp;/g, '&');

  try {
    var response = UrlFetchApp.fetch(trackingUrl, {
      followRedirects: false,
      muteHttpExceptions: true,
    });

    var location = response.getHeaders()['Location'] || response.getHeaders()['location'] || '';

    // knock.app URL contains a JWT with the final destination
    if (location.includes('knock.app/t/')) {
      return listingIdFromKnockJwt(location.split('/t/').pop());
    }

    // Occasionally the redirect goes straight to discogs.com
    var addMatch = location.match(/[?&]add=(\d+)/);
    return addMatch ? addMatch[1] : null;

  } catch (e) {
    Logger.log('extractListingId fetch error: ' + e.message);
    return null;
  }
}

function listingIdFromKnockJwt(jwt) {
  var parts = (jwt || '').split('.');
  if (parts.length < 2) return null;

  var payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  while (payload.length % 4 !== 0) payload += '=';

  try {
    var bytes = Utilities.base64Decode(payload, Utilities.Charset.UTF_8);
    var data  = JSON.parse(Utilities.newBlob(bytes).getDataAsString('UTF-8'));
    var url   = data.url || '';
    var match = url.match(/[?&]add=(\d+)/);
    return match ? match[1] : null;
  } catch (e) {
    Logger.log('listingIdFromKnockJwt error: ' + e.message);
    return null;
  }
}

// ─── Price extraction ──────────────────────────────────────────────────────
function extractPrice(block) {
  // Matches: €67.49 EUR   $49.99 USD   £30.00 GBP  etc.
  var match = block.match(/(?:€|£|\$|¥)([\d,]+\.?\d*)\s*(EUR|USD|GBP|JPY|AUD|CAD)/);
  if (!match) return null;
  var cents = Math.round(parseFloat(match[1].replace(/,/g, '')) * 100);
  return { cents: cents, currency: match[2] };
}

// ─── Generic label→value extractor for plain-text-like fields in HTML ─────
function extractTextAfterLabel(block, label) {
  var escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var re = new RegExp(escaped + '\\s*([^\\n<]{1,80})');
  var m = block.match(re);
  if (!m) return null;
  return stripHtml(m[1]).trim() || null;
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}

// ─── POST one listing to the backend ──────────────────────────────────────
function ingest(listing) {
  try {
    var response = UrlFetchApp.fetch(BACKEND_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + INGEST_SECRET },
      payload: JSON.stringify(listing),
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    if (code === 200) {
      Logger.log('✓ listing ' + listing.listingId + ' (release ' + listing.releaseDiscogsId + ')');
    } else if (code === 404) {
      Logger.log('– release ' + listing.releaseDiscogsId + ' not in wantlist, skipping');
    } else {
      Logger.log('✗ listing ' + listing.listingId + ' → HTTP ' + code + ': ' + response.getContentText());
    }
  } catch (e) {
    Logger.log('ingest error for listing ' + listing.listingId + ': ' + e.message);
  }
}
