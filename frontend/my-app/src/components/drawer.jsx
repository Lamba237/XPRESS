import React from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarLogo from "./sidebar-logo";
import '../styles/drawer.css';
import { useAuth } from '../hooks/useAuth.js';

export default function Drawer() {
    const location = useLocation();
    const { canAccessPage, loading, role } = useAuth();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // All navigation items with their page keys
    const allNavItems = [
        { key: 'dashboard', path: '/', label: 'Dashboard', icon: '../src/assets/sidebar-logos/Home.svg' },
        { key: 'inventory', path: '/inventory', label: 'Inventory', icon: '../src/assets/sidebar-logos/inventory.svg' },
        { key: 'reports', path: '/reports', label: 'Reports', icon: '../src/assets/sidebar-logos/reports.svg' },
        { key: 'suppliers', path: '/suppliers', label: 'Suppliers', icon: '../src/assets/sidebar-logos/suppliers.svg' },
        { key: 'orders', path: '/orders', label: 'Orders', icon: '../src/assets/sidebar-logos/orders.svg' },
        { key: 'manage_store', path: '/manage_store', label: 'Manage Store', icon: '../src/assets/sidebar-logos/store.svg' },
        { key: 'sales_and_product', path: '/sales_and_product', label: 'Sales and Product', icon: '../src/assets/sidebar-logos/sales.png' }
    ];

    const bottomItems = [
        { key: 'settings', path: '/settings', label: 'Settings', icon: '../src/assets/sidebar-logos/settings.svg' },
        { key: 'logouts', path: '/logouts', label: 'Log Out', icon: '../src/assets/sidebar-logos/LogOut.svg' }
    ];

    // Filter and organize items based on user permissions
    const getAccessibleItems = (items) => {
        return items.filter(item => canAccessPage(item.key));
    };

    const renderNavItems = (items) => {
        return items.map(item => (
            <li key={item.key}>
                <Link to={item.path} className={isActive(item.path)}>
                    <img src={item.icon} alt={item.label} />
                    {item.label}
                </Link>
            </li>
        ));
    };

    if (loading) {
        return <nav className="drawer"><div style={{ padding: '1rem' }}>Loading...</div></nav>;
    }

    // Get accessible items
    const accessibleNavItems = getAccessibleItems(allNavItems);
    const accessibleBottomItems = getAccessibleItems(bottomItems);

    // For cashiers, group all main navigation items together to avoid scattering
    const shouldGroupAllItems = role === 'cashier' && accessibleNavItems.length <= 4;

    return (
        <> 
            <nav className="drawer">
                <ul className={`main-icons ${shouldGroupAllItems ? 'grouped' : ''}`}>
                    <SidebarLogo />
                    {shouldGroupAllItems ? (
                        // For cashiers with few items, group everything together
                        <>
                            {renderNavItems(accessibleNavItems)}
                            {renderNavItems(accessibleBottomItems)}
                        </>
                    ) : (
                        // For admins or cashiers with many items, keep main nav separate
                        renderNavItems(accessibleNavItems)
                    )}
                </ul>

                {!shouldGroupAllItems && (
                    <ul className="logout-and-settings">
                        {renderNavItems(accessibleBottomItems)}
                    </ul>
                )}
                
            </nav>
            
        
    </>    
    )
}