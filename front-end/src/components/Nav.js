



import { Link,  } from 'react-router-dom';



const Nav = () => {



    const logout = () => {

        localStorage.removeItem('loginuser');
     
    }




    return (

        <div>
            <ul className='navbar'>

           


                <li><Link to="/" className='link'>Home</Link></li>
                <li><Link to="/pl" className='link'>Products</Link></li>
                <li><Link to="/ad" className='link'>Add Product</Link></li>
              <li> <Link to="/login" onClick={logout} className='link' id='logoutnav'>Logout</Link></li>
                
            </ul>
        </div>
    )
}

export default Nav