import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './OtpVerify.css';

export default function OtpVerify(){
  const { state } = useLocation();
  const nav = useNavigate();
  const [email, setEmail] = useState(state?.email || '');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleVerify(e){
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setMsg('Verified! You can now login.');
      setTimeout(()=> nav('/login'), 900);
    } catch (error) {
      setErr(error?.response?.data?.error || 'Verification failed');
    }
  }

  async function handleResend(){
    setErr(''); setMsg('');
    try {
      await api.post('/auth/resend-otp', { email });
      setMsg('OTP resent to email.');
    } catch (error) {
      setErr(error?.response?.data?.error || 'Resend failed');
    }
  }

  return (
    <div className="card" style={{ maxWidth:520, margin:'20px auto' }}>
      <h2>Verify Email</h2>
      <p className="small-muted">Enter the 6-digit code sent to your email.</p>
      <form onSubmit={handleVerify} className="mt">
        <label>Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="mt">OTP</label>
        <input className="input" value={otp} onChange={e=>setOtp(e.target.value)} />

        {err && <div className="small-muted" style={{ color:'#ffb4b4', marginTop:8 }}>{err}</div>}
        {msg && <div className="small-muted" style={{ color:'#bff0d6', marginTop:8 }}>{msg}</div>}

        <div className="row mt" style={{ justifyContent:'space-between' }}>
          <button className="btn">Verify</button>
          <button type="button" onClick={handleResend} className="btn" style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.06)' }}>Resend OTP</button>
        </div>
      </form>
    </div>
  );
}
