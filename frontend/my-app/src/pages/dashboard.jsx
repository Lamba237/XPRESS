import SalesOverview from '../components/dashboard/sales_overview';
import InventorySummary from '../components/dashboard/inventory_summary';
import PurchaseOverview from '../components/dashboard/Purchase_overview';
import ProductSummary from '../components/dashboard/product_summary.jsx';
import OrderSummary from '../components/dashboard/order_summary.jsx';
import '../styles/dashboard.css';
import TopSelling from '../components/dashboard/top_selling.jsx';
import LowQualityStock from '../components/dashboard/low_quality_stock.jsx';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="grid-container">
                <SalesOverview />
                <InventorySummary />
                <PurchaseOverview />
                <ProductSummary />
                <OrderSummary />
                <TopSelling />
                <LowQualityStock />
            </div>
        </div>
    )
}