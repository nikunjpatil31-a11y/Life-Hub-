import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Wrench, Plus, Check, Trash2, DollarSign } from 'lucide-react';

export const HomeManagement = () => {
  const { addToast } = useApp();
  const [homeData, setHomeData] = useState({ inventory: [], groceryList: [], maintenance: [] });
  
  // Grocery Form State
  const [grocItem, setGrocItem] = useState('');
  const [grocQty, setGrocQty] = useState('');
  const [grocCost, setGrocCost] = useState('');

  const loadHomeData = async () => {
    try {
      const data = await apiFetch('/home');
      setHomeData(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleAddGrocery = async (e) => {
    e.preventDefault();
    if (!grocItem) return;
    try {
      await apiFetch('/home/groceryList', {
        method: 'POST',
        body: JSON.stringify({ item: grocItem, qty: grocQty || '1 Pack', estimatedCost: Number(grocCost || 0), bought: false })
      });
      addToast('Grocery item added', 'success');
      setGrocItem('');
      setGrocQty('');
      setGrocCost('');
      loadHomeData();
    } catch (err) {
      addToast('Error adding grocery item', 'error');
    }
  };

  const toggleGroceryBought = async (id, currentBought) => {
    try {
      await apiFetch(`/home/groceryList/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ bought: !currentBought })
      });
      setHomeData(prev => ({
        ...prev,
        groceryList: prev.groceryList.map(g => g._id === id ? { ...g, bought: !currentBought } : g)
      }));
    } catch (err) {}
  };

  const deleteGrocery = async (id) => {
    try {
      await apiFetch(`/home/groceryList/${id}`, { method: 'DELETE' });
      setHomeData(prev => ({
        ...prev,
        groceryList: prev.groceryList.filter(g => g._id !== id)
      }));
      addToast('Item removed', 'info');
    } catch (err) {}
  };

  const groceryTotalCost = (homeData.groceryList || []).reduce((sum, g) => sum + (g.estimatedCost || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Home & Household Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Interactive grocery shopping list with estimated cost calculator and home maintenance tracker.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Interactive Grocery List */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} style={{ color: '#10b981' }} /> Live Grocery Shopping List
            </h3>
            <span className="badge badge-emerald">Est: ₹{groceryTotalCost.toLocaleString()}</span>
          </div>

          <form onSubmit={handleAddGrocery} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px' }}>
            <input type="text" placeholder="Item (e.g. Almond Milk)" value={grocItem} onChange={e => setGrocItem(e.target.value)} className="glass-input" required />
            <input type="text" placeholder="Qty (2 Liters)" value={grocQty} onChange={e => setGrocQty(e.target.value)} className="glass-input" />
            <input type="number" placeholder="Cost ₹" value={grocCost} onChange={e => setGrocCost(e.target.value)} className="glass-input" />
            <button type="submit" className="btn-primary" style={{ padding: '0 12px' }}>
              <Plus size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {(homeData.groceryList || []).map(g => (
              <div key={g._id} style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: g.bought ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => toggleGroceryBought(g._id, g.bought)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: g.bought ? '#10b981' : 'transparent',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {g.bought && <Check size={14} />}
                  </button>
                  <span style={{ textDecoration: g.bought ? 'line-through' : 'none', color: g.bought ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: '500' }}>
                    {g.item} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({g.qty})</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#34d399' }}>₹{g.estimatedCost}</span>
                  <button onClick={() => deleteGrocery(g._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tasks */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} style={{ color: '#fbbf24' }} /> Home Maintenance Schedule
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(homeData.maintenance || []).map(m => (
              <div key={m._id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{m.task}</h4>
                  <span className="badge badge-amber">{m.priority}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Due Date: {m.dueDate} • Status: {m.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
