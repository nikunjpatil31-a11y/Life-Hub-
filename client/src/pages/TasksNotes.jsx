import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { CheckSquare, StickyNote, Plus, Trash2, Pin, Calendar, Tag, CheckCircle2, Clock } from 'lucide-react';

export const TasksNotes = () => {
  const { addToast } = useApp();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'notes'
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [itemType, setItemType] = useState('task');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');

  const loadItems = async () => {
    try {
      const data = await apiFetch('/tasks-notes');
      setItems(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await apiFetch('/tasks-notes', {
        method: 'POST',
        body: JSON.stringify({ itemType, title, content, priority, category, dueDate, status: 'todo', pinned: itemType === 'note' })
      });
      addToast(`${itemType === 'task' ? 'Task' : 'Note'} added!`, 'success');
      setTitle('');
      setContent('');
      setShowModal(false);
      loadItems();
    } catch (err) {
      addToast('Failed to create item', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiFetch(`/tasks-notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setItems(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
      addToast('Task status updated', 'info');
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/tasks-notes/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item._id !== id));
      addToast('Item removed', 'info');
    } catch (err) {}
  };

  const tasks = items.filter(i => i.itemType === 'task');
  const notes = items.filter(i => i.itemType === 'note');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Tasks & Pinned Notes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Kanban task board and scratchpad notes with priority tags.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sub-tab Toggle */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px', display: 'flex', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('tasks')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'tasks' ? 'var(--accent-primary)' : 'transparent',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Kanban Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'notes' ? 'var(--accent-primary)' : 'transparent',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Notes ({notes.length})
            </button>
          </div>

          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={18} /> New Item
          </button>
        </div>
      </div>

      {/* KANBAN TASKS VIEW */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { key: 'todo', label: 'TO DO', color: '#fbbf24' },
            { key: 'in-progress', label: 'IN PROGRESS', color: '#6366f1' },
            { key: 'completed', label: 'COMPLETED', color: '#10b981' }
          ].map(col => {
            const colTasks = tasks.filter(t => (t.status || 'todo') === col.key);
            return (
              <div key={col.key} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: col.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    {col.label} ({colTasks.length})
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: '200px' }}>
                  {colTasks.map(t => (
                    <div key={t._id} style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</h4>
                        <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {t.content && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.content}</p>}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem' }}>
                        <span className={`badge ${t.priority === 'urgent' ? 'badge-rose' : t.priority === 'high' ? 'badge-amber' : 'badge-indigo'}`}>
                          {t.priority}
                        </span>
                        
                        {/* Status Mover Buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {col.key !== 'todo' && (
                            <button onClick={() => handleStatusChange(t._id, 'todo')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.7rem' }}>
                              To-Do
                            </button>
                          )}
                          {col.key !== 'in-progress' && (
                            <button onClick={() => handleStatusChange(t._id, 'in-progress')} style={{ background: 'rgba(99,102,241,0.2)', border: 'none', color: '#a5b4fc', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.7rem' }}>
                              In-Prog
                            </button>
                          )}
                          {col.key !== 'completed' && (
                            <button onClick={() => handleStatusChange(t._id, 'completed')} style={{ background: 'rgba(16,185,129,0.2)', border: 'none', color: '#34d399', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.7rem' }}>
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NOTES VIEW */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {notes.map(n => (
            <div key={n._id} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pin size={16} style={{ color: '#fbbf24' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{n.title}</h4>
                </div>
                <button onClick={() => handleDelete(n._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                  <Trash2 size={15} />
                </button>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{n.content}</p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-cyan">{n.category || 'Note'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Task / Note</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Type</label>
                <select value={itemType} onChange={e => setItemType(e.target.value)} className="glass-input">
                  <option value="task" style={{ background: '#111827' }}>Task (Kanban)</option>
                  <option value="note" style={{ background: '#111827' }}>Pinned Note</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Title</label>
                <input type="text" placeholder="e.g. Schedule AC maintenance" value={title} onChange={e => setTitle(e.target.value)} className="glass-input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Content / Notes</label>
                <textarea rows="3" placeholder="Add additional details..." value={content} onChange={e => setContent(e.target.value)} className="glass-input" />
              </div>

              {itemType === 'task' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)} className="glass-input">
                      <option value="normal" style={{ background: '#111827' }}>Normal</option>
                      <option value="high" style={{ background: '#111827' }}>High</option>
                      <option value="urgent" style={{ background: '#111827' }}>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="glass-input" />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
