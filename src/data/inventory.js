export const CATEGORIES = [
  'Produce',
  'Dairy',
  'Bakery',
  'Meat',
  'Frozen',
  'Pantry',
  'Beverages',
  'Snacks',
  'Household',
]

export const INITIAL_ITEMS = [
  {
    id: 'SKU-1001',
    name: 'Bananas (kg)',
    category: 'Produce',
    location: 'Aisle 1 · Produce wall',
    qty: 24,
    reorderPoint: 10,
    unitCost: 62,
    updated: '2026-08-24',
  },
  {
    id: 'SKU-1018',
    name: 'Roma tomatoes (pack)',
    category: 'Produce',
    location: 'Aisle 1 · Cold case',
    qty: 9,
    reorderPoint: 12,
    unitCost: 185,
    updated: '2026-08-25',
  },
  {
    id: 'SKU-2104',
    name: 'Whole milk 1L',
    category: 'Dairy',
    location: 'Aisle 2 · Fridge A',
    qty: 36,
    reorderPoint: 18,
    unitCost: 140,
    updated: '2026-08-25',
  },
  {
    id: 'SKU-2140',
    name: 'Large eggs (dozen)',
    category: 'Dairy',
    location: 'Aisle 2 · Fridge B',
    qty: 14,
    reorderPoint: 16,
    unitCost: 275,
    updated: '2026-08-23',
  },
  {
    id: 'SKU-3202',
    name: 'White sandwich bread',
    category: 'Bakery',
    location: 'Aisle 3 · Bakery rack',
    qty: 22,
    reorderPoint: 10,
    unitCost: 115,
    updated: '2026-08-25',
  },
  {
    id: 'SKU-4088',
    name: 'Chicken breast (pack)',
    category: 'Meat',
    location: 'Aisle 4 · Meat counter',
    qty: 7,
    reorderPoint: 8,
    unitCost: 640,
    updated: '2026-08-24',
  },
  {
    id: 'SKU-5115',
    name: 'Frozen peas 500g',
    category: 'Frozen',
    location: 'Aisle 5 · Freezer 2',
    qty: 18,
    reorderPoint: 8,
    unitCost: 190,
    updated: '2026-08-21',
  },
  {
    id: 'SKU-6027',
    name: 'Long-grain rice 5kg',
    category: 'Pantry',
    location: 'Aisle 6 · Shelf C',
    qty: 11,
    reorderPoint: 6,
    unitCost: 220,
    updated: '2026-08-20',
  },
  {
    id: 'SKU-6190',
    name: 'Canned tuna (3-pack)',
    category: 'Pantry',
    location: 'Aisle 6 · Shelf A',
    qty: 4,
    reorderPoint: 10,
    unitCost: 345,
    updated: '2026-08-22',
  },
  {
    id: 'SKU-7308',
    name: 'Still water 6-pack',
    category: 'Beverages',
    location: 'Aisle 7 · End cap',
    qty: 28,
    reorderPoint: 12,
    unitCost: 210,
    updated: '2026-08-25',
  },
  {
    id: 'SKU-8122',
    name: 'Salted potato chips',
    category: 'Snacks',
    location: 'Aisle 8 · Snack bay',
    qty: 31,
    reorderPoint: 14,
    unitCost: 100,
    updated: '2026-08-19',
  },
  {
    id: 'SKU-9044',
    name: 'Dish soap 750ml',
    category: 'Household',
    location: 'Aisle 9 · Cleaning',
    qty: 0,
    reorderPoint: 6,
    unitCost: 120,
    updated: '2026-08-18',
  },
]

export function stockStatus(item) {
  if (item.qty <= 0) return 'out'
  if (item.qty <= item.reorderPoint) return 'low'
  return 'ok'
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(value)
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
