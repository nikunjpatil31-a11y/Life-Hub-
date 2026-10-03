import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ShieldCheck, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';

export const Auth = () => {
  const { user, login, logout, storageMode } = useAuth();
  const { addToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');

      login(data.token, data.user);
      addToast(`Welcome ${data.user.name}!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDemoLogin = () => {
    login('demo-token-lifehub', {
      id: 'user_demo_123',
      name: 'Nikunj Sharma',
      email: 'demo@lifehub.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    addToast('Logged in as Nikunj Sharma (Demo Account)', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Authentication & Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Secure JWT authentication with bcrypt password encryption.
        </p>
      </div>

      {/* User Info Card */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--accent-primary)', marginBottom: '12px' }}
        />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{user.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>{user.email}</p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.8rem', fontWeight: '600', marginBottom: '20px' }}>
          <CheckCircle2 size={16} /> Active Session ({storageMode})
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button onClick={handleDemoLogin} className="btn-secondary">
            1-Click Demo Login
          </button>
          <button onClick={logout} className="btn-primary" style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            onClick={() => setMode('login')}
            style={{ border: 'none', background: 'none', color: mode === 'login' ? '#818cf8' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer' }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{ border: 'none', background: 'none', color: mode === 'register' ? '#818cf8' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer' }}
          >
            Register Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="glass-input" required />
            </div>
          )}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input type="email" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="glass-input" required />
          </div>
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
            {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
