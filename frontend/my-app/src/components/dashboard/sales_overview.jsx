export default function SalesOverview() {
    return (
        <div className="sales-overview-container">
            <h1 className="header-1">Sales Overview</h1>

            <div className="flex-items">
                {/*General flex-items used for styling with flexbox*/}
                <div className="logo-content">
                    <img src="/src/assets/dashboard/Sales.svg" />
                    <div className="text-div">
                        <p>₹ 832</p>
                        <p>Sales</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>

                <div className="logo-content Revenue">
                    <img src="/src/assets/dashboard/Revenue.svg"/>
                    <div className="text-div">
                        <p>₹ 18300</p>
                        <p>Revenue</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>

                <div className="logo-content profit">
                    <img src="/src/assets/dashboard/Profit.svg"/>
                    <div className="text-div">
                        <p>₹ 868</p>
                        <p>Profit</p>
                    </div>
                </div>
                {/*Verical line*/}
                 <div className="vertical-line"></div>
                 
                <div className="logo-content Cost">
                    <img src="/src/assets/dashboard/cost.svg"/>
                    <div className="text-div">  
                        <p>₹ 17432</p>
                        <p>cost</p>
                    </div>
                </div>


            </div>
        </div>
    )
}