import { useEffect, useState } from "react"
import { fetchCollection } from "../lib/api"
import type { CollectionItem } from "../types"
import "./Collection.css"

export function Collection() {
  const [items, setItems] = useState<CollectionItem[]>([])

  useEffect(() => {
    fetchCollection().then(setItems)
  }, [])

  return (
    <>
      <h1>Collection</h1>
      <table className="collection-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Artist</th>
            <th>Title</th>
            <th>Year</th>
            <th>Rating</th>
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
              <td>{item.rating ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
