export default function OverallOrders() {
    return (
        <div className="overall-order-container">
            <h1 className="header-1">Overall Orders</h1>
            <div className="order-items">
                {/**Category Items */}
                <div className="item1 item">
                    <p className="header hd-1">Total Orders</p>
                    <p className="cat-paragraph">37</p>
                    <p>Last 7 days</p>
                </div>
                <div className="vertical-line"></div>
                {/**Total Product items */}
                <div className="item2 item">
                    <p className="header hd-2">Total Recieved</p>
                    <div className="content">
                        <div className="last-7-days">
                            <p>32</p>
                            <p  id="bold">₹25000</p>
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
                    <p className="header hd-3">Total Returned</p>
                    <div className="content">
                        <div className="last-7-days">
                            <p id="bold">5</p>
                            <p id="bold">₹2500</p>
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
                    <p className="header">Total Return</p>

                    <div className="content">
                        <div className="Ordered">
                            <p>12</p>
                            <p id="small">Ordered</p>
                        </div>

                        <div className="not-in-stock">
                            <p>₹2356</p>
                            <p id="small">Cost</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}