import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Public nav strip ─────────────────────────── */}
      <header className="login-nav">
        <div className="container">
          <div className="login-nav-inner">
            <div className="login-nav-logo">
              <svg className="login-nav-icon" viewBox="0 0 100 100" fill="currentColor">
                <rect x="20" y="10" width="60" height="80" rx="3" />
                <rect x="30" y="25" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="45" y="25" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="60" y="25" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="30" y="40" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="45" y="40" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="60" y="40" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="30" y="55" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="45" y="55" width="10" height="10" fill="white" opacity="0.9" />
                <rect x="60" y="55" width="10" height="10" fill="white" opacity="0.9" />
              </svg>
              <span className="login-nav-brand">Permit<span>Flow</span></span>
            </div>
            <nav className="login-nav-links">
              <button className="nav-text-link" onClick={() => navigate('/about')}>About</button>
              <button className="nav-text-link" onClick={() => navigate('/pricing')}>Pricing</button>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────── */}
      <main className="login-main">
        <div className="login-split">
          {/* Left panel — branding */}
          <div className="login-brand-panel">
            <div className="login-brand-content">
              <div className="login-brand-logo">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <rect x="20" y="10" width="60" height="80" rx="3" />
                  <rect x="30" y="25" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="45" y="25" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="60" y="25" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="30" y="40" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="45" y="40" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="60" y="40" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="30" y="55" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="45" y="55" width="10" height="10" fill="white" opacity="0.85" />
                  <rect x="60" y="55" width="10" height="10" fill="white" opacity="0.85" />
                </svg>
              </div>
              <h1 className="login-brand-name">PermitFlow</h1>
              <p className="login-brand-tagline">
                Ontario permit compliance analysis for architecture, engineering, and development teams.
              </p>

              <div className="login-brand-stats">
                <div className="login-stat">
                  <div className="login-stat-number">GTA</div>
                  <div className="login-stat-label">Municipal coverage</div>
                </div>
                <div className="login-stat-divider" />
                <div className="login-stat">
                  <div className="login-stat-number">OBC</div>
                  <div className="login-stat-label">Code compliance</div>
                </div>
                <div className="login-stat-divider" />
                <div className="login-stat">
                  <div className="login-stat-number">AI</div>
                  <div className="login-stat-label">Powered analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="login-form-panel">
            <div className="login-form-container">
              <div className="login-form-header">
                <h2>Welcome back</h2>
                <p className="text-muted">Sign in to your PermitFlow account</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {error && (
                  <div className="error-banner">
                    <span className="error-icon">!</span>
                    {error}
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="email" className="input-label">Work email</label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="you@firm.ca"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password" className="input-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg login-submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="login-divider">
                <span>or</span>
              </div>

              <button
                className="btn btn-outline btn-lg login-trial-btn"
                onClick={() => navigate('/pricing')}
              >
                Start a free trial
              </button>

              <p className="login-demo-note">
                Demo: enter any email and password to access the platform
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
