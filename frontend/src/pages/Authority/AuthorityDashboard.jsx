import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AuthorityDashboard.css';

export default function AuthorityDashboard(){
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBus, setNewBus] = useState({ name:'', busNumber:'', from:'', to:'', description:'' });
  const [scheduleForm, setScheduleForm] = useState({ busId:'', date:'', departureTime:'', arrivalTime:'', sourceStop:'', destStop:'', extraInfo:'' });

  async function loadBuses(){
    setLoading(true);
    try {
      const res = await api.get('/buses');
      setBuses(res.data.buses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> { loadBuses(); }, []);

  async function createBus(e){
    e.preventDefault();
    try {
      const res = await api.post('/buses', newBus);
      setNewBus({ name:'', busNumber:'', from:'', to:'', description:'' });
      alert('Bus created');
      loadBuses();
    } catch (err) {
      alert(err?.response?.data?.error || 'Create bus failed');
    }
  }

  async function addSchedule(e){
    e.preventDefault();
    try {
      if (!scheduleForm.busId) return alert('Select bus');
      const busId = scheduleForm.busId;
      const body = { ...scheduleForm };
      delete body.busId;
      await api.post(`/buses/${busId}/schedules`, body);
      alert('Schedule added');
      setScheduleForm({ busId:'', date:'', departureTime:'', arrivalTime:'', sourceStop:'', destStop:'', extraInfo:'' });
      loadBuses();
    } catch (err) {
      alert(err?.response?.data?.error || 'Add schedule failed');
    }
  }

  return (
    <div>
      <h2>Authority Dashboard</h2>
      <p className="small-muted">Add buses and schedules. Changes reflect to passengers.</p>

      <div className="card mt">
        <h3>Add Bus</h3>
        <form onSubmit={createBus} className="row" style={{ gap:12 }}>
          <input className="input" placeholder="Name" value={newBus.name} onChange={e=>setNewBus({...newBus,name:e.target.value})} />
          <input className="input" placeholder="Bus Number" value={newBus.busNumber} onChange={e=>setNewBus({...newBus,busNumber:e.target.value})} />
          <input className="input" placeholder="From" value={newBus.from} onChange={e=>setNewBus({...newBus,from:e.target.value})} />
          <input className="input" placeholder="To" value={newBus.to} onChange={e=>setNewBus({...newBus,to:e.target.value})} />
          <textarea className="input" placeholder="Description" value={newBus.description} onChange={e=>setNewBus({...newBus,description:e.target.value})} />
          <div><button className="btn">Create Bus</button></div>
        </form>
      </div>

      <div className="card mt">
        <h3>Add Schedule to Bus</h3>
        <form onSubmit={addSchedule} className="row" style={{ gap:12 }}>
          <select className="input" value={scheduleForm.busId} onChange={e=>setScheduleForm({...scheduleForm,busId:e.target.value})}>
            <option value="">Select Bus</option>
            {buses.map(b=> <option key={b.id} value={b.id}>{b.name} • {b.busNumber}</option>)}
          </select>
          <input className="input" type="date" value={scheduleForm.date} onChange={e=>setScheduleForm({...scheduleForm,date:e.target.value})} />
          <input className="input" type="time" value={scheduleForm.departureTime} onChange={e=>setScheduleForm({...scheduleForm,departureTime:e.target.value})} />
          <input className="input" type="time" value={scheduleForm.arrivalTime} onChange={e=>setScheduleForm({...scheduleForm,arrivalTime:e.target.value})} />
          <input className="input" placeholder="Source Stop" value={scheduleForm.sourceStop} onChange={e=>setScheduleForm({...scheduleForm,sourceStop:e.target.value})} />
          <input className="input" placeholder="Dest Stop" value={scheduleForm.destStop} onChange={e=>setScheduleForm({...scheduleForm,destStop:e.target.value})} />
          <input className="input" placeholder="Extra Info" value={scheduleForm.extraInfo} onChange={e=>setScheduleForm({...scheduleForm,extraInfo:e.target.value})} />
          <div><button className="btn">Add Schedule</button></div>
        </form>
      </div>

      <div className="card mt">
        <h3>Existing Buses</h3>
        {loading && <div className="small-muted">Loading...</div>}
        {!loading && buses.length === 0 && <div className="small-muted">No buses found</div>}
        <div style={{ display:'grid', gap:10 }}>
          {buses.map(b => (
            <div key={b.id} className="card row" style={{ justifyContent:'space-between' }}>
              <div>
                <div style={{ fontWeight:700 }}>{b.name} • {b.busNumber}</div>
                <div className="small-muted">{b.from} → {b.to}</div>
                <div className="small-muted">{b.description}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <a className="btn" href={`/buses/${b.id}`}>View</a>
                <a className="btn" style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.06)' }} href={`/timetable/${b.id}`}>Timetable</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}