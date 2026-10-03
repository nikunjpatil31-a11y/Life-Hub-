import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { Wallet, Plus, Trash2, ArrowUpRight, ArrowDownRight, PieChart, DollarSign } from 'lucide-react';

export const Finance = () => {
  const { addToast } = useApp();
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Tech & Subscriptions');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadFinances = async () => {
    try {
      const data = await apiFetch('/finance');
      setFinances(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinances();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    try {
      await apiFetch('/finance', {
        method: 'POST',
        body: JSON.stringify({ title, amount: Number(amount), type, category, date })
      });
      addToast('Transaction added successfully!', 'success');
      setTitle('');
      setAmount('');
      setShowModal(false);
      loadFinances();
    } catch (err) {
      addToast('Failed to add transaction', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/finance/${id}`, { method: 'DELETE' });
      addToast('Transaction deleted', 'info');
      setFinances(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      addToast('Could not delete transaction', 'error');
    }
  };

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Finance & Expense Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track income sources, recurring subscriptions, and budget health.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>TOTAL INCOME</span>
            <ArrowUpRight size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399', margin: '8px 0' }}>
            ₹{totalIncome.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From salary & freelance work</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>TOTAL EXPENSE</span>
            <ArrowDownRight size={18} style={{ color: '#f43f5e' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fb7185', margin: '8px 0' }}>
            ₹{totalExpense.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Utilities, groceries & tech</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>NET SAVINGS</span>
            <Wallet size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#818cf8', margin: '8px 0' }}>
            ₹{netSavings.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Savings rate: {totalIncome ? Math.round((netSavings/totalIncome)*100) : 0}%</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Transactions ({finances.length})</h3>
        {finances.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>TITLE</th>
                  <th style={{ padding: '12px' }}>CATEGORY</th>
                  <th style={{ padding: '12px' }}>DATE</th>
                  <th style={{ padding: '12px' }}>AMOUNT</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {finances.map(f => (
                  <tr key={f._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{f.title}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge badge-indigo">{f.category}</span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{f.date}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '700', color: f.type === 'income' ? '#34d399' : '#fb7185' }}>
                      {f.type === 'income' ? '+' : '-'}₹{f.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(f._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No financial transactions logged yet.</div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Add Financial Record</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Title / Description</label>
                <input type="text" placeholder="e.g. AWS Cloud Bill" value={title} onChange={e => setTitle(e.target.value)} className="glass-input" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
                <input type="number" placeholder="2500" value={amount} onChange={e => setAmount(e.target.value)} className="glass-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="glass-input">
                    <option value="expense" style={{ background: '#111827' }}>Expense</option>
                    <option value="income" style={{ background: '#111827' }}>Income</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input">
                    <option value="Salary" style={{ background: '#111827' }}>Salary</option>
                    <option value="Freelance" style={{ background: '#111827' }}>Freelance</option>
                    <option value="Tech & Subscriptions" style={{ background: '#111827' }}>Tech & Subscriptions</option>
                    <option value="Food & Dining" style={{ background: '#111827' }}>Food & Dining</option>
                    <option value="Utilities" style={{ background: '#111827' }}>Utilities</option>
                    <option value="General" style={{ background: '#111827' }}>General</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="glass-input" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
