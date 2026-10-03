import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Wallet, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Home, 
  PackageSearch, 
  Target, 
  BarChart3, 
  ShieldCheck,
  Zap,
  Database
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useApp();
  const { storageMode } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'tasks', label: 'Tasks & Notes', icon: CheckSquare },
    { id: 'documents', label: 'Document Vault', icon: FileText },
    { id: 'study', label: 'Study Workspace', icon: GraduationCap },
    { id: 'office', label: 'Office Workspace', icon: Briefcase },
    { id: 'home', label: 'Home & Grocery', icon: Home },
    { id: 'smartbox', label: 'Smart Box Locator', icon: PackageSearch },
    { id: 'goals', label: 'Goals & Wishlist', icon: Target },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'auth', label: 'Auth & Account', icon: ShieldCheck }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px 14px'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Zap size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LifeHub
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
            Smart Life Engine v1.0
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))' : 'transparent',
                color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
              }}
            >
              <Icon size={19} style={{ color: isActive ? '#818cf8' : 'currentColor' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Storage Mode Footer Indicator */}
      <div style={{
        padding: '12px',
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-secondary)'
      }}>
        <Database size={16} style={{ color: storageMode.includes('MongoDB') ? '#34d399' : '#fbbf24' }} />
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Storage Engine</div>
          <div style={{ color: storageMode.includes('MongoDB') ? '#34d399' : '#fbbf24' }}>
            {storageMode}
          </div>
        </div>
      </div>
    </aside>
  );
};
