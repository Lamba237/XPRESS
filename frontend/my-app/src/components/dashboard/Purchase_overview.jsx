export default function PurchaseOverview() {
    const formatUSD = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    return (
        <div className="sales-overview-container">
            <h1 className="header-1">Purchase Overview</h1>

            <div className="flex-items">
                {/*General flex-items used for styling with flexbox*/}
                <div className="logo-content">
                    <img src="/src/assets/dashboard/Purchasebag.svg" />
                    <div className="text-div">
                        <p>82</p>
                        <p>Purchase</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>

                <div className="logo-content Revenue">
                    <img src="/src/assets/dashboard/Cost.svg"/>
                    <div className="text-div">
                        <p>{formatUSD(13500)}</p>
                        <p>Cost</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>

                <div className="logo-content profit cancel">
                    <img src="/src/assets/dashboard/Cancel.svg"/>
                    <div className="text-div">
                        <p>5</p>
                        <p>Cancel</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>
                 
                <div className="logo-content Cost">
                    <img src="/src/assets/dashboard/Profit.svg"/>
                    <div className="text-div returning-p">  
                        <p>{formatUSD(17432)}</p>
                        <p>Return</p>
                    </div>
                </div>


            </div>
        </div>
    )
}