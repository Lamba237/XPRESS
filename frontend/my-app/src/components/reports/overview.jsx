export default function Overview() {
    return (
        <div className="overview-container">
            <h1>Overview</h1>

            <div className="overview-content1">
                <div className="total-profit">
                    <p id="currency">$21,190</p>
                    <p id="text" className="tx-1">Total Profit</p>
                </div>
                <div className="revenue">
                    <p id="currency">$18,300</p>
                    <p id="text" className="tx-2">Revenue</p>
                </div>
                <div className="sales">
                    <p id="currency">$17,432</p>
                    <p id="text" className="tx-3">Sales</p>
                </div>
            </div>
            
            <div className="horizontal-line"></div>

            <div className="overview-content2">
                <div className="net-purchase-value">
                    <p id="currency">$1,17,432</p>
                    <p id="text">Net Purchase Value</p>
                </div>
                <div className="net-sales-value">
                    <p id="currency">$80,432</p>
                    <p id="text">Net Sales Value</p>
                </div>
                <div className="MOM-profit">
                    <p id="currency">$30,432</p>
                    <p id="text">MoM Profit</p>
                </div>
                <div className="YoY-profit">
                    <p id="currency">1,17,432</p>
                    <p id="text">YoY Profit</p>
                </div>
            </div>

        </div>
    );
}