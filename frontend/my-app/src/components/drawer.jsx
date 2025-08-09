import React from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarLogo from "./sidebar-logo";
import '../styles/drawer.css';

export default function Drawer() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';
    return (
        <> 
            <nav className="drawer">
                <ul className="main-icons">
                    <SidebarLogo />
                    <li>
                        <Link to="/" className={isActive('/')}><img src="../src/assets/sidebar-logos/Home.svg" />Dashboard</Link>
                    </li>

                    <li>
                        <Link to="/inventory" className={isActive('/inventory')}><img src="../src/assets/sidebar-logos/inventory.svg" />Inventory</Link>
                    </li>

                    <li>
                        <Link to="/reports" className={isActive('/reports')}><img src="../src/assets/sidebar-logos/reports.svg" />Reports</Link>
                    </li>

                    <li>
                        <Link to="/suppliers" className={isActive('/suppliers')}><img src="../src/assets/sidebar-logos/suppliers.svg" />Suppliers</Link>
                    </li>

                    <li>
                        <Link to="/orders" className={isActive('/orders')}><img src="../src/assets/sidebar-logos/orders.svg" />Orders</Link>
                    </li>

                    <li>
                        <Link to="/manage_store" className={isActive('/manage_store')}><img src="../src/assets/sidebar-logos/store.svg" />Manage Store</Link>
                    </li>
                    <li>
                        <Link to="/sales_and_product" className={isActive('/sales_and_product')}><img src="../src/assets/sidebar-logos/sales.png" />Sales and Product</Link>
                    </li>
                </ul>

                <ul className="logout-and-settings">
                    <li>
                        <Link to="/settings" className={isActive('/settings')}><img src="../src/assets/sidebar-logos/settings.svg" />Settings</Link>
                    </li>

                    <li>
                        <Link to="/logouts" className={isActive('/logouts')}><img src="../src/assets/sidebar-logos/LogOut.svg" />Log Out</Link>
                    </li>

                </ul>
                
            </nav>
            
        
    </>    
    )
}