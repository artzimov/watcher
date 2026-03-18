# Email Ingest — Google Apps Script Setup

## How it works
Discogs sends "Realtime Notification" emails when new marketplace listings match your Saved Searches. This script polls Gmail for those emails, parses each listing, and POSTs them to the backend's `/api/listings/ingest` endpoint.

## Steps

### 1. Create a Discogs Saved Search
For each wantlist item you want to monitor, go to its Discogs release page and create a Saved Search. Set notification type to **Realtime**. Discogs will email `sozhran@gmail.com` whenever a new listing appears.

### 2. Create the Apps Script project
1. Go to https://script.google.com → New project
2. Paste the contents of `Code.gs` into the editor
3. Fill in the two config variables at the top:
   - `BACKEND_URL` — your deployed backend URL (or `https://YOUR_NGROK.ngrok.io/api/listings/ingest` for local testing)
   - `INGEST_SECRET` — value of `INGEST_SECRET` from `backend/.env`

### 3. Add OAuth scopes
The script needs Gmail read + mark-read access. When you first run it, GAS will prompt you to authorize.

Required scopes (auto-detected by GAS):
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/script.external_request`

### 4. Set up the time-driven trigger
1. In the Apps Script editor, click **Triggers** (clock icon)
2. Add trigger: `processWantlistEmails` → **Time-driven** → **Minutes timer** → **Every 5 minutes**

### 5. Test manually
Run `processWantlistEmails` once from the editor to verify it finds and processes any unread notification emails already in Gmail.

## Duplicate handling
The backend uses `listing_id` (the Discogs listing ID) as a unique key and upserts on conflict, so running against the same email multiple times is safe. The script marks emails as read after processing to avoid reprocessing.

## Notes
- The script makes 1 HTTP request per listing to follow the Add To Cart tracking URL and extract the real Discogs listing ID.
- Listings for releases not in the wantlist DB return HTTP 404 from the backend (logged as "not in wantlist, skipping") — this is normal if the Saved Search matches releases you don't track.
- GAS free tier allows 6 min/day execution time and 20,000 URL fetch calls/day — easily enough for this use case.
