import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { Target, Plus, Trash2, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const GoalsWishlist = () => {
  const { addToast } = useApp();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const loadGoals = async () => {
    try {
      const data = await apiFetch('/goals');
      setGoals(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;
    try {
      const finalTargetDate = targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await apiFetch('/goals', {
        method: 'POST',
        body: JSON.stringify({ title, category, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount || 0), targetDate: finalTargetDate })
      });
      addToast('Goal added!', 'success');
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate('');
      setShowModal(false);
      loadGoals();
    } catch (err) {
      addToast('Failed to create goal', 'error');
    }
  };

  const handleCelebrate = (goalTitle) => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    addToast(`🎉 Congratulations on achieving your goal: "${goalTitle}"!`, 'success');
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/goals/${id}`, { method: 'DELETE' });
      setGoals(prev => prev.filter(g => g._id !== id));
      addToast('Goal deleted', 'info');
    } catch (err) {}
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Goals & Wishlist Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Set milestone targets for emergency funds, dream purchases, and professional certifications.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Goal / Wishlist
        </button>
      </div>

      {/* Goals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = goal.completed || pct >= 100;
          return (
            <div key={goal._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: isDone ? '4px solid #10b981' : '4px solid #6366f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{goal.title}</h4>
                  <span className="badge badge-indigo" style={{ marginTop: '4px' }}>{goal.category}</span>
                </div>
                <button onClick={() => handleDelete(goal._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span>₹{goal.currentAmount.toLocaleString()} saved</span>
                  <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: isDone ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '5px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Target Date: {goal.targetDate}</span>
                {isDone ? (
                  <button onClick={() => handleCelebrate(goal.title)} className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <Sparkles size={14} /> Celebrate!
                  </button>
                ) : (
                  <span className="badge badge-amber">{pct}% Complete</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Add Goal or Savings Wishlist</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Goal Title</label>
                <input type="text" placeholder="e.g. Emergency Fund (6 Months)" value={title} onChange={e => setTitle(e.target.value)} className="glass-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input">
                    <option value="Savings" style={{ background: '#111827' }}>Savings</option>
                    <option value="Career" style={{ background: '#111827' }}>Career</option>
                    <option value="Wishlist" style={{ background: '#111827' }}>Wishlist</option>
                    <option value="Travel" style={{ background: '#111827' }}>Travel</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Date</label>
                  <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="glass-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Amount (₹)</label>
                  <input type="number" placeholder="600000" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="glass-input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Current Saved (₹)</label>
                  <input type="number" placeholder="480000" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="glass-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
