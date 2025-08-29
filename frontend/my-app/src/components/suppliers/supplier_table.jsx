import React, { useState, useMemo, useEffect } from 'react';
import { getSuppliers, writeSupplierData, deleteSupplier } from '../../services/database';
import {
  Box,
  Paper,
  // Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // TablePagination,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Removed large mock dataset; will load from Firebase.

// Optional small seed (commented out)
// const seedSuppliers = [ { supplierName: 'Alpha Distributors', product: 'Bottled Water (500ml)', contactNumber: '555-0101', email: 'contact@alphadist.com', type: 'Taking Return', onTheWay: 120 } ];

// Styled rows to mirror product.jsx zebra and hover
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.focus,
  },
}));

export default function SupplierTable() {
  const [page, setPage] = useState(0);
  const rowsPerPage = 9; // match product table
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state (by Type)
  const [filterType, setFilterType] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Add Supplier modal state
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: '',
    product: '',
    contactNumber: '',
    email: '',
    type: 'Taking Return',
    onTheWay: '',
  });

  // Helper: determine if a supplier row has no meaningful data (only delete action would show)
  const isRowEmpty = (s) => {
    const textEmpty = (v) => v == null || String(v).trim() === '';
    const onTheWayEmpty = s.onTheWay == null || (typeof s.onTheWay === 'string' && s.onTheWay.trim() === '');
    return (
      textEmpty(s.supplierName) &&
      textEmpty(s.product) &&
      textEmpty(s.contactNumber) &&
      textEmpty(s.email) &&
      textEmpty(s.type) &&
      onTheWayEmpty
    );
  };

  // Apply type filter then remove empty rows
  const filteredSuppliers = useMemo(() => {
    const base = filterType === 'All' ? suppliers : suppliers.filter((s) => (s.type || '') === filterType);
    return base.filter(s => !isRowEmpty(s));
  }, [suppliers, filterType]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSuppliers.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredSuppliers]);

  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / rowsPerPage));

  // Delete supplier handler (mirrors delete patterns elsewhere)
  const handleDeleteSupplier = async (globalIndex) => {
    const supplier = filteredSuppliers[globalIndex];
    if (!supplier) return;
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await deleteSupplier(supplier.id);
      await loadSuppliers();
    } catch (e) {
      console.error('Delete failed', e);
      setError('Failed to delete supplier');
    }
  };

  // Load suppliers from Firebase
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const snapshot = await getSuppliers();
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.values(data || {});
        list.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
        setSuppliers(list);
      } else {
        setSuppliers([]);
      }
    } catch (e) {
      console.error('Failed to load suppliers', e);
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSuppliers(); }, []);

  // Filter handlers
  const handleFilterToggle = () => setShowFilterDropdown((v) => !v);
  const handleFilterChange = (value) => {
    setFilterType(value);
    setShowFilterDropdown(false);
    setPage(0);
  };

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest('.filter-container')) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  // Download filtered suppliers as CSV
  const handleDownload = () => {
    if (filteredSuppliers.length === 0) return;
    const data = filteredSuppliers.map((s) => ({
      'Supplier Name': s.supplierName,
      Product: s.product,
      'Contact Number': s.contactNumber,
      Email: s.email,
      Type: s.type,
      'On the way': s.onTheWay,
    }));
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const v = String(row[h] ?? '');
            return v.includes(',') ? '"' + v.replaceAll('"', '""') + '"' : v;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    const suffix = filterType !== 'All' ? '_' + filterType.replaceAll(' ', '_') : '';
    a.href = url;
    a.download = `suppliers_${date}${suffix}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Modal handlers
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ supplierName: '', product: '', contactNumber: '', email: '', type: 'Taking Return', onTheWay: '' });
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = openModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [openModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSupplier = {
        supplierName: formData.supplierName.trim(),
        product: formData.product.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
        type: formData.type,
        onTheWay: parseInt(formData.onTheWay || '0', 10),
      };
      await writeSupplierData(newSupplier);
      handleCloseModal();
      setPage(0);
      await loadSuppliers();
    } catch (e) {
      console.error('Failed to add supplier', e);
      setError('Failed to add supplier');
    }
  };

  return (
    <div className="supplier-table-container" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
      <Box sx={{ p: 1 }}>
        <div className="supplier-table-header">
          <h1>Suppliers</h1>
          <div className="btn-supplier-container">
            <button id="add-supplier-btn" className="btn btn-primary" onClick={handleOpenModal}>Add Supplier</button>

            <div className="filter-container" style={{ position: 'relative', display: 'inline-block' }}>
              <button id="filter-btn" onClick={handleFilterToggle}>
                <img src="../src/assets/inventory/Filterslines.svg" alt="Filter" />Filter
              </button>
              {showFilterDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: '180px' }}>
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>Filter by Type:</div>
                    {['All', 'Taking Return', 'Not Taking Return'].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleFilterChange(t)}
                        style={{ color: '#000', width: '100%', padding: '8px 12px', border: 'none', backgroundColor: filterType === t ? '#fff' : '#eee', cursor: 'pointer', textAlign: 'left', fontSize: '14px' }}
                      >
                        {t} {filterType === t && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button id="download-all" onClick={handleDownload}>Download All</button>
          </div>
        </div>

        {/* Filter status banner */}
        {filterType !== 'All' && (
          <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Showing suppliers with type: <strong>{filterType}</strong></span>
            <button onClick={() => handleFilterChange('All')} style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>Clear filter</button>
          </div>
        )}

        <Box sx={{ width: '100%', height: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {error && (
              <Typography color="error" variant="body2" sx={{ m: 0 }}>{error}</Typography>
            )}
            <Button onClick={loadSuppliers} variant="outlined" size="small">Refresh</Button>
          </div>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 0 }}>
            <Table sx={{ width: '100%', borderCollapse: 'collapse', height: '100%' }} aria-label="suppliers table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Supplier Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact Number</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>On the way</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="body2">Loading suppliers...</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!loading && paged.map((s, idx) => (
                  <StyledTableRow key={s.id || `${s.supplierName}-${idx}`}>
                    <TableCell>{s.supplierName}</TableCell>
                    <TableCell>{s.product}</TableCell>
                    <TableCell>{s.contactNumber}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell sx={{ fontWeight: 400, color: ((s.type || '').toLowerCase() === 'not taking return') ? '#d32f2f' : ((s.type || '').toLowerCase() === 'taking return') ? '#2e7d32' : 'inherit' }}>{s.type}</TableCell>
                    <TableCell>{s.onTheWay}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDeleteSupplier(idx)}
                        style={{
                          maxWidth: '100px',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid var(--Gray-200, #CFD4DC)',
                          background: 'var(--Base-White, #FFF)',
                          color: 'var(--Error-500, #F04438)',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '10px 16px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--Gray-50, #F9FAFB)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--Base-White, #FFF)')}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </StyledTableRow>
                ))}

                {!loading && paged.length < rowsPerPage && (
                  <TableRow style={{ height: 30 * (rowsPerPage - paged.length) }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls to match product.jsx */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', mt: 3, width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              size="small"
            >
              Previous
            </Button>

            <Typography variant="body2" color="text.secondary">
              Page {page + 1} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page + 1 === totalPages}
              size="small"
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Add Supplier Modal */}
      {openModal && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, height: '100vh', overflow: 'hidden' }}
        >
          <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>New Supplier</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#666' }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>Supplier Name *</label>
                  <input type="text" name="supplierName" value={formData.supplierName} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>Product *</label>
                    <input type="text" name="product" value={formData.product} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>Contact Number *</label>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>On the way *</label>
                    <input type="number" name="onTheWay" value={formData.onTheWay} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}>
                    <option value="Taking Return">Taking Return</option>
                    <option value="Not Taking Return">Not Taking Return</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', color: '#333', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer', fontSize: '14px' }}>Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

