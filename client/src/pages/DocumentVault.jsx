import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { FileText, Plus, Trash2, ShieldCheck, AlertCircle, Eye, Download, Calendar } from 'lucide-react';

export const DocumentVault = () => {
  const { addToast } = useApp();
  const [docs, setDocs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ID Proofs');
  const [fileType, setFileType] = useState('PDF');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  const loadDocs = async () => {
    try {
      const data = await apiFetch('/documents');
      setDocs(data);
    } catch (err) {}
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await apiFetch('/documents', {
        method: 'POST',
        body: JSON.stringify({ name, category, fileType, issueDate, expiryDate, notes })
      });
      addToast('Document added to Vault!', 'success');
      setName('');
      setNotes('');
      setShowModal(false);
      loadDocs();
    } catch (err) {
      addToast('Error adding document', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/documents/${id}`, { method: 'DELETE' });
      setDocs(prev => prev.filter(d => d._id !== id));
      addToast('Document deleted', 'info');
    } catch (err) {}
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Document Vault</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Encrypted storage & expiration tracking for critical ID proofs, medical & property records.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Document
        </button>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {docs.map(doc => (
          <div key={doc._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{doc.name}</h4>
                  <span className="badge badge-indigo" style={{ marginTop: '2px' }}>{doc.category}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(doc._id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.notes || 'No description added'}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>Expires: {doc.expiryDate || 'Never'}</span>
              </div>
              <button onClick={() => setPreviewDoc(doc)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Vault Document Entry</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Document Name</label>
                <input type="text" placeholder="e.g. Passport Backup PDF" value={name} onChange={e => setName(e.target.value)} className="glass-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input">
                    <option value="ID Proofs" style={{ background: '#111827' }}>ID Proofs</option>
                    <option value="Medical" style={{ background: '#111827' }}>Medical</option>
                    <option value="Automobile" style={{ background: '#111827' }}>Automobile</option>
                    <option value="Property" style={{ background: '#111827' }}>Property</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>File Type</label>
                  <input type="text" value={fileType} onChange={e => setFileType(e.target.value)} className="glass-input" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Expiry Date</label>
                <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="glass-input" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Notes / Reference Number</label>
                <textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)} className="glass-input" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Vault File</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3>{previewDoc.name}</h3>
              <span className="badge badge-emerald">Verified Encrypted</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <p><strong>Category:</strong> {previewDoc.category}</p>
              <p><strong>Type:</strong> {previewDoc.fileType}</p>
              <p><strong>Expiry:</strong> {previewDoc.expiryDate || 'N/A'}</p>
              <p><strong>Notes:</strong> {previewDoc.notes || 'None'}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setPreviewDoc(null)} className="btn-secondary">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
