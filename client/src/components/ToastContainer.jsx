import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 110,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = '#818cf8';
        if (toast.type === 'success') { Icon = CheckCircle2; borderColor = '#34d399'; }
        if (toast.type === 'error') { Icon = AlertCircle; borderColor = '#fb7185'; }

        return (
          <div
            key={toast.id}
            className="glass-panel animate-fade-in"
            style={{
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              minWidth: '280px'
            }}
          >
            <Icon size={18} style={{ color: borderColor }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};
