export default function OverallInventory() {
    const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    return (
        <div className="overall-inventory-container">
            <h1 className="header-1">Overall Inventory</h1>
            <div className="Inventory-items">
                {/**Category Items */}
                <div className="item1 item">
                    <p className="header hd-1">Categories</p>
                    <p className="cat-paragraph">14</p>
                    <p>Last 7 days</p>
                </div>
                <div className="vertical-line"></div>
                {/**Total Product items */}
                <div className="item2 item">
                    <p className="header hd-2">Total Products</p>
                    <div className="content">
                        <div className="last-7-days">
                            <p>868</p>
                            <p  id="bold">{formatUSD(25000)}</p>
                        </div>
                        <div className="Revenue">
                            <p id="small">Last 7 days</p>
                            <p id="small">Revenue</p>
                        </div>
                    </div>
                </div> 
                <div className="vertical-line"></div>

                {/**Top Selling Product items */}
                <div className="item3 item">
                    <p className="header hd-3">Top Selling Product</p>
                    <div className="content">
                        <div className="last-7-days">
                            <p id="bold">5</p>
                            <p id="bold">{formatUSD(2500)}</p>
                        </div>       
                        <div className="Revenue">
                            <p id="small">Last 7 days</p>
                            <p id="small">Cost</p>
                        </div>
                    </div>
                </div>
                <div className="vertical-line"></div>

                {/**Low Quality Stock items */}
                <div className="item4 item">
                    <p className="header">Low Stock</p>

                    <div className="content">
                        <div className="Ordered">
                            <p>12</p>
                            <p id="small">Ordered</p>
                        </div>

                        <div className="not-in-stock">
                            <p>2</p>
                            <p id="small">Not in Stock</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}