import { formatMoney, stockStatus } from '../data/inventory.js'

export default function Dashboard({ items, alerts, onOpenAlerts, onOpenInventory }) {
  const units = items.reduce((sum, item) => sum + item.qty, 0)
  const value = items.reduce((sum, item) => sum + item.qty * item.unitCost, 0)
  const healthy = items.filter((item) => stockStatus(item) === 'ok').length

  return (
    <div className="stack">
      <section className="stat-grid">
        <Stat label="SKUs tracked" value={items.length} hint="Live catalog" />
        <Stat label="Units on hand" value={units} hint="All locations" />
        <Stat label="Inventory value" value={formatMoney(value)} hint="At unit cost" />
        <Stat
          label="Need reorder"
          value={alerts.length}
          hint={`${healthy} SKUs healthy`}
          tone={alerts.length ? 'warn' : 'ok'}
        />
      </section>

      <section className="split">
        <article className="panel">
          <div className="panel-head">
            <h2>Low stock</h2>
            <button className="text-btn" type="button" onClick={onOpenAlerts}>
              View queue
            </button>
          </div>
          {alerts.length === 0 ? (
            <p className="empty">All SKUs are above their reorder points.</p>
          ) : (
            <ul className="alert-list">
              {alerts.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.id} · {item.location}
                    </span>
                  </div>
                  <em className={`chip ${stockStatus(item)}`}>
                    {item.qty} / {item.reorderPoint}
                  </em>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Category mix</h2>
            <button className="text-btn" type="button" onClick={onOpenInventory}>
              Open stock
            </button>
          </div>
          <ul className="mix">
            {rollUp(items).map((row) => (
              <li key={row.category}>
                <div className="mix-row">
                  <span>{row.category}</span>
                  <strong>{row.count}</strong>
                </div>
                <div className="bar">
                  <span style={{ width: `${row.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

function Stat({ label, value, hint, tone }) {
  return (
    <article className={`stat ${tone ?? ''}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{hint}</span>
    </article>
  )
}

function rollUp(items) {
  const map = new Map()
  for (const item of items) {
    map.set(item.category, (map.get(item.category) ?? 0) + 1)
  }
  const max = Math.max(...map.values(), 1)
  return [...map.entries()]
    .map(([category, count]) => ({
      category,
      count,
      pct: Math.round((count / max) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}
