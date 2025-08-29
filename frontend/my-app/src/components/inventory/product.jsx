import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getProducts, writeProductData, deleteProduct } from '../../services/database';

// Styled components for custom styling
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.focus,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.product-name': {
        fontWeight: 600,
        color: theme.palette.text.primary,
    },
    '&.buying-price': {
        fontWeight: 500,
        color: theme.palette.success.main,
    },
    '&.quantity': {
        fontWeight: 500,
    },
    '&.threshold-value': {
        color: theme.palette.text.secondary,
    },
    '&.expiry-date': {
        position: 'relative',
    },
}));

const QuantityWarning = styled('span')({
    color: '#d32f2f',
    fontWeight: 'bold',
});

const ExpiryWarning = styled('span')({
    color: '#d32f2f',
    fontWeight: 'bold',
});

const WarningIndicator = styled('span')({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    backgroundColor: '#ff9800',
    borderRadius: '50%',
    marginLeft: '8px',
});

export default function Product() {
    // State: products fetched from Firebase
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modal State
    const [openModal, setOpenModal] = useState(false);

    // Filter State
    const [filterAvailability, setFilterAvailability] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        product: '',
        buyingPrice: '',
        quantity: '',
        expiryDate: '',
        thresholdValue: '',
        availability: 'In Stock'
    });

    // Load products from Firebase
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const snapshot = await getProducts();
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.values(data || {});
                // Optional: sort by lastUpdated desc
                list.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
                setProducts(list);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to load products', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Pagination calculations (after filtering)
    const filteredProducts = filterAvailability === 'All'
        ? products
        : products.filter(p => (p.availability || '').toLowerCase() === filterAvailability.toLowerCase());

    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({
            product: '',
            buyingPrice: '',
            quantity: '',
            expiryDate: '',
            thresholdValue: '',
            availability: 'In Stock'
        });
    };

    // Disable background scroll when modal open
    useEffect(() => {
        document.body.style.overflow = openModal ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [openModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const product = {
                product: formData.product.trim(),
                buyingPrice: parseFloat(formData.buyingPrice) || 0,
                quantity: parseInt(formData.quantity, 10) || 0,
                thresholdValue: parseInt(formData.thresholdValue, 10) || 0,
                expiryDate: formData.expiryDate,
                availability: formData.availability
            };
            await writeProductData(product);
            handleCloseModal();
            setCurrentPage(1);
            await loadProducts();
        } catch (err) {
            console.error('Failed to add product', err);
            setError('Failed to add product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (err) {
            console.error('Delete failed', err);
            setError('Failed to delete product');
        }
    };

    const handleFilterToggle = () => setShowFilterDropdown(v => !v);
    const handleFilterChange = (availability) => {
        setFilterAvailability(availability);
        setShowFilterDropdown(false);
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterDropdown && !event.target.closest('.filter-container')) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterDropdown]);

    const handleDownload = () => {
        if (!filteredProducts.length) return;
        const dataToDownload = filteredProducts.map(product => ({
            'Product Name': product.product,
            'Buying Price': product.buyingPrice,
            'Quantity': product.quantity,
            'Threshold Value': product.thresholdValue,
            'Expiry Date': product.expiryDate,
            'Availability': product.availability
        }));
        const headers = Object.keys(dataToDownload[0]);
        const csvContent = [
            headers.join(','),
            ...dataToDownload.map(row => headers.map(h => {
                const value = row[h];
                return (typeof value === 'string' && value.includes(',')) ? `"${value}"` : value;
            }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const currentDate = new Date().toISOString().split('T')[0];
        const filterSuffix = filterAvailability !== 'All' ? `_${filterAvailability.replace(' ', '_')}` : '';
        link.download = `products_inventory_${currentDate}${filterSuffix}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



  

   

    // Helper functions for styling
    const getAvailabilityChipProps = (availability) => {
        switch (availability.toLowerCase()) {
            case 'in stock': 
                return { 
                    label: availability,
                    sx: { 
                        color: '#2e7d32', // green color
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            color: '#2e7d32'
                        }
                    }
                };
            case 'low stock': 
                return { 
                    label: availability,
                    sx: { 
                        color: '#f57f17', // yellow color
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            color: '#f57f17'
                        }
                    }
                };
            case 'out of stock': 
                return { 
                    label: availability,
                    sx: { 
                        color: '#ff9800', // orange color
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            color: '#ff9800'
                        }
                    }
                };
            case 'critical': 
                return { 
                    label: availability,
                    sx: { 
                        color: '#d32f2f', // red color
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            color: '#d32f2f'
                        }
                    }
                };
            default: 
                return { 
                    label: availability,
                    sx: { 
                        color: '#2e7d32', // green color
                        backgroundColor: 'transparent',
                        border: 'none',
                        '& .MuiChip-label': {
                            color: '#2e7d32'
                        }
                    }
                };
        }
    };

    const isExpiringSoon = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const timeDiff = expiry.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 90; // Expiring within 90 days
    };

    const isThresholdReached = (quantity, threshold) => {
        if (quantity == null || threshold == null || isNaN(quantity) || isNaN(threshold)) return false;
        return Number(quantity) <= Number(threshold);
    };

    const formatCurrency = (amount) => {
        if (amount === '' || amount === null || amount === undefined) return '';
        const num = typeof amount === 'number' ? amount : parseFloat(amount);
        if (!isFinite(num)) return '';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
  
    // Static table layout (matches supplier table style) – all columns always shown
    const renderQuantityCell = (p) => {
        if (p.quantity === '' || p.quantity === undefined || p.quantity === null) return '';
        return isThresholdReached(p.quantity, p.thresholdValue) ? (
            <>
                <QuantityWarning>{p.quantity}</QuantityWarning>
                <WarningIndicator />
            </>
        ) : p.quantity;
    };

    const renderExpiryCell = (p) => {
        if (!p.expiryDate) return '';
        return isExpiringSoon(p.expiryDate) ? (
            <>
                <ExpiryWarning>{formatDate(p.expiryDate)}</ExpiryWarning>
                <WarningIndicator />
            </>
        ) : formatDate(p.expiryDate);
    };


    return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }} className="product-container">
            <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <div id="header-table">
                        <h1>Products</h1>
                        <div className="btn-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button id="add-product" onClick={handleOpenModal}>Add Product</button>
                            <div className="filter-container" style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                    id="filters"
                                    onClick={handleFilterToggle}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: showFilterDropdown ? '#f0f0f0' : 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <img src="../src/assets/inventory/Filterslines.svg" alt="Filter" />
                                    Filters
                                </button>
                                {showFilterDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        marginTop: '4px',
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        zIndex: 1000,
                                        minWidth: '150px'
                                    }}>
                                        <div style={{ padding: '8px 0' }}>
                                            <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                                                Filter by Availability:
                                            </div>
                                            {['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Critical'].map(a => (
                                                <button
                                                    key={a}
                                                    onClick={() => handleFilterChange(a)}
                                                    style={{
                                                        color: '#000',
                                                        width: '100%',
                                                        padding: '8px 12px',
                                                        border: 'none',
                                                        backgroundColor: filterAvailability === a ? '#fff' : '#eee',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        fontSize: '14px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                >
                                                    {a} {filterAvailability === a && '✓'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                id="download-all"
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Download all
                            </button>
                            <button
                                onClick={loadProducts}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    background: 'blue',
                                    cursor: 'pointer'
                                }}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    {filterAvailability !== 'All' && (
                        <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            backgroundColor: '#e3f2fd',
                            border: '1px solid #2196f3',
                            borderRadius: '4px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>Showing products with availability: <strong>{filterAvailability}</strong></span>
                            <button
                                onClick={() => handleFilterChange('All')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2196f3',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '14px'
                                }}
                            >
                                Clear filter
                            </button>
                        </div>
                    )}
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
                    )}
                </Box>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                )}
                {!loading && currentItems.length > 0 && (
                    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 0, width: '100%', overflowX: 'auto' }}>
                        <Table sx={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }} aria-label="products table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buying Price</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Threshold Value</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expiry Date</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Availability</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems
                                    .filter(p => {
                                        const hasText = (v) => typeof v === 'string' && v.trim() !== '';
                                        const hasNumber = (v) => typeof v === 'number' && !isNaN(v);
                                        const hasQuantity = p.quantity !== undefined && p.quantity !== null && p.quantity !== '';
                                        const hasThreshold = p.thresholdValue !== undefined && p.thresholdValue !== null && p.thresholdValue !== '';
                                        return (
                                            hasText(p.product) ||
                                            hasNumber(p.buyingPrice) ||
                                            hasQuantity ||
                                            hasThreshold ||
                                            hasText(p.expiryDate) ||
                                            hasText(p.availability)
                                        );
                                    })
                                    .map(product => (
                                    <StyledTableRow key={product.id}>
                                        <StyledTableCell className="product-name">{product.product || ''}</StyledTableCell>
                                        <StyledTableCell className="buying-price">{formatCurrency(product.buyingPrice)}</StyledTableCell>
                                        <StyledTableCell className="quantity">{renderQuantityCell(product)}</StyledTableCell>
                                        <StyledTableCell className="threshold-value">{product.thresholdValue ?? ''}</StyledTableCell>
                                        <StyledTableCell className="expiry-date">{renderExpiryCell(product)}</StyledTableCell>
                                        <StyledTableCell>
                                            {product.availability ? (
                                                <Chip {...getAvailabilityChipProps(product.availability)} size="small" sx={{ minWidth: 80 }} />
                                            ) : ''}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <button
                                                onClick={() => handleDelete(product.id)}
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
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {currentItems.filter(p => {
                                    const hasText = (v) => typeof v === 'string' && v.trim() !== '';
                                    const hasNumber = (v) => typeof v === 'number' && !isNaN(v);
                                    const hasQuantity = p.quantity !== undefined && p.quantity !== null && p.quantity !== '';
                                    const hasThreshold = p.thresholdValue !== undefined && p.thresholdValue !== null && p.thresholdValue !== '';
                                    return (
                                        hasText(p.product) ||
                                        hasNumber(p.buyingPrice) ||
                                        hasQuantity ||
                                        hasThreshold ||
                                        hasText(p.expiryDate) ||
                                        hasText(p.availability)
                                    );
                                }).length < itemsPerPage && (
                                    <TableRow style={{ height: 30 * (itemsPerPage - currentItems.filter(p => {
                                        const hasText = (v) => typeof v === 'string' && v.trim() !== '';
                                        const hasNumber = (v) => typeof v === 'number' && !isNaN(v);
                                        const hasQuantity = p.quantity !== undefined && p.quantity !== null && p.quantity !== '';
                                        const hasThreshold = p.thresholdValue !== undefined && p.thresholdValue !== null && p.thresholdValue !== '';
                                        return (
                                            hasText(p.product) ||
                                            hasNumber(p.buyingPrice) ||
                                            hasQuantity ||
                                            hasThreshold ||
                                            hasText(p.expiryDate) ||
                                            hasText(p.availability)
                                        );
                                    }).length) }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {!loading && !products.length && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">No products yet. Click "Add Product" to create one.</Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', mt: 3, width: '100%' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        size="small"
                    >
                        Previous
                    </Button>
                    <Typography variant="body2" color="text.secondary">Page {currentPage} of {totalPages}</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        size="small"
                    >
                        Next
                    </Button>
                </Box>
            </Box>

            {openModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, height: '100vh', overflow: 'hidden'
                    }}
                >
                    <div className="modal-content" style={{
                        backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>New Product</h2>
                            <button
                                onClick={handleCloseModal}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', color: '#666' }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Product Name *</label>
                                    <input
                                        type="text"
                                        name="product"
                                        value={formData.product}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Buying Price *</label>
                                        <input
                                            type="number"
                                            name="buyingPrice"
                                            step="0.01"
                                            value={formData.buyingPrice}
                                            onChange={handleInputChange}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Quantity *</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Threshold Value *</label>
                                        <input
                                            type="number"
                                            name="thresholdValue"
                                            value={formData.thresholdValue}
                                            onChange={handleInputChange}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Expiry Date *</label>
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Availability *</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', color: '#333', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
