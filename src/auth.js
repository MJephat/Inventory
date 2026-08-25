const USERS_KEY = 'cornermart.users'
const SESSION_KEY = 'cornermart.session'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function getSession() {
  return readJson(SESSION_KEY, null)
}

export function stockKey(email) {
  return `cornermart.stock.${email.toLowerCase()}`
}

export function loadStock(email) {
  return readJson(stockKey(email), null)
}

export function saveStock(email, items) {
  localStorage.setItem(stockKey(email), JSON.stringify(items))
}

export async function signUp({ name, email, password }) {
  const users = readJson(USERS_KEY, [])
  const normalized = email.trim().toLowerCase()
  if (users.some((user) => user.email === normalized)) {
    throw new Error('An account with that email already exists.')
  }
  const user = {
    name: name.trim(),
    email: normalized,
    passwordHash: await hashPassword(password),
  }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  const session = { name: user.name, email: user.email }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function signIn({ email, password }) {
  const users = readJson(USERS_KEY, [])
  const normalized = email.trim().toLowerCase()
  const user = users.find((entry) => entry.email === normalized)
  if (!user || user.passwordHash !== (await hashPassword(password))) {
    throw new Error('Email or password is incorrect.')
  }
  const session = { name: user.name, email: user.email }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}
