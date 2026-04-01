// Collection table — presentational only; Home owns fetching and filter state.
// Renders release info, format/year/added, and a star rating per row.
import { timeAgo, filterCollection } from "../lib/search"
import type { CollectionItem } from "../types"
import "./Collection.css"

interface CollectionProps {
  items: CollectionItem[] | null
  query: string
}

export function Collection({ items, query }: CollectionProps) {
  const displayed = items ? filterCollection(items, query) : null

  return (
    <>
      {items === null && <p className="status">Loading…</p>}
      {items?.length === 0 && <p className="status">No collection items yet.</p>}
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
                <th className="col-rating">Rating</th>
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
                  <td className="col-format">
                    {item.release.formats?.map((f) => f.name).join(", ") ?? "—"}
                  </td>
                  <td className="col-year">{item.release.year ?? "—"}</td>
                  <td className="col-added">{timeAgo(item.date_added)}</td>
                  <td className="col-rating">
                    {item.rating ? <span className="rating-stars">{"★".repeat(item.rating)}</span> : <span className="text-muted">—</span>}
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
