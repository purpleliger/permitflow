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
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <rect x="20" y="10" width="60" height="80" rx="2" />
                <rect x="30" y="25" width="10" height="10" fill="white" />
                <rect x="45" y="25" width="10" height="10" fill="white" />
                <rect x="60" y="25" width="10" height="10" fill="white" />
                <rect x="30" y="40" width="10" height="10" fill="white" />
                <rect x="45" y="40" width="10" height="10" fill="white" />
                <rect x="60" y="40" width="10" height="10" fill="white" />
                <rect x="30" y="55" width="10" height="10" fill="white" />
                <rect x="45" y="55" width="10" height="10" fill="white" />
                <rect x="60" y="55" width="10" height="10" fill="white" />
              </svg>
            </div>
          </div>
          <h1>PermitFlow</h1>
          <p className="text-muted">Speed up your permitting process</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-muted">
            Demo credentials: any email and password will work
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
