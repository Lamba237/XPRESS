import Login from "./pages/login.jsx";
import Signup from './pages/signup.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home.jsx";
import Dashboard from "./pages/dashboard.jsx"
import Inventory from './pages/inventory.jsx';
import Reports from './pages/reports.jsx';
import Suppliers from './pages/suppliers.jsx';
import Orders from './pages/orders.jsx';
import ManageStore from './pages/manage_store.jsx';
import SalesAndProduct from './pages/sales_and_product.jsx';
import Settings from './pages/settings.jsx';
import Logout from './pages/logouts.jsx';



export default function App() {
    return (
       <>
            <BrowserRouter>
                <Routes>
                        {/**Authentication Routes*/}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/** Main app routes*/}
                    <Route path="/" element={<Home />} >
                        <Route index element={<Dashboard />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="suppliers" element={<Suppliers />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="manage_store" element={<ManageStore />} />
                        <Route path='sales_and_product' element={<SalesAndProduct />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="logouts" element={<Logout />} />
                        
                    </Route>
                </Routes>
            </BrowserRouter>
       </>
    )
}