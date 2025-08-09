export default function InventorySummary() {
    return (
        <div className="inventory-summary-container">
            <h1 className="header-1">Inventory Summary</h1>

            <div className="inventory-items">
                <div className="item">
                    <img src="/src/assets/dashboard/Quantity.svg" alt="Inventory Icon" />
                    <div className="item-details">
                        <p>868</p>
                        <p>Quantity in hand</p>
                    </div>
                </div>

                {/*Verical line*/}
                 <div className="vertical-line"></div>
                 
                <div className="item">
                    <img src="/src/assets/dashboard/Ontheway.svg" alt="Inventory Icon" />
                    <div className="item-details">
                        <p>200</p>
                        <p>To be received</p>
                    </div>
                </div>
            </div>
        </div>
    );
}