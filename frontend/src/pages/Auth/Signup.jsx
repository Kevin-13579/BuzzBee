import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Signup.css';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      const res = await api.post('/auth/signup', form);
      setMsg('Signup OK. OTP sent — proceed to verify.');
      // redirect to OTP page with email
      nav('/verify-otp', { state: { email: form.email } });
    } catch (error) {
      setErr(error?.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="signup-container">
      {/* Logo */}
      <div className="signup-logo-wrap">
        <img src="/logo.jpg" alt="App Logo" className="signup-logo" />
      </div>

      {/* App name + quote */}
      <h1 className="signup-appname">Buzz Bee</h1>
      <p className="signup-quote">Join us for a smarter travel experience</p>

      {/* Two-column info */}
      <div className="signup-info-row">
        <div className="signup-info-box">
          <h3>Save Time</h3>
          <p>Register once, enjoy fast planning forever.</p>
        </div>
        <div className="signup-info-box">
          <h3>Secure Access</h3>
          <p>Your data and rides are safe with us.</p>
        </div>
      </div>

      {/* Signup form */}
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <label>Name</label>
          <input
            className="signup-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Email</label>
          <input
            className="signup-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            className="signup-input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {err && <div className="signup-error">{err}</div>}
          {msg && <div className="signup-success">{msg}</div>}

          <div className="signup-actions">
            <button className="signup-btn">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

