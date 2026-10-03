import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, CheckCircle, Database, Zap, ShieldCheck } from 'lucide-react';

export const Analytics = () => {
  const { storageMode } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    apiFetch('/analytics')
      .then(data => setAnalytics(data))
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Analytics & System Insights</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time metrics on task throughput, savings rate, and system health status.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Productivity Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a5b4fc' }}>PRODUCTIVITY METRIC</span>
            <Zap size={20} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a5b4fc', marginBottom: '6px' }}>
            {analytics?.productivityScore || 92}%
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on task completion velocity & study focus sessions.</p>
        </div>

        {/* Task Completion Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399' }}>TASK THROUGHPUT</span>
            <CheckCircle size={20} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>
            {analytics?.taskCompletionRate || 75}%
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed tasks relative to open sprint items.</p>
        </div>

        {/* System Storage Mode */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbbf24' }}>DATABASE ENGINE</span>
            <Database size={20} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {storageMode}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {storageMode.includes('MongoDB') ? 'Live Mongoose connection established.' : 'Fallback mock store active (MongoDB daemon offline).'}
          </p>
        </div>
      </div>
    </div>
  );
};
