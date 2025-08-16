import OverallOrders from '../components/Orders/overall-orders.jsx';
import OrdersTable from '../components/Orders/order-table.jsx';
import '../styles/orders.css';
export default function Orders() {
    return (
        <div className="orders-container">
           <OverallOrders />
           <OrdersTable />
        </div>
    )
}