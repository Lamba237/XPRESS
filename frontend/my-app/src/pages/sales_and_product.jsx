import React, { useState, useEffect, useMemo } from 'react';
import '../styles/sales_and_product.css';
import {
    Box,
    Paper,
    Table, TableHead, TableBody, TableRow, TableCell,
    TextField,
    Button,
    Chip,
    Typography,
    Divider,
} from '@mui/material';

// LocalStorage keys
const LS_INVENTORY_KEY = 'inventoryProducts';
const LS_SALES_KEY = 'salesHistory';

// Seed data (only if none exists yet)
const seedProducts = [
    { id: 1, product: 'Classic Potato Chips', buyingPrice: 120, quantity: 85, thresholdValue: 20, expiryDate: '2025-12-31', availability: 'In Stock' },
    { id: 2, product: 'Cream-O Biscuits', buyingPrice: 90, quantity: 64, thresholdValue: 15, expiryDate: '2025-10-15', availability: 'In Stock' },
    { id: 3, product: 'Tata Salt', buyingPrice: 70, quantity: 120, thresholdValue: 30, expiryDate: '2026-01-10', availability: 'In Stock' },
    { id: 4, product: 'Horlicks Malt', buyingPrice: 450, quantity: 42, thresholdValue: 10, expiryDate: '2025-09-05', availability: 'Low Stock' },
];

function loadInventory() {
    try {
        const raw = localStorage.getItem(LS_INVENTORY_KEY);
        if (!raw) {
            localStorage.setItem(LS_INVENTORY_KEY, JSON.stringify(seedProducts));
            return [...seedProducts];
        }
        return JSON.parse(raw) || [];
    } catch {
        return [...seedProducts];
    }
}

function saveInventory(data) {
    localStorage.setItem(LS_INVENTORY_KEY, JSON.stringify(data));
}

function saveSale(sale) {
    const prev = JSON.parse(localStorage.getItem(LS_SALES_KEY) || '[]');
    prev.unshift(sale);
    localStorage.setItem(LS_SALES_KEY, JSON.stringify(prev));
}

function loadSalesHistory() {
    try {
        return JSON.parse(localStorage.getItem(LS_SALES_KEY) || '[]');
    } catch {
        return [];
    }
}

function availabilityFrom(quantity, threshold) {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= threshold) return 'Critical';
    if (quantity <= threshold * 1.5) return 'Low Stock';
    return 'In Stock';
}

function formatCurrency(v) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);
}

function generateInvoiceId() {
    const ts = Date.now().toString(36).toUpperCase();
    return 'INV-' + ts.slice(-6);
}

const availabilityChip = (availability) => {
    switch (availability) {
        case 'In Stock': return { color: 'success', label: 'In Stock' };
        case 'Low Stock': return { color: 'warning', label: 'Low Stock' };
        case 'Critical': return { color: 'error', label: 'Critical' };
        case 'Out of Stock': return { color: 'error', label: 'Out' };
        default: return { color: 'default', label: availability };
    }
};

export default function SalesAndProduct() {
    const [inventory, setInventory] = useState(() => loadInventory());
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]); // {id, product, unitPrice, quantity, max}
    const [submitting, setSubmitting] = useState(false);
    const [salesHistory, setSalesHistory] = useState(() => loadSalesHistory());

    // Filter inventory by search
    const filteredInventory = useMemo(() => {
        const q = search.trim().toLowerCase();
        return inventory.filter(p => !q || p.product.toLowerCase().includes(q));
    }, [inventory, search]);

    const subtotal = useMemo(
        () => cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
        [cart]
    );

    const handleAdd = (product) => {
        if (product.quantity <= 0) return;
        setCart(prev => {
            if (prev.some(i => i.id === product.id)) return prev;
            return [...prev, {
                id: product.id,
                product: product.product,
                unitPrice: product.buyingPrice,
                quantity: 1,
                max: product.quantity
            }];
        });
    };

    const handleQuantityChange = (id, val) => {
        setCart(prev =>
            prev.map(item => {
                if (item.id !== id) return item;
                let q = Number(val) || 0;
                if (q < 1) q = 1;
                if (q > item.max) q = item.max;
                return { ...item, quantity: q };
            })
        );
    };

    const handleRemoveLine = (id) => setCart(prev => prev.filter(i => i.id !== id));
    const handleCancel = () => setCart([]);

    const handleCompleteSale = () => {
        if (cart.length === 0) return;
        setSubmitting(true);

        let ok = true;
        const newInventory = inventory.map(p => {
            const line = cart.find(c => c.id === p.id);
            if (!line) return p;
            if (line.quantity > p.quantity) {
                ok = false;
                return p;
            }
            const newQty = p.quantity - line.quantity;
            return {
                ...p,
                quantity: newQty,
                availability: availabilityFrom(newQty, p.thresholdValue || 0),
            };
        });

        if (!ok) {
            setSubmitting(false);
            return;
        }

        const saleRecord = {
            id: generateInvoiceId(),
            timestamp: new Date().toISOString(),
            items: cart.map(l => ({
                productId: l.id,
                product: l.product,
                unitPrice: l.unitPrice,
                quantity: l.quantity,
                lineTotal: l.unitPrice * l.quantity,
            })),
            subtotal,
        };

        // Simulate slight processing delay
        setTimeout(() => {
            setInventory(newInventory);
            saveInventory(newInventory);
            saveSale(saleRecord);
            setSalesHistory(prev => [saleRecord, ...prev]);
            setCart([]);
            setSubmitting(false);
        }, 250);
    };

    // External tab sync
    useEffect(() => {
        const sync = () => setInventory(loadInventory());
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    // Keep cart max & adjust quantity if inventory changed
    useEffect(() => {
        setCart(prev =>
            prev.map(line => {
                const inv = inventory.find(p => p.id === line.id);
                if (!inv) return line;
                const max = inv.quantity;
                let qty = line.quantity;
                if (qty > max) qty = max;
                return { ...line, max, quantity: qty };
            })
        );
    }, [inventory]);

    // Remaining after sale preview
    const remainingMap = useMemo(() => {
        const map = {};
        cart.forEach(line => {
            const inv = inventory.find(p => p.id === line.id);
            if (inv) map[line.id] = inv.quantity - line.quantity;
        });
        return map;
    }, [cart, inventory]);

    // Sales summary derived data
    const salesSummary = useMemo(() => {
        const totalSales = salesHistory.length;
        let totalRevenue = 0;
        let totalItemsSold = 0;
        for (const sale of salesHistory) {
            totalRevenue += sale.subtotal || 0;
            if (Array.isArray(sale.items)) {
                for (const it of sale.items) totalItemsSold += it.quantity || 0;
            }
        }
        return { totalSales, totalRevenue, totalItemsSold };
    }, [salesHistory]);

    return (
            <div className="sales-and-product-container">
                <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <h1 style={{ margin: 0, marginBottom: '16px' }}>Sales & Products</h1>
                    {/* Full-width summary cards row */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', marginBottom: '20px' }}>
                        <div style={{ flex: 1, padding: '14px 18px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, minWidth: 180, boxSizing: 'border-box' }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#555', marginBottom: 6 }}>Total Sales</div>
                            <div style={{ fontSize: 26, fontWeight: 600 }}>{salesSummary.totalSales}</div>
                        </div>
                        <div style={{ flex: 1, padding: '14px 18px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, minWidth: 180, boxSizing: 'border-box' }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#555', marginBottom: 6 }}>Items Sold</div>
                            <div style={{ fontSize: 26, fontWeight: 600 }}>{salesSummary.totalItemsSold}</div>
                        </div>
                        <div style={{ flex: 1, padding: '14px 18px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, minWidth: 220, boxSizing: 'border-box' }}>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#555', marginBottom: 6 }}>Revenue</div>
                            <div style={{ fontSize: 26, fontWeight: 600 }}>{formatCurrency(salesSummary.totalRevenue)}</div>
                        </div>
                    </div>
                    {/* Search bar row */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                        <TextField
                            size="small"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                flex: '0 0 55%',
                                width: '55%',
                                height: 'px',
                                minWidth: 260,
                                '& .MuiOutlinedInput-root': {
                                    height: 32,
                                    fontSize: 14,
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '4px 8px',
                                },
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => setSearch('')}
                            disabled={!search}
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            Clear
                        </Button>
                    </div>
                </Box>

            {/* Layout: stack panels vertically so Current Sale wraps to next line */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Inventory Table */}
                    <Paper sx={{ p: 2, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Inventory</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Table size="small" stickyHeader aria-label="inventory table" sx={{ borderCollapse: 'collapse' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Product</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Price</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Qty</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Avail.</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInventory.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filteredInventory.map(p => {
                                    const chip = availabilityChip(p.availability);
                                    const forceWhite = p.product === 'Cream-O Biscuits' || p.product === 'Tata Salt';
                                    return (
                                        <TableRow key={p.id} hover>
                                            <TableCell sx={{ fontSize: 14 }}>{p.product}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 14 }}>{formatCurrency(p.buyingPrice)}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: 14 }}>{p.quantity}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    size="small"
                                                    label={chip.label}
                                                    {...(!forceWhite ? { color: chip.color } : {})}
                                                    sx={forceWhite ? { backgroundColor: '#fff', border: '1px solid #e0e0e0', color: '#333' } : {}}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    disabled={p.quantity <= 0 || cart.some(c => c.id === p.id)}
                                                    onClick={() => handleAdd(p)}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {p.quantity <= 0 ? 'Out' : cart.some(c => c.id === p.id) ? 'Added' : 'Add'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/* Cart / Sale Panel */}
                    <Paper sx={{ p: 2, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Current Sale</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Table size="small" sx={{ mb: 2 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Product</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Qty</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Unit</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Total</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center"> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                            Cart is empty.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {cart.map(line => (
                                    <TableRow key={line.id} hover>
                                        <TableCell sx={{ fontSize: 14 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{line.product}</span>
                                                <span style={{ fontSize: 11, color: '#666' }}>
                                                    Remaining after sale: {remainingMap[line.id] ?? line.max}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <input
                                                type="number"
                                                value={line.quantity}
                                                min={1}
                                                max={line.max}
                                                onChange={(e) => handleQuantityChange(line.id, e.target.value)}
                                                style={{
                                                    width: '70px',
                                                    padding: '4px 6px',
                                                    fontSize: '14px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontSize: 14 }}>{formatCurrency(line.unitPrice)}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: 14 }}>{formatCurrency(line.unitPrice * line.quantity)}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveLine(line.id)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Items: {cart.reduce((s, l) => s + l.quantity, 0)}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Subtotal: {formatCurrency(subtotal)}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                disabled={cart.length === 0 || submitting}
                                onClick={handleCancel}
                                size="small"
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                disabled={cart.length === 0 || submitting}
                                onClick={handleCompleteSale}
                                size="small"
                                sx={{ textTransform: 'none' }}
                            >
                                {submitting ? 'Processing...' : 'Complete Sale'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </div>
    );
}