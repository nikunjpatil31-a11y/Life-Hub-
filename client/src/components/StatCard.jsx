import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#6366f1', badgeText }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Background Accent Glow */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: color,
        opacity: 0.15,
        filter: 'blur(20px)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{title}</span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{subtitle}</span>
        {badgeText && (
          <span style={{ color: color, fontWeight: '600', background: `${color}15`, padding: '2px 8px', borderRadius: '12px' }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
