import React, { useEffect, useState } from 'react';

const mockStores = [
    {
        store: 'Lisy Store',
        location: 'Nairobi, 7th Street avenue',
        email: 'lisatore@gmail.com',
        telephone: '+254 700 000 000',
    },
    {
        store: 'Xpress Mart - Downtown',
        location: 'Lagos, Broad Street 24',
        email: 'downtown@xpressmart.com',
        telephone: '+234 813 555 0199',
    },
    {
        store: 'Xpress Mart - Eastside',
        location: 'Accra, Ring Road East 102',
        email: 'eastside@xpressmart.com',
        telephone: '+233 54 222 7788',
    }
]

export default function Management() {
    // Local stores state so we can add/edit
    const [stores, setStores] = useState(mockStores);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.store || !formData.location || !formData.email || !formData.telephone) return;

        if (mode === 'add') {
            setStores((prev) => [formData, ...prev]);
        } else if (mode === 'edit' && editingIndex !== null) {
            setStores((prev) => prev.map((s, i) => (i === editingIndex ? formData : s)));
        }

        setOpenModal(false);
    };

    const handleDelete = (index) => {
        const target = stores[index];
        if (!target) return;
        const ok = window.confirm(`Delete store "${target.store}"? This action cannot be undone.`);
        if (!ok) return;
        setStores(prev => prev.filter((_, i) => i !== index));
        // If we deleted the one being edited, close modal
        if (editingIndex === index) {
            setOpenModal(false);
        }
    };

    return (
        <div className="management-container">
            <div id="header-container">
                <h1>Manage Store</h1>
                <button id="add-store" onClick={handleAddOpen}>Add Store</button>
            </div>

            <div className="store-container">
                {stores.map((store, index) => (
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