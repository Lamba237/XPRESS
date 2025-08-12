import{ useState } from 'react';

function CreateData(image, Name, description) {
    return {image, Name, description};
}

// Declaring a row to hold the table data
const rows = [
    CreateData("../src/assets/dashboard/lowStock/tata_salt.png", "Tata Salt", 10),
    CreateData("../src/assets/dashboard/lowStock/Lays.png", "Lays", 15),
    CreateData("../src/assets/dashboard/lowStock/CreamO.jpeg", "CreamO", 8),
    CreateData("../src/assets/dashboard/lowStock/Horlick.jpeg", "Horlick", 12),
]



export default function LowQualityStock() {

    // State to control how many items to show
const [showAll, setShowAll] = useState(false);
const [itemsToShow, setItemsToShow] = useState(3);

//Function to handle "See All" click
    const handleSeeAllClick = () => {
        if (showAll) {
            //If this is true, go back to showing just 3
            setShowAll(false);
            setItemsToShow(3);
        } else { // If the above is not true, do this instead
            setShowAll(true);
            setItemsToShow(rows.length);
        }
    };

    // This gets the rows to display based on current state
    const displayRows = rows.slice(0, itemsToShow);

    return (
        <div className="low-quality-stock-container">
            <div className="table-header">
                <h1>Low Quality Stock</h1>
                <p onClick={handleSeeAllClick}>{(showAll) ? 'See Less' : 'See All'}</p>
            </div>

            <div className={`low-stock-scroll-container ${showAll ? '' : 'limited'}`}>
                {displayRows.map((row) => (
                    <div
                    className="description-container"
                    key={row.Name}
                    >
                        <img src={row.image} alt={row.Name} />
                        <div className="name-and-description">
                            <p>{row.Name}</p>
                            <p>Remaining Quantity: {row.description} Packets</p>
                        </div>
                        <p className="low-stock">Low</p>
                    </div>
                ))}
            </div>
        </div>
    );
}