import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "../components/drawer";
import SearchBar from "../components/searchBar";
import '../styles/home.css';


export default function Home() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <div className="home-layout-container">
            <div className={`sidebar-container ${mobileOpen ? 'open' : ''}`}>
                <Drawer />
            </div>
            <div className="main-content-container">
                <div className="top-bar-responsive">
                    <button className="menu-toggle" onClick={() => setMobileOpen(o => !o)}>
                        {mobileOpen ? 'Close' : 'Menu'}
                    </button>
                    <SearchBar />
                </div>
                <Outlet />
            </div>
        </div>
    )
}