import React, {useState} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import Login from './Login';
const Privatecom = () => {


    const auth = localStorage.getItem('user');
    const log=localStorage.getItem('loginuser');
   



    if(log){



        return (


            <><Nav/><Outlet />  <Footer  /></>
         
        )
    }

    else{


    return auth ?<><Login/></>: <Navigate to='/sign' />;
    }
}

export default Privatecom;
