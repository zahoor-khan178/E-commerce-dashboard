// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Nav from './components/Nav';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Privatecom from './components/Privatecom';
import Login from './components/Login';
import Addproduct from './components/Addproduct';
import { useState } from 'react';
import Productlist from './components/Productlist'
import Update from './components/Update'



function App() {

//  const footer1= document.getElementsByClassName('footer').style.top='300px';
//  footer
  // const [margin,setmargin]=useState('200px');

  return (


    <div className="App">
      <BrowserRouter>


        <Routes>

          <Route path='' element={<Privatecom />}>



            <Route path="pl" element={<Productlist/>} />
            <Route path="ad" element={<><Addproduct/></>} />
            <Route path="/up/:id" element={<><Update/></>} />
           
           
            {/* <Route path="prof" element={<h1 className='linkdesc'>your profile</h1>} /> */}

          </Route>





          <Route path="/login" element={<Login />} />
      

          <Route path="/sign" element={<Signup />} />

        </Routes>
      </BrowserRouter>
    


      {/* margintop={margin} */}

    </div >

  );
}

export default App;
      