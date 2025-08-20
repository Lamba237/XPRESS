import { useState, useEffect } from 'react'; // Used to manage states
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
    Pagination,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';


// Sample product data with required files
const initialProducts = [
    { 
        id: 1, 
        product: 'Laptop Dell XPS 13', 
        buyingPrice: 1199.99, 
        quantity: 15, 
        thresholdValue: 5, 
        expiryDate: '2026-12-31', 
        availability: 'In Stock' 
    },
    { 
        id: 2, 
        product: 'iPhone 14 Pro Max', 
        buyingPrice: 899.99, 
        quantity: 8, 
        thresholdValue: 10, 
        expiryDate: '2025-08-15', 
        availability: 'Low Stock' 
    },
    { 
        id: 3, 
        product: 'Samsung Galaxy Buds Pro', 
        buyingPrice: 149.99, 
        quantity: 45, 
        thresholdValue: 15, 
        expiryDate: '2025-03-22', 
        availability: 'In Stock' 
    },
    { 
        id: 4, 
        product: 'MacBook Pro M2 14"', 
        buyingPrice: 1799.99, 
        quantity: 3, 
        thresholdValue: 5, 
        expiryDate: '2027-01-10', 
        availability: 'Critical' 
    },
    { 
        id: 5, 
        product: 'Sony WH-1000XM5 Headphones', 
        buyingPrice: 279.99, 
        quantity: 22, 
        thresholdValue: 8, 
        expiryDate: '2025-11-05', 
        availability: 'In Stock' 
    },
    { 
        id: 6, 
        product: 'iPad Air 5th Gen', 
        buyingPrice: 549.99, 
        quantity: 12, 
        thresholdValue: 6, 
        expiryDate: '2026-07-18', 
        availability: 'In Stock' 
    },
    { 
        id: 7, 
        product: 'Nintendo Switch OLED', 
        buyingPrice: 299.99, 
        quantity: 0, 
        thresholdValue: 10, 
        expiryDate: '2024-12-31', 
        availability: 'Out of Stock' 
    },
    { 
        id: 8, 
        product: 'Apple Watch Series 8', 
        buyingPrice: 349, 
        quantity: 18, 
        thresholdValue: 12, 
        expiryDate: '2025-09-30', 
        availability: 'In Stock' 
    },
    { 
        id: 9, 
        product: 'Canon EOS R6 Mark II', 
        buyingPrice: 229, 
        quantity: 4, 
        thresholdValue: 3, 
        expiryDate: '2027-05-14', 
        availability: 'Low Stock' 
    },
    { 
        id: 10, 
        product: 'Google Pixel 7 Pro', 
        buyingPrice: 699, 
        quantity: 25, 
        thresholdValue: 8, 
        expiryDate: '2025-06-20', 
        availability: 'In Stock' 
    },
    { 
        id: 11, 
        product: 'Microsoft Surface Pro 9', 
        buyingPrice: 999, 
        quantity: 7, 
        thresholdValue: 10, 
        expiryDate: '2026-10-12', 
        availability: 'Low Stock' 
    },
    { 
        id: 12, 
        product: 'Amazon Echo Dot 5th Gen', 
        buyingPrice: 39, 
        quantity: 67, 
        thresholdValue: 20, 
        expiryDate: '2025-04-08', 
        availability: 'In Stock' 
    },
    { 
        id: 13, 
        product: 'Tesla Model S Plaid Toy', 
        buyingPrice: 89, 
        quantity: 89, 
        thresholdValue: 25, 
        expiryDate: '2025-12-15', 
        availability: 'In Stock' 
    },
    { 
        id: 14, 
        product: 'LG OLED C2 55" TV', 
        buyingPrice: 129,
        quantity: 6, 
        thresholdValue: 4, 
        expiryDate: '2026-03-28', 
        availability: 'In Stock' 
    },
    { 
        id: 15, 
        product: 'Dyson V15 Detect Vacuum', 
        buyingPrice: 64, 
        quantity: 14, 
        thresholdValue: 8, 
        expiryDate: '2026-08-11', 
        availability: 'In Stock' 
    },
    { 
        id: 16, 
        product: 'PlayStation 5 Console', 
        buyingPrice: 44, 
        quantity: 2, 
        thresholdValue: 5, 
        expiryDate: '2025-01-30', 
        availability: 'Critical' 
    },
    { 
        id: 17, 
        product: 'Bose QuietComfort Earbuds', 
        buyingPrice: 22, 
        quantity: 33, 
        thresholdValue: 15, 
        expiryDate: '2025-07-22', 
        availability: 'In Stock' 
    },
    { 
        id: 18, 
        product: 'KitchenAid Stand Mixer', 
        buyingPrice: 27, 
        quantity: 11, 
        thresholdValue: 6, 
        expiryDate: '2026-11-03', 
        availability: 'In Stock' 
    },
    { 
        id: 19, 
        product: 'Fitbit Versa 4 Smartwatch', 
        buyingPrice: 17, 
        quantity: 56, 
        thresholdValue: 20, 
        expiryDate: '2025-05-17', 
        availability: 'In Stock' 
    },
    { 
        id: 20, 
        product: 'GoPro Hero 11 Black', 
        buyingPrice: 39, 
        quantity: 19, 
        thresholdValue: 12, 
        expiryDate: '2025-10-09', 
        availability: 'In Stock' 
    },
];

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
    // Products State
    const [sampleProducts, setSampleProducts] = useState(initialProducts);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Show 8 items per page

    // Modal State
    const [openModal, setOpenModal] = useState(false);
    
    // Filter State
    const [filterAvailability, setFilterAvailability] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        product: '',
        productId: '',
        category: '',
        buyingPrice: '',
        quantity: '',
        unit: '',
        expiryDate: '',
        thresholdValue: '',
        availability: 'In Stock'
    });

    // This is use to calculate pagination values
    const filteredProducts = filterAvailability === 'All' 
        ? sampleProducts 
        : sampleProducts.filter(product => product.availability === filterAvailability);
    
    const totalItems = filteredProducts.length; // Get the length of the filtered products
    const totalPages = Math.ceil(totalItems / itemsPerPage); // then from there, determine the number of pages

    // Calculate which items to show
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, endIndex);

    // Modal and Form Handlers
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({
            product: '',
            productId: '',
            category: '',
            buyingPrice: '',
            quantity: '',
            unit: '',
            expiryDate: '',
            thresholdValue: '',
            availability: 'In Stock'
        });
    };

    // Disable background scroll when modal is open
    useEffect(() => {
        if (openModal) {
            // Disable scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Enable scroll
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is enabled when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create new product with auto-generated ID
        const newProduct = {
            id: sampleProducts.length + 1, // Simple ID generation
            product: formData.product,
            buyingPrice: parseFloat(formData.buyingPrice),
            quantity: parseInt(formData.quantity),
            thresholdValue: parseInt(formData.thresholdValue),
            expiryDate: formData.expiryDate,
            availability: formData.availability
        };
        
        // Add new product to the beginning of the array
        setSampleProducts(prevProducts => [newProduct, ...prevProducts]);
        
        // Log for debugging
        console.log('New Product Added:', newProduct);
        
        // Close modal after submission
        handleCloseModal();
        
        // Reset to first page to show the new product
        setCurrentPage(1);
    };

    // Filter Handlers
    const handleFilterToggle = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleFilterChange = (availability) => {
        setFilterAvailability(availability);
        setShowFilterDropdown(false);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterDropdown && !event.target.closest('.filter-container')) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterDropdown]);

    // Download Handler
    const handleDownload = () => {
        // Prepare data for download (use filtered products)
        const dataToDownload = filteredProducts.map(product => ({
            'Product Name': product.product,
            'Buying Price': product.buyingPrice,
            'Quantity': product.quantity,
            'Threshold Value': product.thresholdValue,
            'Expiry Date': product.expiryDate,
            'Availability': product.availability
        }));

        // Convert to CSV format
        const headers = Object.keys(dataToDownload[0]);
        const csvContent = [
            headers.join(','), // Header row
            ...dataToDownload.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Wrap values containing commas in quotes
                    return typeof value === 'string' && value.includes(',') 
                        ? `"${value}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        
        // Generate filename with current date and filter status
        const currentDate = new Date().toISOString().split('T')[0];
        const filterSuffix = filterAvailability !== 'All' ? `_${filterAvailability.replace(' ', '_')}` : '';
        const filename = `products_inventory_${currentDate}${filterSuffix}.csv`;
        
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Downloaded ${dataToDownload.length} products as ${filename}`);
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
        return quantity <= threshold;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
  

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }} className="product-container">
            <Box sx={{ p: 3 }}>
            {/**Table Header */}
            <Box sx={{ mb: 3 }}>
                <div id="header-table">
                    <h1>Products</h1>
                    <div className="btn-container">
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
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1000,
                                    minWidth: '150px'
                                }}>
                                    <div style={{ padding: '8px 0' }}>
                                        <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
                                            Filter by Availability:
                                        </div>
                                        {['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Critical'].map((availability) => (
                                            <button
                                                key={availability}
                                                onClick={() => handleFilterChange(availability)}
                                                style={{
                                                    color: "#000",
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    border: 'none',
                                                    backgroundColor: filterAvailability === availability ? '#fff' : '#eee',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (filterAvailability !== availability) {
                                                        e.target.style.backgroundColor = 'green';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (filterAvailability !== availability) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                {availability} {filterAvailability === availability && '✓'}
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
                        </button>                    </div>
                </div>
                {/**buttons to add new products, filter and also download existing table */}
                
                {/* Filter Status */}
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
            </Box>

            {/************************ */}
            {/**<<<<<<<<Table >>>>>>>>>*/}
            {/************************ */}

            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 0 }}>
                <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="products table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Products</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buying Price</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Threshold Value</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expiry Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Availability</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {currentItems.map((product) => (
                            <StyledTableRow
                                key={product.id}
                            >
                                <StyledTableCell className="product-name">
                                    {product.product}
                                </StyledTableCell>
                                <StyledTableCell className="buying-price">
                                    {formatCurrency(product.buyingPrice)}
                                </StyledTableCell>
                                <StyledTableCell className="quantity">
                                    {isThresholdReached(product.quantity, product.thresholdValue) ? (
                                        <>
                                            <QuantityWarning>{product.quantity}</QuantityWarning>
                                            <WarningIndicator />
                                        </>
                                    ) : (
                                        product.quantity
                                    )}
                                </StyledTableCell>
                                <StyledTableCell className="threshold-value">
                                    {product.thresholdValue}
                                </StyledTableCell>
                                <StyledTableCell className="expiry-date">
                                    {isExpiringSoon(product.expiryDate) ? (
                                        <>
                                            <ExpiryWarning>{formatDate(product.expiryDate)}</ExpiryWarning>
                                            <WarningIndicator />
                                        </>
                                    ) : (
                                        formatDate(product.expiryDate)
                                    )}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Chip 
                                        {...getAvailabilityChipProps(product.availability)}
                                        size="small"
                                        sx={{ minWidth: 80 }}
                                    />
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/**Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', mt: 3, width: '100%' }}>
                <Button
                    variant="outlined"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    size="small"
                >
                    Previous
                </Button>
                
                <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {totalPages}
                </Typography>
                
                <Button
                    variant="outlined"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    size="small"
                >
                    Next
                </Button>
            </Box>
            </Box>
            
            {/* Add Product Modal */}
            {openModal && (
                <div 
                    className="modal-overlay" 
                    onClick={(e) => {
                        // Close modal when clicking backdrop
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        height: '100vh',
                        overflow: 'hidden'
                    }}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '600px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                    }}>
                        <div className="modal-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}>
                                New Product
                            </h2>
                            <button 
                                onClick={handleCloseModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    color: '#666'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ 
                                        display: '', 
                                        marginBottom: '8px', 
                                        fontWeight: '500',
                                        color: '#333',
                                        width: '110px'
                                    }}>
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="product"
                                        value={formData.product}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '500',
                                            color: '#333',
                                            width: '110px'
                                        }}>
                                            Buying Price *
                                        </label>
                                        <input
                                            type="number"
                                            name="buyingPrice"
                                            step="0.01"
                                            value={formData.buyingPrice}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '500',
                                            color: '#333'
                                        }}>
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '500',
                                            color: '#333',
                                            width: '110px',
                                            height: '24px'
                                        }}>
                                            Threshold Value *
                                        </label>
                                        <input
                                            type="number"
                                            name="thresholdValue"
                                            value={formData.thresholdValue}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '500',
                                            color: '#333',
                                            width: '110px'
                                        }}>
                                            Expiry Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        fontWeight: '500',
                                        color: '#333'
                                    }}>
                                        Availability *
                                    </label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                gap: '12px', 
                                marginTop: '24px' 
                            }}>
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        color: '#333',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#f8f8f8'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}