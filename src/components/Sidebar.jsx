const NAV = [
  { id: 'dashboard', label: 'Overview', icon: OverviewIcon },
  { id: 'inventory', label: 'Stock', icon: StockIcon },
  { id: 'alerts', label: 'Reorder', icon: AlertIcon },
]

export default function Sidebar({ view, onChange, alertCount, user, onSignOut }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <strong>Corner Mart</strong>
          <p>Mini supermarket</p>
        </div>
      </div>
      <nav className="nav">
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={view === item.id ? 'nav-btn is-active' : 'nav-btn'}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <Icon />
              <span>{item.label}</span>
              {item.id === 'alerts' && alertCount > 0 && (
                <em className="nav-badge">{alertCount}</em>
              )}
            </button>
          )
        })}
      </nav>
      <div className="sidebar-foot">
        <p className="sidebar-user">{user.name}</p>
        <p>{user.email}</p>
        <button className="text-btn sign-out" type="button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </aside>
  )
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function StockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 20V12M4 8.5 12 12l8-3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
      <path
        d="M10.2 4.8 3.4 17.1c-.7 1.2.2 2.7 1.6 2.7h14c1.4 0 2.3-1.5 1.6-2.7L13.8 4.8c-.7-1.2-2.5-1.2-3.2 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}
