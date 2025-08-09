import React from "react";
import { Outlet } from "react-router-dom";
import Drawer from "../components/drawer";
import SearchBar from "../components/searchBar";
import '../styles/home.css';


export default function Home() {
    return (
        <div className="home-layout-container">
            <div className="sidebar-container">
                <Drawer />
            </div>
            <div className="main-content-container">
                <SearchBar />
                <Outlet />
            </div>
            
        </div>
    )
}