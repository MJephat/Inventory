import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Boxes, Check, PackageCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/userService";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ full_name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegistering = mode === "register";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const username = form.username.trim();

    if (!username || !form.password) {
      setError("Enter your username and password to continue.");
      return;
    }
    if (isRegistering) {
      if (!form.full_name.trim() || !form.email.trim()) {
        setError("Complete all fields to create your account.");
        return;
      }
      if (form.password.length < 8) {
        setError("Use a password with at least 8 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("The passwords don't match.");
        return;
      }
    }

    try {
      setLoading(true);
      if (isRegistering) {
        await UserService.createUser({
          username,
          email: form.email.trim(),
          full_name: form.full_name.trim(),
          password: form.password,
          role: "USER",
        });
      }
      await login({ username, password: form.password });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        (isRegistering
          ? "We couldn't create your account. Please try again."
          : "We couldn't sign you in. Check your details and try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-label="Inventory workspace">
        <div className="auth-showcase-top">
          <div className="auth-brand-mark"><Boxes size={20} strokeWidth={2.2} /></div>
          <span>STOCKROOM</span>
        </div>
        <div className="auth-showcase-copy">
          <p className="auth-kicker">INVENTORY, IN GOOD ORDER</p>
          <h1>Make every item<br />count.</h1>
          <p className="auth-description">Keep stock moving, teams aligned, and the details right where you need them.</p>
          <div className="auth-proof">
            <span className="auth-proof-icon"><PackageCheck size={18} /></span>
            <span><strong>One clear view</strong><small>From receiving to dispatch</small></span>
            <Check className="auth-proof-check" size={18} />
          </div>
        </div>
        <div className="auth-showcase-footer"><span>INVENTORY CONTROL</span><span>01 / 03</span></div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark"><Boxes size={19} /></span>
            <span>STOCKROOM</span>
          </div>
          <p className="auth-eyebrow">{isRegistering ? "GET STARTED" : "WELCOME BACK"}</p>
          <h2>{isRegistering ? "Create your account" : "Sign in to Stockroom"}</h2>
          <p className="auth-subtitle">
            {isRegistering ? "A better handle on your inventory starts here." : "Your inventory workspace is ready when you are."}
          </p>

          <div className="auth-mode-switch" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={!isRegistering} className={!isRegistering ? "active" : ""} onClick={() => changeMode("login")}>Sign in</button>
            <button type="button" role="tab" aria-selected={isRegistering} className={isRegistering ? "active" : ""} onClick={() => changeMode("register")}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <label className="auth-field">
                <span>Full name</span>
                <input name="full_name" type="text" value={form.full_name} onChange={updateField} placeholder="e.g. Jordan Lee" autoComplete="name" required />
              </label>
            )}
            <label className="auth-field">
              <span>Username</span>
              <input name="username" type="text" value={form.username} onChange={updateField} placeholder="Enter your username" autoComplete="username" minLength={isRegistering ? 3 : undefined} required />
            </label>
            {isRegistering && (
              <label className="auth-field">
                <span>Email address</span>
                <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@company.com" autoComplete="email" required />
              </label>
            )}
            <label className="auth-field">
              <span>Password</span>
              <input name="password" type="password" value={form.password} onChange={updateField} placeholder={isRegistering ? "At least 8 characters" : "Enter your password"} autoComplete={isRegistering ? "new-password" : "current-password"} minLength={isRegistering ? 8 : undefined} required />
            </label>
            {isRegistering && (
              <label className="auth-field">
                <span>Confirm password</span>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} placeholder="Enter your password again" autoComplete="new-password" required />
              </label>
            )}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? (isRegistering ? "Creating account..." : "Signing in...") : (isRegistering ? "Create account" : "Sign in")}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch-prompt">
            {isRegistering ? "Already have an account?" : "New to Stockroom?"}{" "}
            <button type="button" onClick={() => changeMode(isRegistering ? "login" : "register")}>
              {isRegistering ? "Sign in" : "Create an account"}
            </button>
          </p>
          <p className="auth-legal">By continuing, you agree to your organization’s terms of use.</p>
        </div>
      </section>
    </main>
  );
}