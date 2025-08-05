import React from "react";

export default function SearchBar() {
    return (
        <>
            <div className="search-bar">
                    <input placeholder="Search product, supplier, order" className="Search" type="search"/>

                    <div className="frame-42">
                        <img src="../src/assets/search-bar/bell.svg" className="bell-icon" alt="A bell icon"/>
                        
                        <div className="Avatar"></div>
                    </div>
            </div>
        </>
    )
}