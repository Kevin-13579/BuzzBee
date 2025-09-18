import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './BusDetailsPage.css';

export default function BusDetailsPage(){
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try {
      const res = await api.get(`/buses/${id}`);
      setBus(res.data.bus);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    load();
  }, [id]);

  return (
    <div>
      {loading && <div className="card small-muted">Loading...</div>}
      {!bus && !loading && <div className="card small-muted">Bus not found</div>}

      {bus && (
        <>
          <div className="card">
            <div className="row" style={{ justifyContent:'space-between' }}>
              <div>
                <h2 style={{ margin:0 }}>{bus.name}</h2>
                <div className="small-muted">{bus.busNumber} • {bus.from} → {bus.to}</div>
              </div>
              <div>
                <Link to={`/timetable/${bus.id}`} className="btn">View Timetable</Link>
              </div>
            </div>

            <p className="mt small-muted">{bus.description || 'No details provided.'}</p>
          </div>

          <div className="card mt">
            <h3>Available schedules</h3>
            {(!bus.schedules || bus.schedules.length === 0) ? (
              <div className="small-muted">No schedules published yet for this bus.</div>
            ) : (
              <div style={{ display:'grid', gap:10 }}>
                {bus.schedules.map(s => (
                  <div key={s.id} className="card" style={{ padding:12 }}>
                    <div className="row" style={{ justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{s.departureTime} → {s.arrivalTime}</div>
                        <div className="small-muted">{s.date ? `Date: ${s.date}` : 'Recurring'}</div>
                        <div className="small-muted">{s.sourceStop || ''} → {s.destStop || ''}</div>
                      </div>
                      <div className="small-muted">{s.extraInfo}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
