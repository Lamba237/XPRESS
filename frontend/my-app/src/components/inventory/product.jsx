import { useState } from 'react'; // Used to manage states
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
const sampleProducts = [
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
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Show 8 items per page

    // This is use to calculate pagination values
    const totalItems = sampleProducts.length; // Get the length of the sample products
    const totalPages = Math.ceil(totalItems / itemsPerPage); // then from there, determine the number of pages

    // Calculate which items to show
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sampleProducts.slice(startIndex, endIndex);



  

   

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
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
            <Box sx={{ p: 3 }}>
            {/**Table Header */}
            <Box sx={{ mb: 3 }}>
                <div id="header-table">
                    <h1>Products</h1>
                </div>
                {/**buttons to add new products, filter and also download existing table */}
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
        </div>
    )
}