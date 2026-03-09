import { useEffect, useState } from "react"
import { fetchWantlist } from "../lib/api"
import type { WantlistItem } from "../types"
import "./Wantlist.css"

export function Wantlist() {
  const [items, setItems] = useState<WantlistItem[] | null>(null)

  useEffect(() => {
    fetchWantlist().then(setItems)
  }, [])

  return (
    <>
      <h1>Wantlist</h1>
      {items === null && <p className="status">Loading…</p>}
      {items?.length === 0 && <p className="status">No 5-star wantlist items yet.</p>}
      {items && items.length > 0 && (
        <div className="table-scroll">
          <table className="wantlist-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Artist</th>
                <th>Title</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.release.thumb && <img src={item.release.thumb} alt={item.release.title} />}
                  </td>
                  <td className="artist">{item.release.artists?.map((a) => a.name).join(", ")}</td>
                  <td className="title">{item.release.title}</td>
                  <td>{item.release.year}</td>
                  <td><span className="rating-badge">★ {item.rating}</span></td>
                  <td>
                    <button className={`subscribe-toggle ${item.subscribed ? "subscribed" : ""}`}>
                      {item.subscribed ? "Subscribed" : "Subscribe"}
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
