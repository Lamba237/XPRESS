import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CreateData(name, sold_quantity, remaining_quantity, price) {
    return {name, sold_quantity, remaining_quantity, price};
}

/*Declaring a row to hold the table data*/
const rows = [
    CreateData("Surf Excel", 30, 12, '₹100'),
    CreateData("Rin", 21, 15, '₹207'),
    CreateData("Parle G", 19, 17, '₹105'),
    CreateData("Maggi Noodles", 25, 8, '₹85'),
    CreateData("Coca Cola", 18, 22, '₹45'),
    CreateData("Lux Soap", 16, 14, '₹35'),
    CreateData("Tata Salt", 14, 26, '₹25'),
    CreateData("Dove Shampoo", 12, 18, '₹150'),
    CreateData("Kurkure", 11, 13, '₹20'),
    CreateData("Biscuit Gold", 9, 21, '₹40'),
];

export default function TopSelling() {

    // state to control how many items to show
    const [showAll, setShowAll] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);

    //Function to handle "See All" click
    const handleSeeAllClick = () => {
        if (showAll) {
            //If this is true, go back to showing just 3
            setShowAll(false);
            setItemsToShow(3);
        } else { // If the above is not true, do this instead
            setShowAll(true);
            setItemsToShow(rows.length);
        }
    };

    // This gets the rows to display based on current state
    const displayRows = rows.slice(0, itemsToShow);

    return (
        <div className="top-selling-container">
            <div className="table-header">
                <h1>Top Selling Products</h1>
                <p className="see-all" onClick={handleSeeAllClick}>
                    {showAll ? 'See Less' : 'See All'}
                </p>
            </div>
            
            {/* Scrollable container wrapper */}
            <div className={`table-scroll-container ${!showAll ? 'limited' : ''}`}>
                <TableContainer component={Box} sx={{ maxWidth: 650 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Sold Quantity</TableCell>
                                <TableCell align="center">Remaining Quantity</TableCell>
                                <TableCell align="center">Price</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {displayRows.map((row) => (
                                <TableRow 
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.sold_quantity}</TableCell>
                                    <TableCell align="center">{row.remaining_quantity}</TableCell>
                                    <TableCell align="center">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}