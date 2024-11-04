
import '../App.css';

import React from 'react'

import { Link, useNavigate } from 'react-router-dom';


const Nav = () => {

    const navigate = useNavigate();
    const auth = localStorage.getItem('user');
    const loginuser = localStorage.getItem('loginuser');

    const logout = () => {

        localStorage.removeItem('loginuser');
        navigate('/')
    }




    return (

        <div>
            <ul className='navbar'>

           


                <li><Link to="/" className='link'>Home</Link></li>
                <li><Link to="/pl" className='link'>Products</Link></li>
                <li><Link to="/ad" className='link'>Add Product</Link></li>
                {/* <li><Link to="/prof" className='link'>Profile</Link></li> */}
             

                <li>{loginuser ? <Link to="/login" onClick={logout} className='link' id='logoutnav'>Logout</Link> :<Link to="/sign" className='link'>signup</Link> }</li>
            </ul>
        </div>
    )
}

export default Nav