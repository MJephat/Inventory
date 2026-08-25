import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import InventoryPage from './components/InventoryPage.jsx'
import AlertsPage from './components/AlertsPage.jsx'
import ItemModal from './components/ItemModal.jsx'
import AuthPage from './components/AuthPage.jsx'
import { getSession, loadStock, saveStock, signOut } from './auth.js'
import {
  CATEGORIES,
  INITIAL_ITEMS,
  stockStatus,
  todayIso,
} from './data/inventory.js'

export default function App() {
  const [session, setSession] = useState(() => getSession())
  const [view, setView] = useState('dashboard')
  const [items, setItems] = useState(() => {
    const current = getSession()
    return (current && loadStock(current.email)) || INITIAL_ITEMS
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    if (session) saveStock(session.email, items)
  }, [session, items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [items, query, category])

  const alerts = useMemo(
    () => items.filter((item) => stockStatus(item) !== 'ok'),
    [items],
  )

  function handleAuth(nextSession) {
    setSession(nextSession)
    setItems(loadStock(nextSession.email) || INITIAL_ITEMS)
    setView('dashboard')
  }

  function handleSignOut() {
    signOut()
    setSession(null)
    setModal(null)
    setQuery('')
    setCategory('all')
  }

  function upsertItem(next) {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === next.id)
      if (exists) {
        return prev.map((item) => (item.id === next.id ? next : item))
      }
      return [next, ...prev]
    })
    setModal(null)
  }

  function adjustQty(id, delta) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(0, item.qty + delta),
              updated: todayIso(),
            }
          : item,
      ),
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setModal(null)
  }

  if (!session) {
    return <AuthPage onAuth={handleAuth} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        onChange={setView}
        alertCount={alerts.length}
        user={session}
        onSignOut={handleSignOut}
      />
      <div className="app-main">
        <Header
          view={view}
          query={query}
          onQuery={setQuery}
          onAdd={() => setModal({ mode: 'create' })}
        />
        <main className="content">
          {view === 'dashboard' && (
            <Dashboard
              items={items}
              alerts={alerts}
              onOpenAlerts={() => setView('alerts')}
              onOpenInventory={() => setView('inventory')}
            />
          )}
          {view === 'inventory' && (
            <InventoryPage
              items={filtered}
              category={category}
              categories={CATEGORIES}
              onCategory={setCategory}
              onEdit={(item) => setModal({ mode: 'edit', item })}
              onAdjust={adjustQty}
            />
          )}
          {view === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onEdit={(item) => setModal({ mode: 'edit', item })}
              onAdjust={adjustQty}
            />
          )}
        </main>
      </div>
      {modal && (
        <ItemModal
          mode={modal.mode}
          item={modal.item}
          categories={CATEGORIES}
          existingIds={items.map((item) => item.id)}
          onClose={() => setModal(null)}
          onSave={upsertItem}
          onDelete={removeItem}
        />
      )}
    </div>
  )
}
