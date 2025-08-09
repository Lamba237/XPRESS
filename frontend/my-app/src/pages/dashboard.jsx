import SalesOverview from '../components/dashboard/sales_overview';
import InventorySummary from '../components/dashboard/inventory_summary';
import PurchaseOverview from '../components/dashboard/Purchase_overview';
import ProductSummary from '../components/dashboard/product_summary.jsx';
import OrderSummary from '../components/dashboard/order_summary.jsx';

import '../styles/dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="grid-container">
                <SalesOverview />
                <InventorySummary />
                <PurchaseOverview />
                <ProductSummary />
                <OrderSummary />
            </div>
        </div>
    )
}