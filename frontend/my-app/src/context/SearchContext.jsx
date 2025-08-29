import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export function useSearch() {
    return useContext(SearchContext);
}

export function SearchProvider({ children }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const search = (searchQuery) => {
        setQuery(searchQuery);
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();
        
        // --- Search Products ---
        const products = JSON.parse(localStorage.getItem('inventoryProducts') || '[]');
        const filteredProducts = products
            .filter(p => p.name.toLowerCase().includes(lowerCaseQuery))
            .map(p => ({ ...p, type: 'Product', link: `/inventory?product=${p.id}` }));

        // --- Search Suppliers (assuming structure) ---
        const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        const filteredSuppliers = suppliers
            .filter(s => s.name.toLowerCase().includes(lowerCaseQuery))
            .map(s => ({ ...s, type: 'Supplier', link: `/suppliers?supplier=${s.id}` }));

        // --- Search Orders (assuming structure) ---
        const orders = JSON.parse(localStorage.getItem('salesHistory') || '[]');
        const filteredOrders = orders
            .filter(o => o.orderId.toLowerCase().includes(lowerCaseQuery) || o.customerName.toLowerCase().includes(lowerCaseQuery))
            .map(o => ({ ...o, id: o.orderId, name: `Order #${o.orderId}`, type: 'Order', link: `/orders?order=${o.orderId}` }));

        setResults([...filteredProducts, ...filteredSuppliers, ...filteredOrders]);
    };

    const clear = () => {
        setQuery('');
        setResults([]);
    }

    const value = {
        query,
        results,
        search,
        clear,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}
