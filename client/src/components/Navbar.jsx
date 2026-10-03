import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, Sun, Moon, Command, User, Bell } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, searchQuery, setSearchQuery, setIsCommandOpen } = useApp();
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '360px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search items, notes, documents, smart box..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input"
          style={{ paddingLeft: '36px', height: '38px' }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem', height: '38px' }}
        >
          <Command size={14} />
          <span>Cmd + K</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
          title="Toggle Dark / Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#818cf8' }} />}
        </button>

        {/* User Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)'
        }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pro Member</div>
          </div>
        </div>
      </div>
    </header>
  );
};
