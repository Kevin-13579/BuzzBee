import React from 'react';
import { Link } from 'react-router-dom';
import './BusCard.css';

export default function BusCard({ bus }) {
  return (
    <div className="bus-card card">
      <div className="bus-top row">
        <div className="bus-meta">
          <div className="bus-name">{bus.name}</div>
          <div className="small-muted">{bus.busNumber}</div>
        </div>
        <div className="bus-route small-muted">
          {bus.from} → {bus.to}
        </div>
      </div>

      <p className="small-muted">{bus.description || 'No description'}</p>

      <div className="bus-actions row mt">
        <Link to={`/buses/${bus.id}`} className="btn">View Details</Link>
        <Link to={`/timetable/${bus.id}`} className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>View Timetable</Link>
      </div>
    </div>
  );
}
