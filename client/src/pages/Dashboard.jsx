import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { apiFetch } from '../services/api';
import { 
  Zap, Wallet, CheckSquare, PackageSearch, Target, 
  ArrowUpRight, ArrowDownRight, Sparkles, Clock, AlertTriangle, Send
} from 'lucide-react';

export const Dashboard = () => {
  const { setActiveTab, addToast } = useApp();
  const { user, storageMode } = useAuth();

  const [stats, setStats] = useState(null);
  const [quickNote, setQuickNote] = useState('');
  const [savedNotes, setSavedNotes] = useState(['Submit Q4 roadmap presentation', 'Check passport expiry in Vault']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/analytics')
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddQuickNote = (e) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setSavedNotes([quickNote, ...savedNotes]);
    setQuickNote('');
    addToast('Quick note saved to scratchpad!', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#a5b4fc' }}>SMART LIFE ENGINE ACTIVE</span>
            <span className="badge badge-indigo" style={{ marginLeft: 'auto' }}>{storageMode}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Everything is running smoothly. You have 3 urgent tasks pending, 1 upcoming document expiration, and your productivity score is at 92%.
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <StatCard
          title="PRODUCTIVITY SCORE"
          value="92%"
          subtitle="Top 5% efficiency week"
          icon={Zap}
          color="#6366f1"
          badgeText="+4% vs last week"
        />
        <StatCard
          title="NET CASHFLOW"
          value="₹504,550"
          subtitle="Income: ₹515k | Expense: ₹10.5k"
          icon={Wallet}
          color="#10b981"
          badgeText="Healthy"
        />
        <StatCard
          title="ACTIVE TASKS"
          value="4 Pending"
          subtitle="1 Task Completed Today"
          icon={CheckSquare}
          color="#f59e0b"
          badgeText="1 Urgent"
        />
        <StatCard
          title="SMART BOX CATALOG"
          value="4 Items"
          subtitle="Located in 4 rooms"
          icon={PackageSearch}
          color="#06b6d4"
          badgeText="Instant Search"
        />
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left Column: Quick Actions & Urgent Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Module Jump Cards */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#818cf8' }} /> Quick Module Shortcuts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { title: 'Finance Logger', desc: 'Add income / expense', tab: 'finance', color: '#10b981', icon: Wallet },
                { title: 'Tasks & Kanban', desc: 'Manage your tasks', tab: 'tasks', color: '#6366f1', icon: CheckSquare },
                { title: 'Smart Box', desc: 'Where is my item?', tab: 'smartbox', color: '#06b6d4', icon: PackageSearch },
                { title: 'Goal Savings', desc: 'Track your milestones', tab: 'goals', color: '#f43f5e', icon: Target }
              ].map(shortcut => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.tab}
                    onClick={() => setActiveTab(shortcut.tab)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = shortcut.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${shortcut.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: shortcut.color }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{shortcut.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{shortcut.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgent Alerts Feed */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#fb7185' }} /> High Priority Focus & Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fb7185' }}>Renew International Travel Insurance</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vault Doc Expiry in 32 days • Category: Vault</div>
                </div>
                <button onClick={() => setActiveTab('documents')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>View Vault</button>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fbbf24' }}>Finalize Q4 Product Roadmap Presentation</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Due in 2 days • Priority: High</div>
                </div>
                <button onClick={() => setActiveTab('tasks')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Open Kanban</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scratchpad & Daily Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Daily Motivational Box */}
          <div className="glass-panel" style={{ padding: '20px', background: 'var(--gradient-glow)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '8px' }}>
              Daily Focus Quote
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              "Simplicity is prerequisite for reliability. Structure your life, automate the mundane, and focus on deep work."
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— Edsger W. Dijkstra</span>
          </div>

          {/* Quick Scratchpad Note */}
          <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: '#06b6d4' }} /> Quick Scratchpad
            </h3>
            
            <form onSubmit={handleAddQuickNote} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Jot down a quick thought..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="glass-input"
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 14px' }}>
                <Send size={16} />
              </button>
            </form>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedNotes.map((note, idx) => (
                <div key={idx} style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}>
                  • {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
