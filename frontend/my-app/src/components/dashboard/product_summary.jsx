export default function ProductSummary() {
    return (
        <div className="product-summary-container">
            <h1 className="header-1">Product Summary</h1>

            <div className="product-items">
                <div className="item-prod prod1">
                    <img src="/src/assets/dashboard/Suppliers.svg" alt="Inventory Icon" />
                    <div className="item-details">
                        <p>31</p>
                        <p>Number of suppliers</p>
                    </div>
                </div>

                {/*Verical line*/}
                 <div className="vertical-line"></div>
                 
                <div className="item-prod prod2">
                    <img src="/src/assets/dashboard/Categories.svg" alt="Inventory Icon" />
                    <div className="item-details">
                        <p>21</p>
                        <p>Number of Categories</p>
                    </div>
                </div>
            </div>
        </div>
    );
}