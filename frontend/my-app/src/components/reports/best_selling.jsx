import { useState } from 'react';

// Best selling products (mock data)
// Fields:
// - category: string
// - turnover: number (USD)
// - increasedBy: number (percentage growth vs prior period)

export const bestSellingProducts = [
  { category: 'Smartphones',       turnover: 245000, increasedBy: 14.2 },
  { category: 'Laptops',           turnover: 198500, increasedBy: 9.8  },
  { category: 'Headphones',        turnover: 86500,  increasedBy: 6.3  },
  { category: 'Smartwatches',      turnover: 73500,  increasedBy: 11.1 },
  { category: 'Televisions',       turnover: 156300, increasedBy: 8.5  },
  { category: 'Gaming Consoles',   turnover: 129900, increasedBy: 12.7 },
  { category: 'Tablets',           turnover: 91500,  increasedBy: 5.4  },
  { category: 'Cameras',           turnover: 68400,  increasedBy: 4.9  },
  { category: 'Drones',            turnover: 50200,  increasedBy: 7.2  },
  { category: 'Home Appliances',   turnover: 172800, increasedBy: 10.6 },
  { category: 'Fitness Trackers',  turnover: 45800,  increasedBy: 13.3 },
  { category: 'Bluetooth Speakers',turnover: 39650,  increasedBy: 6.9  },
  { category: 'Monitors',          turnover: 104200, increasedBy: 7.7  },
  { category: 'Keyboards & Mice',  turnover: 32800,  increasedBy: 3.8  },
  { category: 'Networking Gear',   turnover: 88250,  increasedBy: 9.1  }
];

export default function Best_Selling() {
    const [showAll, setShowAll] = useState(false);

    const items = showAll ? bestSellingProducts : bestSellingProducts.slice(0, 4);
    const formatCurrency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const formatPercent = (n) => `${n}%`;

    return (
        <div className={`best-selling-container ${showAll ? 'show-all' : ''}`}>
            <div className="best-selling-header">
                <h1>Best Selling Category</h1>
                <p onClick={() => setShowAll((s) => !s)}>{showAll ? 'See Less' : 'See All'}</p>
            </div>

            <div className="best-selling-table-wrapper">
                <table className="best-selling-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Turnover</th>
                            <th>Increased By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((p) => (
                            <tr key={p.category}>
                                <td>{p.category}</td>
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