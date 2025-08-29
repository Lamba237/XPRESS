import React, { useState } from "react";
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../styles/searchResults.css';
import '../styles/avatarDropdown.css';

export default function SearchBar() {
    const { query, results, search, clear } = useSearch();
    const { user, role } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value === '') {
            clear();
        }
    };

    const handleSearch = () => {
        search(inputValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleResultClick = () => {
        clear();
        setInputValue('');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div className="search-bar">
                <div className="search-input-container">
                    <img 
                        src="../src/assets/search-bar/search-icon.svg" 
                        className="search-icon" 
                        alt="Search Icon"
                        onClick={handleSearch}
                    />
                    <input 
                        placeholder="Search product, supplier, order" 
                        className="Search" 
                        type="search"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                </div>

                <div className="frame-42">
                    <img src="../src/assets/search-bar/bell.svg" className="bell-icon" alt="A bell icon"/>
                    <div className="Avatar" onClick={toggleDropdown}></div>
                    {showDropdown && user && (
                        <div className="avatar-dropdown">
                            <p className="user-name">{user.displayName || user.email}</p>
                            <p className="user-role">{role}</p>
                        </div>
                    )}
                </div>
            </div>
            {results.length > 0 && (
                <div className="search-results">
                    <ul>
                        {results.map(item => (
                            <li key={`${item.type}-${item.id}`}>
                                <Link to={item.link} onClick={handleResultClick}>
                                    <div className="search-result-item">
                                        <span>{item.name}</span>
                                        <span className="search-result-type">{item.type}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}