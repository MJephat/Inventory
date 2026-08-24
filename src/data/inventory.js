export const CATEGORIES = [
  'Electronics',
  'Office',
  'Warehouse',
  'Safety',
  'Packaging',
]

export const INITIAL_ITEMS = [
  {
    id: 'SKU-1042',
    name: 'Wireless barcode scanner',
    category: 'Electronics',
    location: 'Aisle A · Bin 12',
    qty: 18,
    reorderPoint: 10,
    unitCost: 89.0,
    updated: '2026-08-22',
  },
  {
    id: 'SKU-1188',
    name: 'Thermal shipping labels (4x6)',
    category: 'Packaging',
    location: 'Aisle C · Bin 04',
    qty: 6,
    reorderPoint: 24,
    unitCost: 32.5,
    updated: '2026-08-24',
  },
  {
    id: 'SKU-2210',
    name: 'Pallet jack — 5,500 lb',
    category: 'Warehouse',
    location: 'Yard · Dock 2',
    qty: 3,
    reorderPoint: 2,
    unitCost: 410.0,
    updated: '2026-08-18',
  },
  {
    id: 'SKU-3301',
    name: 'Nitrile gloves (box of 100)',
    category: 'Safety',
    location: 'Aisle B · Bin 08',
    qty: 42,
    reorderPoint: 20,
    unitCost: 11.75,
    updated: '2026-08-23',
  },
  {
    id: 'SKU-4419',
    name: 'A4 copy paper (ream)',
    category: 'Office',
    location: 'Aisle D · Bin 01',
    qty: 8,
    reorderPoint: 15,
    unitCost: 6.4,
    updated: '2026-08-21',
  },
  {
    id: 'SKU-5094',
    name: 'USB-C docking station',
    category: 'Electronics',
    location: 'Aisle A · Bin 03',
    qty: 11,
    reorderPoint: 8,
    unitCost: 124.0,
    updated: '2026-08-20',
  },
  {
    id: 'SKU-6127',
    name: 'Stretch wrap 18"',
    category: 'Packaging',
    location: 'Aisle C · Bin 11',
    qty: 2,
    reorderPoint: 12,
    unitCost: 18.9,
    updated: '2026-08-24',
  },
  {
    id: 'SKU-7780',
    name: 'High-vis safety vest',
    category: 'Safety',
    location: 'Aisle B · Bin 02',
    qty: 27,
    reorderPoint: 16,
    unitCost: 9.2,
    updated: '2026-08-19',
  },
  {
    id: 'SKU-8903',
    name: 'Industrial tape gun',
    category: 'Warehouse',
    location: 'Aisle C · Bin 07',
    qty: 14,
    reorderPoint: 10,
    unitCost: 15.0,
    updated: '2026-08-17',
  },
  {
    id: 'SKU-9015',
    name: 'Ergonomic desk chair',
    category: 'Office',
    location: 'Aisle D · Bin 09',
    qty: 4,
    reorderPoint: 5,
    unitCost: 189.0,
    updated: '2026-08-16',
  },
]

export function stockStatus(item) {
  if (item.qty <= 0) return 'out'
  if (item.qty <= item.reorderPoint) return 'low'
  return 'ok'
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
