import { createContext } from 'react';

// Super admin email always has full access
export const SUPER_ADMIN_EMAIL = 'simontanyi2004@gmail.com';

// Pages accessible per role
export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'inventory', 'reports', 'suppliers', 'orders', 'manage_store', 'sales_and_product', 'settings', 'logouts'],
  cashier: [ 'sales_and_product', 'logouts']
};

export const AuthContext = createContext(null);
