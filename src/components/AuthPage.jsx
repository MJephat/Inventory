import { useState } from 'react'
import { signIn, signUp } from '../auth.js'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please add your name.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      const session =
        mode === 'signup'
          ? await signUp({ name, email, password })
          : await signIn({ email, password })
      onAuth(session)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <strong>Corner Mart</strong>
            <p>Mini supermarket inventory</p>
          </div>
        </div>
        <h1>Keep the aisles stocked.</h1>
        <p>
          Track produce, dairy, pantry, and household goods by aisle. Reorder before the
          fridge or shelves run empty.
        </p>
        <ul className="auth-points">
          <li>Live counts by aisle and category</li>
          <li>Low-stock alerts for fast movers</li>
          <li>Your store data stays in this browser</li>
        </ul>
      </section>

      <form className="auth-card" onSubmit={submit}>
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signin' ? 'pill is-on' : 'pill'}
            onClick={() => {
              setMode('signin')
              setError('')
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'pill is-on' : 'pill'}
            onClick={() => {
              setMode('signup')
              setError('')
            }}
          >
            Create account
          </button>
        </div>
        <h2>{mode === 'signup' ? 'Open a store account' : 'Welcome back'}</h2>
        <p className="lede">
          {mode === 'signup'
            ? 'Create a staff login to manage Corner Mart stock.'
            : 'Sign in to continue counting and restocking.'}
        </p>
        {mode === 'signup' && (
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn primary auth-submit" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
