import OverallInventory from '../components/inventory/overall-inventory.jsx';
import Product from '../components/inventory/product.jsx';
import '../styles/inventory.css';

export default function Inventory() {
    return (
        <div className="inventory-container">
            <div className="grid-container">
                <OverallInventory />
                <Product />
            </div>
        </div>
    )
}