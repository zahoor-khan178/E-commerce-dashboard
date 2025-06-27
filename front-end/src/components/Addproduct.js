import '../Css/addproduct.css';

import { useState } from "react"



const Addproduct = (  ) => {

   
    
  
    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [category, setcategory] = useState('')
    const [company, setcompany] = useState('')
    const [error,seterror]=useState(false)

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

        // const token=localStorage.getItem('token');
        // if(!token)
        //             {
        //                 alert('please login first');
        //                 return false;
        //             }


        
       
    
        try {
            const response = await fetch('http://localhost:9000/add-product', {
                method: "POST",
                body: JSON.stringify({ name, price, category, company,userid
                    
                }),
                headers: {
                    "Content-Type": "application/json",
                  
                }
            });
            
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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