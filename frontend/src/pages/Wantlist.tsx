import { useEffect, useState } from "react"
import { fetchWantlist, toggleSubscribe } from "../lib/api"
import type { WantlistItem } from "../types"
import "./Wantlist.css"

function timeAgo(s: string | null): string {
  if (!s) return "—"
  const ms = Date.now() - new Date(s).getTime()
  const days = Math.floor(ms / 86400000)
  if (days < 1) return "today"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function formatRelease(item: WantlistItem) {
  return item.release.formats?.map((f) => f.name).join(", ") ?? "—"
}

export function Wantlist() {
  const [items, setItems] = useState<WantlistItem[] | null>(null)

  useEffect(() => {
    fetchWantlist().then(setItems)
  }, [])

  const handleSubscribe = async (item: WantlistItem) => {
    const next = !item.subscribed
    setItems((prev) => prev!.map((i) => (i.id === item.id ? { ...i, subscribed: next } : i)))
    await toggleSubscribe(item.id, next)
  }

  return (
    <>
      <h1>
        Wantlist
        {items && <span className="count">({items.length})</span>}
      </h1>
      {items === null && <p className="status">Loading…</p>}
      {items?.length === 0 && <p className="status">No 5-star wantlist items yet.</p>}
      {items && items.length > 0 && (
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
              {items.map((item) => (
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
                      onClick={() => handleSubscribe(item)}
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
