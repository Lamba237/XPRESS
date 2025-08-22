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
import ProtectedRoute from './components/ProtectedRoute.jsx';



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
                        <Route index element={<ProtectedRoute pageKey="dashboard"><Dashboard /></ProtectedRoute>} />
                        <Route path="inventory" element={<ProtectedRoute pageKey="inventory"><Inventory /></ProtectedRoute>} />
                        <Route path="reports" element={<ProtectedRoute pageKey="reports"><Reports /></ProtectedRoute>} />
                        <Route path="suppliers" element={<ProtectedRoute pageKey="suppliers"><Suppliers /></ProtectedRoute>} />
                        <Route path="orders" element={<ProtectedRoute pageKey="orders"><Orders /></ProtectedRoute>} />
                        <Route path="manage_store" element={<ProtectedRoute pageKey="manage_store"><ManageStore /></ProtectedRoute>} />
                        <Route path='sales_and_product' element={<ProtectedRoute pageKey="sales_and_product"><SalesAndProduct /></ProtectedRoute>} />
                        <Route path="settings" element={<ProtectedRoute pageKey="settings"><Settings /></ProtectedRoute>} />
                        <Route path="logouts" element={<ProtectedRoute pageKey="logouts"><Logout /></ProtectedRoute>} />
                        
                    </Route>
                </Routes>
            </BrowserRouter>
       </>
    )
}