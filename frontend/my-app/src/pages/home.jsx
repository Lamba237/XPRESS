import { Outlet } from 'react-router-dom';

export default function Home() {
    return (
        <div className="home-page-container">
            <Outlet />
        </div>
    );
}