import React, { useMemo, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Mock data for Orders table
// Shape: { products: string, orderValue: number, quantity: number, orderId: string, expectedDelivery: string (YYYY-MM-DD), status: 'Delayed'|'Confirmed'|'Returned'|'Out for delivery' }

const ORDER_STATUS = ['All', 'Delayed', 'Confirmed', 'Returned', 'Out for delivery'];

const mockOrders = [
  { products: 'Basmati Rice (5kg), Sunflower Oil (1L)', orderValue: 245.75, quantity: 12, orderId: 'ORD-2025-0001', expectedDelivery: '2025-08-18', status: 'Confirmed' },
  { products: 'Bottled Water (500ml) x24',               orderValue: 96.00,  quantity: 24, orderId: 'ORD-2025-0002', expectedDelivery: '2025-08-19', status: 'Out for delivery' },
  { products: 'Olive Oil (1L), Whole Wheat Bread',       orderValue: 78.40,  quantity: 8,  orderId: 'ORD-2025-0003', expectedDelivery: '2025-08-17', status: 'Delayed' },
  { products: 'Cream-O Biscuits x12',                    orderValue: 54.30,  quantity: 12, orderId: 'ORD-2025-0004', expectedDelivery: '2025-08-21', status: 'Confirmed' },
  { products: 'Premium Green Tea, Yoghurt Cups x6',      orderValue: 88.15,  quantity: 10, orderId: 'ORD-2025-0005', expectedDelivery: '2025-08-22', status: 'Out for delivery' },
  { products: 'Ground Coffee (1kg)',                     orderValue: 132.99, quantity: 5,  orderId: 'ORD-2025-0006', expectedDelivery: '2025-08-20', status: 'Delayed' },
  { products: 'Classic Potato Chips x20',                orderValue: 60.00,  quantity: 20, orderId: 'ORD-2025-0007', expectedDelivery: '2025-08-18', status: 'Confirmed' },
  { products: 'Apple Juice (1L) x10',                    orderValue: 47.50,  quantity: 10, orderId: 'ORD-2025-0008', expectedDelivery: '2025-08-23', status: 'Returned' },
  { products: 'Hand Wash (300ml) x12',                   orderValue: 36.00,  quantity: 12, orderId: 'ORD-2025-0009', expectedDelivery: '2025-08-19', status: 'Out for delivery' },
  { products: 'Dish Soap (1L) x8',                       orderValue: 32.80,  quantity: 8,  orderId: 'ORD-2025-0010', expectedDelivery: '2025-08-24', status: 'Confirmed' },
  { products: 'Laundry Detergent (2kg) x5',              orderValue: 110.00, quantity: 5,  orderId: 'ORD-2025-0011', expectedDelivery: '2025-08-20', status: 'Delayed' },
  { products: 'Tomato Ketchup (750ml) x6',               orderValue: 42.00,  quantity: 6,  orderId: 'ORD-2025-0012', expectedDelivery: '2025-08-21', status: 'Confirmed' },
  { products: 'Table Salt (1kg) x30',                    orderValue: 27.00,  quantity: 30, orderId: 'ORD-2025-0013', expectedDelivery: '2025-08-22', status: 'Out for delivery' },
  { products: 'Black Pepper (100g) x12',                 orderValue: 57.60,  quantity: 12, orderId: 'ORD-2025-0014', expectedDelivery: '2025-08-25', status: 'Returned' },
  { products: 'Granola (500g) x10',                      orderValue: 85.00,  quantity: 10, orderId: 'ORD-2025-0015', expectedDelivery: '2025-08-19', status: 'Confirmed' },
  { products: 'Coconut Oil (500ml) x7',                  orderValue: 52.50,  quantity: 7,  orderId: 'ORD-2025-0016', expectedDelivery: '2025-08-26', status: 'Delayed' },
  { products: 'Green Peas (Frozen) x15',                 orderValue: 75.00,  quantity: 15, orderId: 'ORD-2025-0017', expectedDelivery: '2025-08-21', status: 'Out for delivery' },
  { products: 'Cheddar Cheese (200g) x20',               orderValue: 140.00, quantity: 20, orderId: 'ORD-2025-0018', expectedDelivery: '2025-08-27', status: 'Confirmed' },
  { products: 'Brown Sugar (1kg) x12',                   orderValue: 48.00,  quantity: 12, orderId: 'ORD-2025-0019', expectedDelivery: '2025-08-23', status: 'Delayed' },
  { products: 'Pasta (500g) x24',                        orderValue: 72.00,  quantity: 24, orderId: 'ORD-2025-0020', expectedDelivery: '2025-08-24', status: 'Confirmed' },
  { products: 'Honey (250g) x10',                        orderValue: 65.00,  quantity: 10, orderId: 'ORD-2025-0021', expectedDelivery: '2025-08-28', status: 'Returned' },
  { products: 'Cocoa Powder (200g) x6',                  orderValue: 33.00,  quantity: 6,  orderId: 'ORD-2025-0022', expectedDelivery: '2025-08-22', status: 'Confirmed' },
  { products: 'Yoghurt Cups (125g) x30',                 orderValue: 90.00,  quantity: 30, orderId: 'ORD-2025-0023', expectedDelivery: '2025-08-20', status: 'Out for delivery' },
  { products: 'Peanut Butter (500g) x8',                 orderValue: 88.00,  quantity: 8,  orderId: 'ORD-2025-0024', expectedDelivery: '2025-08-26', status: 'Delayed' },
  { products: 'Canned Tuna (185g) x18',                  orderValue: 81.00,  quantity: 18, orderId: 'ORD-2025-0025', expectedDelivery: '2025-08-23', status: 'Confirmed' },
  { products: 'Bottled Water (500ml) x48',               orderValue: 192.00, quantity: 48, orderId: 'ORD-2025-0026', expectedDelivery: '2025-08-25', status: 'Out for delivery' },
  { products: 'Instant Noodles (Pack) x36',              orderValue: 64.80,  quantity: 36, orderId: 'ORD-2025-0027', expectedDelivery: '2025-08-27', status: 'Confirmed' },
  { products: 'Sunflower Oil (1L) x20',                  orderValue: 140.00, quantity: 20, orderId: 'ORD-2025-0028', expectedDelivery: '2025-08-29', status: 'Delayed' },
  { products: 'Whole Wheat Bread x40',                   orderValue: 100.00, quantity: 40, orderId: 'ORD-2025-0029', expectedDelivery: '2025-08-21', status: 'Returned' },
  { products: 'Apple Juice (1L) x20, Cream-O x10',       orderValue: 120.00, quantity: 30, orderId: 'ORD-2025-0030', expectedDelivery: '2025-08-30', status: 'Confirmed' },
];

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
  // Local orders state to support adding new rows
  const [orders, setOrders] = useState(mockOrders);

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

  // Derived lists: filter first, then paginate
  const filteredOrders = useMemo(() => {
    if (filterStatus === 'All') return orders;
    const s = filterStatus.toLowerCase();
    return orders.filter((o) => (o.status || '').toLowerCase() === s);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      products: formData.products,
      orderValue: parseFloat(formData.orderValue || '0'),
      quantity: parseInt(formData.quantity || '0', 10),
      orderId: formData.orderId,
      expectedDelivery: formData.expectedDelivery,
      status: formData.status,
    };
    setOrders((prev) => [newOrder, ...prev]);
    handleCloseModal();
    setCurrentPage(1);
  };

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
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((o, idx) => (
                <StyledTableRow key={`${o.orderId}-${idx}`}>
                  <TableCell>{o.products}</TableCell>
                  <TableCell>{formatCurrency(o.orderValue)}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>{o.orderId}</TableCell>
                  <TableCell>{formatDate(o.expectedDelivery)}</TableCell>
                  <TableCell><StatusChip status={o.status} /></TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', mt: 3, width: '100%' }}>
          <Button variant="outlined" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} size="small">Previous</Button>
          <Typography variant="body2" color="text.secondary">Page {currentPage} of {totalPages}</Typography>
          <Button variant="outlined" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages} size="small">Next</Button>
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
