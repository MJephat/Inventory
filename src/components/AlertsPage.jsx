import { stockStatus } from '../data/inventory.js'

export default function AlertsPage({ alerts, onEdit, onAdjust }) {
  if (alerts.length === 0) {
    return (
      <div className="panel empty-panel">
        <h2>Nothing waiting</h2>
        <p>Every SKU is above its reorder point. Receive stock or drop a threshold to see this queue fill up.</p>
      </div>
    )
  }

  return (
    <div className="stack">
      <p className="lede">
        {alerts.length} SKU{alerts.length === 1 ? '' : 's'} are at or below reorder point.
      </p>
      <ul className="card-grid">
        {alerts.map((item) => {
          const status = stockStatus(item)
          return (
            <li key={item.id} className="card">
              <div className="card-top">
                <em className={`chip ${status}`}>{status === 'out' ? 'Out' : 'Low'}</em>
                <span className="mono">{item.id}</span>
              </div>
              <h3>{item.name}</h3>
              <p>
                {item.location} · reorder at {item.reorderPoint}
              </p>
              <div className="card-actions">
                <div className="qty">
                  <button type="button" onClick={() => onAdjust(item.id, -1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => onAdjust(item.id, 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <button className="text-btn" type="button" onClick={() => onEdit(item)}>
                  Edit item
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
