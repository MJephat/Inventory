import { formatMoney, stockStatus } from '../data/inventory.js'

export default function InventoryPage({
  items,
  category,
  categories,
  onCategory,
  onEdit,
  onAdjust,
}) {
  return (
    <div className="stack">
      <div className="filters">
        <button
          type="button"
          className={category === 'all' ? 'pill is-on' : 'pill'}
          onClick={() => onCategory('all')}
        >
          All
        </button>
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={category === name ? 'pill is-on' : 'pill'}
            onClick={() => onCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th>Aisle</th>
              <th>On hand</th>
              <th>Value</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-cell">
                  No items match this filter.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const status = stockStatus(item)
              return (
                <tr key={item.id}>
                  <td className="mono">{item.id}</td>
                  <td>
                    <strong>{item.name}</strong>
                    <span className="muted">{item.category}</span>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <div className="qty">
                      <button type="button" onClick={() => onAdjust(item.id, -1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => onAdjust(item.id, 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatMoney(item.qty * item.unitCost)}</td>
                  <td>
                    <em className={`chip ${status}`}>{label(status)}</em>
                  </td>
                  <td>
                    <button className="text-btn" type="button" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function label(status) {
  if (status === 'out') return 'Out of stock'
  if (status === 'low') return 'Reorder'
  return 'In stock'
}
