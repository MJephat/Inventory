import { useState } from 'react'
import { todayIso } from '../data/inventory.js'

const empty = {
  id: '',
  name: '',
  category: 'Electronics',
  location: '',
  qty: 0,
  reorderPoint: 5,
  unitCost: 0,
}

export default function ItemModal({
  mode,
  item,
  categories,
  existingIds,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(item ?? { ...empty, id: nextSku(existingIds) })
  const [error, setError] = useState('')

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!form.id.trim() || !form.name.trim() || !form.location.trim()) {
      setError('SKU, name, and location are required.')
      return
    }
    if (mode === 'create' && existingIds.includes(form.id.trim())) {
      setError('That SKU already exists.')
      return
    }
    onSave({
      ...form,
      id: form.id.trim(),
      name: form.name.trim(),
      location: form.location.trim(),
      qty: Number(form.qty) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      unitCost: Number(form.unitCost) || 0,
      updated: todayIso(),
    })
  }

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <form className="modal" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{mode === 'create' ? 'New stock item' : 'Edit item'}</h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="form-grid">
          <Field label="SKU">
            <input
              value={form.id}
              onChange={(event) => setField('id', event.target.value)}
              disabled={mode === 'edit'}
            />
          </Field>
          <Field label="Name">
            <input value={form.name} onChange={(event) => setField('name', event.target.value)} />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(event) => setField('category', event.target.value)}>
              {categories.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={(event) => setField('location', event.target.value)} />
          </Field>
          <Field label="Quantity">
            <input
              type="number"
              min="0"
              value={form.qty}
              onChange={(event) => setField('qty', event.target.value)}
            />
          </Field>
          <Field label="Reorder point">
            <input
              type="number"
              min="0"
              value={form.reorderPoint}
              onChange={(event) => setField('reorderPoint', event.target.value)}
            />
          </Field>
          <Field label="Unit cost (USD)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.unitCost}
              onChange={(event) => setField('unitCost', event.target.value)}
            />
          </Field>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          {mode === 'edit' && (
            <button className="btn danger" type="button" onClick={() => onDelete(form.id)}>
              Delete
            </button>
          )}
          <span className="spacer" />
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function nextSku(ids) {
  const nums = ids
    .map((id) => Number(String(id).replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n))
  const next = (Math.max(0, ...nums) + 1).toString().padStart(4, '0')
  return `SKU-${next}`
}
