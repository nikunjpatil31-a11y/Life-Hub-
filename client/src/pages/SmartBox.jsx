import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { PackageSearch, Search, Plus, Trash2, MapPin, Box, Tag } from 'lucide-react';

export const SmartBox = () => {
  const { addToast, searchQuery: globalSearch } = useApp();
  const [items, setItems] = useState([]);
  const [localSearch, setLocalSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [room, setRoom] = useState('Master Bedroom');
  const [boxName, setBoxName] = useState('Box #1');
  const [drawerNumber, setDrawerNumber] = useState('Drawer 1');
  const [tagsStr, setTagsStr] = useState('');
  const [notes, setNotes] = useState('');

  const loadSmartBoxItems = async () => {
    try {
      const data = await apiFetch('/smartbox');
      setItems(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadSmartBoxItems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      await apiFetch('/smartbox', {
        method: 'POST',
        body: JSON.stringify({ name, room, boxName, drawerNumber, tags, notes })
      });
      addToast('Item cataloged in Smart Box!', 'success');
      setName('');
      setNotes('');
      setTagsStr('');
      setShowModal(false);
      loadSmartBoxItems();
    } catch (err) {
      addToast('Failed to catalog item', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/smartbox/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i._id !== id));
      addToast('Catalog item removed', 'info');
    } catch (err) {}
  };

  const query = (localSearch || globalSearch).toLowerCase();
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.room.toLowerCase().includes(query) ||
    item.boxName.toLowerCase().includes(query) ||
    (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Smart Box — Item Locator Engine</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            "Where did I put my spare keys / DSLR camera lens / passport?" Instant location finder.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Catalog New Item
        </button>
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search items, tags (e.g. 'keys', 'DSLR', 'Drawer 2')..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="glass-input"
          style={{ paddingLeft: '44px', height: '48px', fontSize: '1rem' }}
        />
      </div>

      {/* Catalog Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                    <Box size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.name}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} /> {item.room} • {item.boxName}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location Slot:</span> <strong>{item.drawerNumber}</strong>
                {item.notes && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Note: {item.notes}</div>}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
            No item matches your search query. Try cataloging it!
          </div>
        )}
      </div>

      {/* Catalog Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Catalog Item in Smart Box</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Item Name</label>
                <input type="text" placeholder="e.g. Spare House Keys" value={name} onChange={e => setName(e.target.value)} className="glass-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Room / Area</label>
                  <input type="text" placeholder="Master Bedroom" value={room} onChange={e => setRoom(e.target.value)} className="glass-input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Container / Box</label>
                  <input type="text" placeholder="Safe Box #1" value={boxName} onChange={e => setBoxName(e.target.value)} className="glass-input" required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Drawer / Shelf Position</label>
                <input type="text" placeholder="Drawer 2" value={drawerNumber} onChange={e => setDrawerNumber(e.target.value)} className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Search Tags (comma separated)</label>
                <input type="text" placeholder="keys, emergency, security" value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Notes</label>
                <textarea rows="2" placeholder="Includes red key fob..." value={notes} onChange={e => setNotes(e.target.value)} className="glass-input" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Item Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
