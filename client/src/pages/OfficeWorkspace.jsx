import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { Briefcase, Clock, Calendar, CheckSquare, Plus, Video } from 'lucide-react';

export const OfficeWorkspace = () => {
  const { addToast } = useApp();
  const [officeData, setOfficeData] = useState({ projects: [], workLogs: [], meetings: [] });
  const [logHours, setLogHours] = useState('');
  const [logDesc, setLogDesc] = useState('');

  const loadOfficeData = async () => {
    try {
      const data = await apiFetch('/office');
      setOfficeData(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadOfficeData();
  }, []);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!logHours || !logDesc) return;
    try {
      await apiFetch('/office/workLogs', {
        method: 'POST',
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0], hours: Number(logHours), taskDescription: logDesc })
      });
      addToast('Work log saved!', 'success');
      setLogHours('');
      setLogDesc('');
      loadOfficeData();
    } catch (err) {
      addToast('Error logging hours', 'error');
    }
  };

  const totalLoggedHours = (officeData.workLogs || []).reduce((sum, l) => sum + l.hours, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Office & Career Workspace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sprint projects, client deliverables, daily billable hours log, and meeting schedule.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Active Projects */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} style={{ color: '#818cf8' }} /> Active Client Projects
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(officeData.projects || []).map(prj => (
              <div key={prj._id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{prj.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Client: {prj.client} • Deadline: {prj.deadline}</span>
                  </div>
                  <span className="badge badge-emerald">{prj.progress}% Done</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${prj.progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Hours Logger */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#06b6d4' }} /> Log Work Hours
            </h3>
            <span className="badge badge-cyan">{totalLoggedHours} hrs total</span>
          </div>

          <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="number"
              step="0.5"
              placeholder="Hours spent (e.g. 4.5)"
              value={logHours}
              onChange={e => setLogHours(e.target.value)}
              className="glass-input"
              required
            />
            <textarea
              rows="3"
              placeholder="What did you work on today?"
              value={logDesc}
              onChange={e => setLogDesc(e.target.value)}
              className="glass-input"
              required
            />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              <Plus size={16} /> Save Work Log
            </button>
          </form>

          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '160px' }}>
            {(officeData.workLogs || []).map(wl => (
              <div key={wl._id} style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: '600', color: '#a5b4fc' }}>{wl.date} — {wl.hours} hrs</div>
                <div style={{ color: 'var(--text-secondary)' }}>{wl.taskDescription}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
