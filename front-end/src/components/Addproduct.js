import '../Css/addproduct.css';

import { useState} from "react";
import { useNavigate, useLocation} from "react-router-dom";



const Addproduct = (  ) => {

   
    
  
    const [name, setname] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [company, setcompany] = useState('');
    const [error,seterror]=useState(false);

    const nevigate=useNavigate();
    const location=useLocation();

    const changen = (event) => {

        setname(event.target.value);


    }
    const changep = (event) => {

        setprice(event.target.value);

    }
    const changecat = (event) => {

        setcategory(event.target.value);
    }
    const changecomp = (event) => {

        setcompany(event.target.value);
    }

    const addproduct = async () => {

        const user = JSON.parse(localStorage.getItem('user'));
       
        const userid =  user._id ; 
        
       

       

        if(!name || !price || !category ||!company)
        {
            seterror(true);
            return false;
        }



          
       
    
        try {

               const token = JSON.parse(localStorage.getItem('token'));
                const user = JSON.parse(localStorage.getItem('user'));

                if (!token || !user) {
                    window.alert("Your session has expired or you are not logged in. Please log in again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    nevigate('/login', {state:{form:location.pathname}});
                    return;
                }

            const result = await fetch('http://localhost:9000/add-product', {
                method: "POST",
                body: JSON.stringify({ name, price, category, company,userid
                    
                }),
                headers: {
                    "Content-Type": "application/json",
                    authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
                  
                }
            });
            
            
           
          if (!result.ok) {
            // Parse the JSON response to get the error message
            const errorData = await result.json();
            // Display the message from the backend in an alert
            window.alert(errorData.message || `HTTP error! status: ${result.status}`);

            localStorage.removeItem('token');
            localStorage.removeItem('user');

              nevigate('/login', {state:{form:location.pathname}});
   
            return; 
        }
            alert('inserted successfuly')
            setname('');
            setprice('');
            setcategory('');
            setcompany('');
            
            // const result = await response.json();
          
        } catch (error) {
            console.error("Error during fetch:", error);
        }
    }
    

    return (

        <div className="productcomp">

     
            <h3 className="producth">Add product</h3>

            <input type="text" className="productinput" placeholder='Enter name' onChange={changen}  value={name}/>
           {error && !name &&<span className="invalidinput">invalid name</span>}

            <input type="number" className="productinput" placeholder='Enter price' onChange={changep}  value={price}/>
            {error && !price &&<span className="invalidinput">invalid price</span>}

            <input type="text" className="productinput" placeholder='Enter category' onChange={changecat}  value={category}/>
             {error && !category &&<span className="invalidinput">invalid category</span>}

            <input type="text" className="productinput" placeholder='Enter company' onChange={changecomp}  value={company}/>
            {error && !company &&<span className="invalidinput">invalid company</span>}

            <button className="addproductbutton" type='button' onClick={addproduct}>add product</button>
        
       
        </div>
    )
}

export default Addproduct;