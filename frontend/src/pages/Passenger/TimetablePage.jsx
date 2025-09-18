import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './TimetablePage.css';

export default function TimetablePage() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
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

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div className="timetable-wrapper">
      <div className="timetable-card">
        <h2 className="title">Bus Timetable</h2>
        <p className="subtitle">Check schedules and details for your bus</p>

        {loading && <div className="status-text">Loading...</div>}
        {!loading && !bus && <div className="status-text">Bus not found</div>}

        {bus && (
          <>
            <div className="bus-info">
              <div className="bus-details">
                <div className="bus-name">{bus.name}</div>
                <div className="bus-number">{bus.busNumber} • {bus.from} → {bus.to}</div>
              </div>
            </div>

            <div className="schedule-table-wrapper">
              {(!bus.schedules || bus.schedules.length === 0) ? (
                <div className="status-text">No schedules yet.</div>
              ) : (
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Stops</th>
                      <th>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bus.schedules.map(s => (
                      <tr key={s.id}>
                        <td>{s.date || 'Recurring'}</td>
                        <td>{s.departureTime}</td>
                        <td>{s.arrivalTime}</td>
                        <td>{s.sourceStop || '-'} → {s.destStop || '-'}</td>
                        <td>{s.extraInfo || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
