import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import BusCard from '../../components/BusCard';
import './HomePage.css';

export default function HomePage(){
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ from:'', to:'', date:'' });

  async function search(e){
    e && e.preventDefault();
    setLoading(true);
    try{
      const params = {};
      if (form.from) params.from = form.from;
      if (form.to) params.to = form.to;
      if (form.date) params.date = form.date;
      const res = await api.get('/buses', { params });
      setBuses(res.data.buses || []);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=> {
    search(); // initial load
  }, []);

  return (
    <div className="home-wrapper">
      <div className="card search-card">
        <h2>Find Buses</h2>
        <p className="small-muted">Search by route and date</p>
        <form className="search-form" onSubmit={search}>
          <input 
            placeholder="From" 
            className="input" 
            value={form.from} 
            onChange={e=>setForm({...form, from:e.target.value})} 
          />
          <input 
            placeholder="To" 
            className="input" 
            value={form.to} 
            onChange={e=>setForm({...form, to:e.target.value})} 
          />
          <input 
            type="date" 
            className="input" 
            value={form.date} 
            onChange={e=>setForm({...form, date:e.target.value})} 
          />
          <button className="btn">{loading ? 'Searching...' : 'Search'}</button>
        </form>
      </div>

      <div className="buses-container">
        {buses.length === 0 ? (
          <div className="card center" style={{ padding:40 }}>
            <div className="small-muted">No buses found. Try changing filters.</div>
          </div>
        ) : (
          <div className="grid">
            {buses.map(b => <BusCard key={b.id} bus={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
