
import './Css/body.css';

// Import necessary components from react-router-dom
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import Addproduct from './components/Addproduct';
import Productlist from './components/Productlist';
import Update from './components/Update';
import Image from './components/Background_image';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Nav2 from './components/Nav2';

// 1. Create a ProtectedRoutes Component
const ProtectedRoutes = () => {
    const auth_data = localStorage.getItem('user'); // Check for authentication data

    // If auth_data exists, render the child routes (Outlet)
    // Otherwise, redirect to the login page
    return auth_data ? <Outlet /> : <Navigate to="/login" replace />;
};


// MainLayout component for conditional rendering of Nav and Footer
function MainLayout() {
    const location = useLocation();
    const auth_data = localStorage.getItem('user'); // Get auth data here for login page redirection

    // Define routes where Nav and Footer should NOT be displayed
    const noNavFooterRoutes = ['/login', '/sign'];

    // Check if the current path is in the exclusion list
    const shouldShowNavAndFooter = !noNavFooterRoutes.includes(location.pathname);

    return (
        <div id="body">
            {shouldShowNavAndFooter ? <Nav /> : <Nav2 /> }
            
            <div className="maindiv">
                <Routes>
                    {/* Routes accessible to everyone (non-protected) */}
                    {/* Login page: If auth_data exists, redirect away from login; otherwise, show Login component */}
                    <Route
                        path="/login"
                        element={auth_data ? <Navigate to={location.state?.from || "/"} replace /> : <Login />}
                    />
                    <Route path="/sign" element={<Signup />} /> {/* Signup is always accessible */}

                    {/* Protected Routes: These routes are only accessible if auth_data exists */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/" element={<Image />} /> {/* Home/Image page is now protected */}
                        <Route path="/pl" element={<Productlist />} />
                        <Route path="/ad" element={<Addproduct />} />
                        <Route path="/up/:id" element={<Update />} />
                    </Route>

                    {/* Catch-all for undefined routes (optional, but good for UX) */}
                    {/* If a route doesn't match and auth_data doesn't exist, redirect to login */}
                    {/* If a route doesn't match and auth_data exists, maybe redirect to home or a 404 page */}
                    {/* For this specific requirement, if auth_data does not exist, any non-login/signup page should go to login */}
                     <Route path="*" element={auth_data ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
                </Routes> 
            </div> 
            
            {/* {shouldShowNavAndFooter && <Footer />} */}
            <Footer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <MainLayout />
        </BrowserRouter>
    );
}

export default App;