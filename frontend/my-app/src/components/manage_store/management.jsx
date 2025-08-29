import React, { useEffect, useState } from 'react';
import { getStores, writeStoreData, deleteStore } from '../../services/database';

// Layout preserved; data loaded from Firebase instead of mockStores.

export default function Management() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState('add'); // 'add' | 'edit'
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        store: '',
        location: '',
        email: '',
        telephone: '',
    });

    // Disable background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = openModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [openModal]);

    const handleAddOpen = () => {
        setMode('add');
        setEditingIndex(null);
        setFormData({ store: '', location: '', email: '', telephone: '' });
        setOpenModal(true);
    };

    const handleEditOpen = (index) => {
        setMode('edit');
        setEditingIndex(index);
        setFormData(stores[index]);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.store || !formData.location || !formData.email || !formData.telephone) return;
        try {
            if (mode === 'add') {
                await writeStoreData(formData);
            } else if (mode === 'edit' && editingIndex !== null) {
                const target = stores[editingIndex];
                if (target) {
                    await writeStoreData({ ...formData, id: target.id });
                }
            }
            setOpenModal(false);
            await loadStores();
        } catch (e) {
            console.error('Failed to save store', e);
            setError('Failed to save store');
        }
    };

    const handleDelete = async (index) => {
        const target = stores[index];
        if (!target) return;
        if (!window.confirm(`Delete store "${target.store}"? This action cannot be undone.`)) return;
        try {
            await deleteStore(target.id);
            if (editingIndex === index) setOpenModal(false);
            await loadStores();
        } catch (e) {
            console.error('Failed to delete store', e);
            setError('Failed to delete store');
        }
    };

    const loadStores = async () => {
        try {
            setLoading(true);
            setError(null);
            const snapshot = await getStores();
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.values(data || {});
                list.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
                setStores(list);
            } else {
                setStores([]);
            }
        } catch (e) {
            console.error('Failed to load stores', e);
            setError('Failed to load stores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStores(); }, []);

    return (
        <div className="management-container">
            <div id="header-container">
                <h1>Manage Store</h1>
                <button id="add-store" onClick={handleAddOpen}>Add Store</button>
            </div>

            {/* Refresh button moved directly under Add Store button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, marginBottom: 16 }}>
                <button onClick={loadStores} className="store-refresh-btn">Refresh</button>
            </div>

            <div className="store-container">
                {loading && <p style={{ padding: 16 }}>Loading stores...</p>}
                {error && <p style={{ padding: 16, color: 'red' }}>{error}</p>}
                {!loading && stores.length === 0 && !error && <p style={{ padding: 16 }}>No stores found. Add one.</p>}
                {!loading && stores.map((store, index) => (
                    <div className="store-card" key={index} style={{ position: 'relative' }}>
                        <div className="store-pics"></div>
                        <div className="store-details">
                            <h2 className="store-title">{store.store}</h2>
                            <p>{store.location}</p>
                            <p>{store.email}</p>
                            <p>{store.telephone}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 'auto', marginRight: 15, marginTop: 15 }}>
                            <button className="edit-button" onClick={() => handleEditOpen(index)}>Edit</button>
                            <button
                                onClick={() => handleDelete(index)}
                                style={{
                                    maxWidth: '110px',
                                    height: '40px',
                                    borderRadius: '5px',
                                    background: '#fff',
                                    color: 'red',
                                    fontFamily: 'Inter',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    lineHeight: '20px',
                                    border: '1px solid var(--Gray-50)',
                                    cursor: 'pointer',
                                    transition: 'all .3s ease-out'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = 'var(--Gray-50)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Store Modal */}
            {openModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                >
                    <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, width: 560, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={{ margin: 0 }}>{mode === 'add' ? 'Add Store' : 'Edit Store'}</h2>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6 }}>Name *</label>
                                    <input type="text" name="store" value={formData.store} onChange={handleInputChange} required style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6 }}>Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 6 }}>Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 6 }}>Telephone *</label>
                                        <input type="text" name="telephone" value={formData.telephone} onChange={handleInputChange} required style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                                <button type="button" onClick={handleCloseModal} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 4, backgroundColor: 'black', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', border: 'none', borderRadius: 4, backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}>{mode === 'add' ? 'Add Store' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}