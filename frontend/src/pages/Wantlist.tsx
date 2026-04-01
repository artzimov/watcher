// Wantlist table — presentational only; Home owns fetching, filter state, and the subscribe handler.
// Renders release info, format/year/added, and a Watch/Watching toggle per row.
import { timeAgo, filterWantlist } from "../lib/search"
import type { WantlistItem } from "../types"
import "./Wantlist.css"

function formatRelease(item: WantlistItem) {
  return item.release.formats?.map((f) => f.name).join(", ") ?? "—"
}

interface WantlistProps {
  items: WantlistItem[] | null
  query: string
  onSubscribeToggle: (item: WantlistItem) => void
}

export function Wantlist({ items, query, onSubscribeToggle }: WantlistProps) {
  const displayed = items ? filterWantlist(items, query) : null

  return (
    <>
      {items === null && <p className="status">Loading…</p>}
      {items?.length === 0 && <p className="status">No 5-star wantlist items yet.</p>}
      {displayed && displayed.length === 0 && query && <p className="status">No matches.</p>}
      {displayed && displayed.length > 0 && (
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                <th className="col-cover"></th>
                <th className="col-release">Release</th>
                <th className="col-format">Format</th>
                <th className="col-year">Year</th>
                <th className="col-added">Added</th>
                <th className="col-action"></th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((item) => (
                <tr key={item.id}>
                  <td className="col-cover">
                    {item.release.thumb
                      ? <img src={item.release.thumb} alt={item.release.title} />
                      : <div className="thumb-placeholder" />}
                  </td>
                  <td className="col-release">
                    <div className="release-title">{item.release.title}</div>
                    {item.release.artists && (
                      <div className="release-artist">
                        {item.release.artists.map((a) => a.name).join(", ")}
                      </div>
                    )}
                    {item.release.labels && item.release.labels.length > 0 && (
                      <div className="release-label">
                        {item.release.labels.map((l) => l.name).join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="col-format">{formatRelease(item)}</td>
                  <td className="col-year">{item.release.year ?? "—"}</td>
                  <td className="col-added">{timeAgo(item.date_added)}</td>
                  <td className="col-action">
                    <button
                      className={`subscribe-toggle${item.subscribed ? " subscribed" : ""}`}
                      onClick={() => onSubscribeToggle(item)}
                    >
                      {item.subscribed ? "Watching" : "Watch"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
