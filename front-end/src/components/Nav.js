// import '../Css/nav.css';
import '../Css/nav.query.css';




import { Link,  } from 'react-router-dom';



const Nav = () => {



    const logout = () => {

        // localStorage.removeItem('token','user');
        localStorage.clear();
     
    }




    return (

        <div id='nav-div'>
              {/* <h6>E-commerce dashboard</h6> */}
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