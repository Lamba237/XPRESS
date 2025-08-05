import React from "react";
import '../styles/drawer.css';
import { Link } from "react-router-dom";
import Logo from "../components/logo";

export default function Drawer() {
    return (
        <> 
            <nav className="drawer">
            
                <ul className="main-icons">
                   
                    <Logo />
                    <li>
                        <Link to="/"><img src="../src/assets/sidebar-logos/Home.svg" />Dashboard</Link>
                    </li>

                    <li>
                        <Link to="/inventory"><img src="../src/assets/sidebar-logos/inventory.svg" />Inventory</Link>
                    </li>

                    <li>
                        <Link to="/reports" ><img src="../src/assets/sidebar-logos/reports.svg" />Reports</Link>
                    </li>

                    <li>
                        <Link to="/suppliers"><img src="../src/assets/sidebar-logos/suppliers.svg" />Suppliers</Link>
                    </li>

                    <li>
                        <Link to="/orders"><img src="../src/assets/sidebar-logos/orders.svg" />Orders</Link>
                    </li>

                    <li>
                        <Link to="/store"><img src="../src/assets/sidebar-logos/store.svg" />Manage Store</Link>
                    </li>
                </ul>

                <ul className="logout-and-settings">
                    <li>
                        <Link to="/settings"><img src="../src/assets/sidebar-logos/settings.svg" />Settings</Link>
                    </li>

                    <li>
                        <Link to="/logout"><img src="../src/assets/sidebar-logos/LogOut.svg" />Log Out</Link>
                    </li>
                </ul>
                
            </nav>
            
        
    </>    
    )
}