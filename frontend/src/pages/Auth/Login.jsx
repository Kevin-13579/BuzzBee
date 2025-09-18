import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('sb_token', res.data.token);
      localStorage.setItem('sb_user', JSON.stringify(res.data.user));
      setLoading(false);
      nav('/home');
    } catch (error) {
      setLoading(false);
      setErr(error?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="login-logo-wrap">
        <img src="/logo.jpg" alt="App Logo" className="login-logo" />
      </div>

      {/* App name + quote */}
      <h1 className="login-appname">Buzz Bee</h1>
      <p className="login-quote">Seamless travel experience at your fingertips</p>

      {/* Two-column info text */}
      <div className="login-info-row">
        <div className="login-info-box">
          <h3>Journey</h3>
          <p>Plan your journey with us</p>
        </div>
        <div className="login-info-box">
          <h3>Real-Time Updates</h3>
          <p>Stay updated with bus timings and routes live.</p>
        </div>
      </div>

      {/* Login form */}
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            className="login-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            className="login-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {err && <div className="login-error">{err}</div>}

          <div className="login-actions">
            <button disabled={loading} className="login-btn">
              {loading ? 'Logging...' : 'Login'}
            </button>
            <Link to="/signup" className="login-link">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
