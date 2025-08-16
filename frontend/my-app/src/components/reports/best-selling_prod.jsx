import { useState } from 'react';
export const bestSellingProducts = [
  { product: 'Classic Potato Chips', productId: 'PRD-0001', category: 'Snacks', remainingQuantity: 85, turnover: 48200, increasedBy: 8.4 },
  { product: 'Cream-O Biscuits',     productId: 'PRD-0002', category: 'Snacks', remainingQuantity: 64, turnover: 35680, increasedBy: 6.1 },
  { product: 'Tata Salt',             productId: 'PRD-0003', category: 'Groceries', remainingQuantity: 120, turnover: 22850, increasedBy: 3.2 },
  { product: 'Horlicks Malt',        productId: 'PRD-0004', category: 'Beverages', remainingQuantity: 42, turnover: 31990, increasedBy: 5.7 },
  { product: 'Premium Green Tea',     productId: 'PRD-0005', category: 'Beverages', remainingQuantity: 73, turnover: 26140, increasedBy: 4.6 },
  { product: 'Whole Wheat Bread',    productId: 'PRD-0006', category: 'Bakery', remainingQuantity: 38, turnover: 19420, increasedBy: 2.9 },
  { product: 'Organic Brown Rice',    productId: 'PRD-0007', category: 'Groceries', remainingQuantity: 27, turnover: 41560, increasedBy: 7.8 },
  { product: 'Olive Oil',              productId: 'PRD-0008', category: 'Groceries', remainingQuantity: 33, turnover: 53400, increasedBy: 9.5 },
  { product: 'Instant Noodles',       productId: 'PRD-0009', category: 'Snacks', remainingQuantity: 210, turnover: 28970, increasedBy: 4.1 },
  { product: 'Chocolate Bar',         productId: 'PRD-0010', category: 'Confectionery', remainingQuantity: 160, turnover: 24880, increasedBy: 3.7 },
  { product: 'Hand Wash',           productId: 'PRD-0011', category: 'Personal Care', remainingQuantity: 58, turnover: 31240, increasedBy: 6.9 },
  { product: 'Dish Soap',           productId: 'PRD-0012', category: 'Home Care', remainingQuantity: 66, turnover: 27410, increasedBy: 3.5 },
  { product: 'Laundry Detergent',     productId: 'PRD-0013', category: 'Home Care', remainingQuantity: 41, turnover: 46230, increasedBy: 7.2 },
  { product: 'Bottled Water',        productId: 'PRD-0014', category: 'Beverages', remainingQuantity: 190, turnover: 22160, increasedBy: 2.4 },
  { product: 'Ground Coffee',        productId: 'PRD-0015', category: 'Beverages', remainingQuantity: 25, turnover: 57890, increasedBy: 10.3 },
];

export default function Best_Selling_Prod() {
    const [showAll, setShowAll] = useState(false);
    const items = showAll ? bestSellingProducts : bestSellingProducts.slice(0, 6);
    const formatCurrency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const formatPercent = (n) => `${n}%`;

    return (
        <div className={`best-selling-prod-container ${showAll ? 'show-all' : ''}`}>
            <div className="best-selling-prod-header">
                <h1>Best Selling Product</h1>
                <p onClick={() => setShowAll((s) => !s)}>
                    {showAll ? 'See Less' : 'See All'}
                </p>
            </div>

            <div className="best-selling-prod-table-wrapper">
                <table className="best-selling-prod-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Product ID</th>
                            <th>Category</th>
                            <th>remaining Quantity</th>
                            <th>Turn Over</th>
                            <th>Increased By</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((p) => (
                            <tr key={p.category}>
                                <td>{p.product}</td>
                                <td>{p.productId}</td>
                                <td>{p.category}</td>
                                <td className="center">{p.remainingQuantity}</td>
                                <td>{formatCurrency(p.turnover)}</td>
                                <td id={p.increasedBy >= 0 ? 'green' : undefined}>{formatPercent(p.increasedBy)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}