// Home page — owns both Wantlist and Collection data plus which one is active.
// Both lists are fetched once on mount and kept in state; switching tabs never refetches,
// since Wantlist/Collection are just conditionally rendered here, not separate routes.
import { useEffect, useState } from "react"
import { fetchWantlist, fetchCollection, toggleSubscribe } from "../lib/api"
import { filterWantlist, filterCollection } from "../lib/search"
import { Wantlist } from "./Wantlist"
import { Collection } from "./Collection"
import type { WantlistItem, CollectionItem } from "../types"

type Tab = "wantlist" | "collection"

export function Home() {
  const [tab, setTab] = useState<Tab>("wantlist")
  const [wantlistItems, setWantlistItems] = useState<WantlistItem[] | null>(null)
  const [collectionItems, setCollectionItems] = useState<CollectionItem[] | null>(null)
  const [wantlistQuery, setWantlistQuery] = useState("")
  const [collectionQuery, setCollectionQuery] = useState("")

  useEffect(() => {
    fetchWantlist().then(setWantlistItems)
    fetchCollection().then(setCollectionItems)
  }, [])

  const handleSubscribe = async (item: WantlistItem) => {
    const next = !item.subscribed
    setWantlistItems((prev) => prev!.map((i) => (i.id === item.id ? { ...i, subscribed: next } : i)))
    await toggleSubscribe(item.id, next)
  }

  const query = tab === "wantlist" ? wantlistQuery : collectionQuery
  const setQuery = tab === "wantlist" ? setWantlistQuery : setCollectionQuery
  const displayedCount =
    tab === "wantlist"
      ? (wantlistItems ? filterWantlist(wantlistItems, wantlistQuery).length : null)
      : (collectionItems ? filterCollection(collectionItems, collectionQuery).length : null)

  return (
    <>
      <div className="page-header">
        <div className="tabs">
          <button
            className={`tab${tab === "wantlist" ? " active" : ""}`}
            onClick={() => setTab("wantlist")}
          >
            Wantlist{wantlistItems && ` (${wantlistItems.length})`}
          </button>
          <button
            className={`tab${tab === "collection" ? " active" : ""}`}
            onClick={() => setTab("collection")}
          >
            Collection{collectionItems && ` (${collectionItems.length})`}
          </button>
        </div>
        {displayedCount !== null && (
          <input
            className="table-filter"
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      </div>
      {tab === "wantlist" ? (
        <Wantlist items={wantlistItems} query={wantlistQuery} onSubscribeToggle={handleSubscribe} />
      ) : (
        <Collection items={collectionItems} query={collectionQuery} />
      )}
    </>
  )
}
