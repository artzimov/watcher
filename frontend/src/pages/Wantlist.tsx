import { useEffect, useState } from "react"
import { fetchWantlist } from "../lib/api"
import type { WantlistItem } from "../types"

export function Wantlist() {
  const [items, setItems] = useState<WantlistItem[]>([])

  useEffect(() => {
    fetchWantlist().then(setItems)
  }, [])

  return (
    <>
      <h1>Wantlist</h1>
      <table>
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
              <td>{item.release.artists?.map((a) => a.name).join(", ")}</td>
              <td>{item.release.title}</td>
              <td>{item.release.year}</td>
              <td>{item.rating}</td>
              <td>{item.subscribed ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
