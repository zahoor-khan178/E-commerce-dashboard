import './Css/image.css';
import './Css/nav.css';
import './Css/footer.css';
import './Css/signup.css';
import './Css/login.css';
import './Css/addproduct.css';
import './Css/productlist.css';
import './Css/body.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import Addproduct from './components/Addproduct';
import Productlist from './components/Productlist';
import Update from './components/Update';
import Image from './components/Background_image';
import Footer from './components/Footer';
import Nav from './components/Nav';

function App() {
    return (
        <BrowserRouter>

        <div id="body">
            <Nav />
            
            <div className="maindiv">
            <Routes>
                <Route path="/" element={<Image />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign" element={<Signup />} />

                <Route path="/pl" element={<Productlist />} />
                <Route path="/ad" element={<Addproduct />} />
                <Route path="/up/:id" element={<Update />} />
            </Routes> 
            </div> 
            <Footer />

            </div>
        </BrowserRouter>
    );
}

export default App;