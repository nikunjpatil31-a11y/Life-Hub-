import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Wallet, CheckSquare, FileText, 
  GraduationCap, Briefcase, Home, PackageSearch, 
  Target, BarChart3, ShieldCheck, X, Search 
} from 'lucide-react';

export const CommandPalette = () => {
  const { isCommandOpen, setIsCommandOpen, setActiveTab } = useApp();
  const [filter, setFilter] = useState('');

  if (!isCommandOpen) return null;

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Go to Finance & Expenses', icon: Wallet },
    { id: 'tasks', label: 'Go to Tasks & Notes Kanban', icon: CheckSquare },
    { id: 'documents', label: 'Go to Document Vault', icon: FileText },
    { id: 'study', label: 'Go to Study Workspace & Pomodoro', icon: GraduationCap },
    { id: 'office', label: 'Go to Office & Sprint Tracker', icon: Briefcase },
    { id: 'home', label: 'Go to Home Inventory & Grocery', icon: Home },
    { id: 'smartbox', label: 'Go to Smart Box Item Locator', icon: PackageSearch },
    { id: 'goals', label: 'Go to Goals & Wishlist', icon: Target },
    { id: 'analytics', label: 'Go to Analytics & Insights', icon: BarChart3 },
    { id: 'auth', label: 'Go to Auth & Profile Settings', icon: ShieldCheck }
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()));

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsCommandOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', overflow: 'hidden', padding: 0 }}>
        {/* Header Search */}
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <Search size={20} style={{ color: 'var(--accent-primary)' }} />
          <input
            type="text"
            placeholder="Type a command or module name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              outline: 'none',
              width: '100%'
            }}
            autoFocus
          />
          <button onClick={() => setIsCommandOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Command List */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length > 0 ? (
            filtered.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={18} style={{ color: '#818cf8' }} />
                  <span>{cmd.label}</span>
                </button>
              );
            })
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Navigation Quick-Selector</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
