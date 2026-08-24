const TITLES = {
  dashboard: { kicker: 'Control tower', title: 'Inventory overview' },
  inventory: { kicker: 'Catalog', title: 'On-hand stock' },
  alerts: { kicker: 'Exceptions', title: 'Reorder queue' },
}

export default function Header({ view, query, onQuery, onAdd }) {
  const copy = TITLES[view]
  return (
    <header className="topbar">
      <div>
        <p className="kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
      </div>
      <div className="topbar-actions">
        {view !== 'dashboard' && (
          <label className="search">
            <span className="sr-only">Search stock</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Search SKU, name, or bin"
            />
          </label>
        )}
        <button className="btn primary" type="button" onClick={onAdd}>
          Add item
        </button>
      </div>
    </header>
  )
}
