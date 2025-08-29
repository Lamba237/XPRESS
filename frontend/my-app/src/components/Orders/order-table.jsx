import React, { useMemo, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getOrders, writeOrderData, deleteOrder } from '../../services/database';

// Orders table CRUD integrated with Firebase Realtime Database.
// Shape: { orderId, products, orderValue, quantity, expectedDelivery (YYYY-MM-DD), status }

const ORDER_STATUS = ['All', 'Delayed', 'Confirmed', 'Returned', 'Out for delivery'];

// Removed local mockOrders; data loaded remotely.

// Styled rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:hover': { backgroundColor: theme.palette.action.focus },
}));

const StatusChip = ({ status }) => {
  const s = (status || '').toLowerCase();
  let color = '#2e7d32'; // Confirmed (green)
  if (s === 'delayed') color = '#d32f2f';
  else if (s === 'returned') color = '#ed6c02';
  else if (s === 'out for delivery') color = '#1976d2';
  return (
    <Chip
      label={status}
      size="small"
      sx={{ minWidth: 140, color, backgroundColor: 'transparent', border: 'none', '& .MuiChip-label': { color, fontWeight: 600 } }}
    />
  );
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination (match look/feel of product.jsx)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter by status
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Add Order modal
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    products: '',
    orderValue: '',
    quantity: '',
    orderId: '',
    expectedDelivery: '',
    status: 'Confirmed',
  });

  // Helper to determine empty rows (would only show delete button)
  const isRowEmpty = (o) => {
    const empty = v => v == null || String(v).trim() === '';
    // Treat numeric 0 as data (not empty)
    const numEmpty = v => v == null || (typeof v === 'string' && v.trim() === '');
    return empty(o.products) && numEmpty(o.orderValue) && numEmpty(o.quantity) && empty(o.orderId) && empty(o.expectedDelivery) && empty(o.status);
  };

  // Derived lists: filter first, then remove empty rows
  const filteredOrders = useMemo(() => {
    const base = filterStatus === 'All' ? orders : orders.filter(o => (o.status || '').toLowerCase() === filterStatus.toLowerCase());
    return base.filter(o => !isRowEmpty(o));
  }, [orders, filterStatus]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredOrders]);

  // Filter dropdown handlers
  const handleFilterToggle = () => setShowFilterDropdown((v) => !v);
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setShowFilterDropdown(false);
    setCurrentPage(1);
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

  // Download filtered rows as CSV
  const handleDownload = () => {
    if (filteredOrders.length === 0) return;
    const data = filteredOrders.map((o) => ({
      Products: o.products,
      'Order Value': o.orderValue,
      Quantity: o.quantity,
      'Order ID': o.orderId,
      'Expected Delivery': o.expectedDelivery,
      Status: o.status,
    }));
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) => headers.map((h) => {
        const v = String(row[h] ?? '');
        return v.includes(',') ? '"' + v.replaceAll('"', '""') + '"' : v;
      }).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    const suffix = filterStatus !== 'All' ? '_' + filterStatus.replaceAll(' ', '_') : '';
    a.href = url;
    a.download = `orders_${date}${suffix}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Modal handlers + scroll lock
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ products: '', orderValue: '', quantity: '', orderId: '', expectedDelivery: '', status: 'Confirmed' });
  };
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
      const newOrder = {
        products: formData.products.trim(),
        orderValue: parseFloat(formData.orderValue || '0'),
        quantity: parseInt(formData.quantity || '0', 10),
        orderId: formData.orderId.trim(),
        expectedDelivery: formData.expectedDelivery,
        status: formData.status,
      };
      await writeOrderData(newOrder);
      handleCloseModal();
      setCurrentPage(1);
      await loadOrders();
    } catch (e) {
      console.error('Failed to add order', e);
      setError('Failed to add order');
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    const target = orders.find(o => o.orderId === orderId);
    if (!target) return;
    if (!window.confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
    try {
      await deleteOrder(orderId);
      await loadOrders();
    } catch (e) {
      console.error('Failed to delete order', e);
      setError('Failed to delete order');
    }
  };

  // Load orders from Firebase
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const snapshot = await getOrders();
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.values(data || {});
        list.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
        setOrders(list);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px', height: "627px", width: '1009px' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <div id="header-table">
            <h1>Orders</h1>

            <div className="btn-table-container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button id="add-order-btn" onClick={handleOpenModal}>Add Orders</button>

              <div className="filter-container" style={{ position: 'relative', display: 'inline-block' }}>
                <button id="filter-btn" onClick={handleFilterToggle}>
                  <img src="../src/assets/inventory/Filterslines.svg" alt="Filter" />Filter
                </button>
                {showFilterDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: 180 }}>
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: 14, color: '#000' }}>Filter by Status:</div>
                      {ORDER_STATUS.map((st) => (
                        <button key={st} onClick={() => handleFilterChange(st)} style={{ color: '#000', width: '100%', padding: '8px 12px', border: 'none', backgroundColor: filterStatus === st ? '#fff' : '#eee', cursor: 'pointer', textAlign: 'left', fontSize: 14 }}>
                          {st} {filterStatus === st && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button id="download-btn" onClick={handleDownload}>Download All</button>
            </div>
          </div>
        </Box>

        {/* Filter Status Banner */}
        {filterStatus !== 'All' && (
          <div style={{ marginTop: 12, padding: '8px 12px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 4, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Showing orders with status: <strong>{filterStatus}</strong></span>
            <button onClick={() => handleFilterChange('All')} style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>Clear filter</button>
          </div>
        )}

        {/* Refresh button moved above the table */}
  <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2, mb: 2 }}>
          <Button onClick={loadOrders} variant="outlined" size="small">Refresh</Button>
        </Box>

  <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 0 }}>
          <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="orders table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Products</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Value</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expected Delivery</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2">Loading orders...</Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading && currentItems.map((o, idx) => (
                <StyledTableRow key={`${o.orderId}-${idx}`}>
                  <TableCell>{o.products}</TableCell>
                  <TableCell>{formatCurrency(o.orderValue)}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>{o.orderId}</TableCell>
                  <TableCell>{formatDate(o.expectedDelivery)}</TableCell>
                  <TableCell><StatusChip status={o.status} /></TableCell>
                  <TableCell align="center">
                    <button
                      onClick={() => handleDeleteOrder(o.orderId)}
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
                        padding: '0 14px',
                        transition: 'all .3s ease-out'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = 'var(--Gray-50)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </StyledTableRow>
              ))}
              {!loading && currentItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2" color="text.secondary">No orders found. Add a new order to get started.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', mt: 3, width: '100%' }}>
          <Button variant="outlined" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} size="small">Previous</Button>
          <Typography variant="body2" color="text.secondary">Page {currentPage} of {totalPages}</Typography>
          <Button variant="outlined" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} size="small">Next</Button>
        </Box>
      </Box>
      {/* Add Order Modal */}
      {openModal && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, height: '100vh', overflow: 'hidden' }}
        >
          <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, width: 600, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#333' }}>New Order</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: '#666' }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Products *</label>
                  <input type="text" name="products" value={formData.products} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Order Value *</label>
                    <input type="number" step="0.01" name="orderValue" value={formData.orderValue} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Quantity *</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Order ID *</label>
                    <input type="text" name="orderId" value={formData.orderId} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Expected Delivery *</label>
                    <input type="date" name="expectedDelivery" value={formData.expectedDelivery} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', backgroundColor: 'white' }}>
                    {ORDER_STATUS.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: 4, backgroundColor: 'white', color: '#333', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: 4, backgroundColor: '#1976d2', color: 'white', cursor: 'pointer', fontSize: 14 }}>Add Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
