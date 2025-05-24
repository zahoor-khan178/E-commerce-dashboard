// import './App.css';
import './Css/image.css';
import './Css/nav.css';
import './Css/footer.css';
import './Css/signup.css';
import './Css/login.css';
import './Css/addproduct.css';
import './Css/productlist.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Signup from './components/Signup';
import Privatecom from './components/Privatecom';
import Login from './components/Login';
import Addproduct from './components/Addproduct';
import Productlist from './components/Productlist';
import Update from './components/Update';
import Image from './components/Background_image';
import Footer from './components/Footer';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

const AppRoutes = () => {
    const location = useLocation();  // Hook is now inside the functional component

    return (
        <Routes>
            <Route path='/' element={<>
                <Privatecom />
                {location.pathname === '/' && <><Image /><div style={{ marginTop: '-310px', display:'relative' }}><Footer /></div></>}
            </>}>
                <Route path="/pl" element={<><Productlist /><div style={{ marginTop: '100px', display:'relative' }}><Footer /></div></>} />
                <Route path="/ad" element={<><Addproduct /><div style={{ marginTop: '30px', display:'relative' }}><Footer /></div></>} />
                <Route path="/up/:id" element={<><Update /><div style={{ marginTop: '30px', display:'relative' }}><Footer /></div></>} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<Signup />} />
        </Routes>
    );
};

export default App;
