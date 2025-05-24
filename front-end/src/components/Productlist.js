
import React from 'react'

import { useEffect, useState } from 'react'

import {  Link } from 'react-router-dom'

const Productlist = () => {

    // const navigate = useNavigate();

    const [product, setproduct] = useState([]);
    const [key,setkey]=useState('');
    const [loading, setloading]=useState(true);

    useEffect(() => {

        getproduct();
        

    },[])


    const getproduct = async () => {

        let result = await fetch("http://localhost:9000/product")
        result = await result.json()
        setproduct(result)
        setloading(false);
    }

    const deletdata = async (id) => {

        let result = await fetch(`http://localhost:9000/delete/${id}`,
            {
                method: 'Delete'
            }
        )
        result = await result.json();
        if (result) {
            getproduct();
            alert('record is deleted.')
        }
    }

    



    const handleproduct = async (event) => {

         const searchkey=event.target.value;
         setkey(searchkey);
         if(!searchkey){

            getproduct();


      
         }

         else{

            let result = await fetch(`http://localhost:9000/search/${key}`,
                {
    
                method:"get"
                }
            )
            result = await result.json()
            if (result) {
    
              
    
                setproduct(result)
            }
         }

       
         if(loading)
         {
            return(

                <li>Loading...</li>
            )
         }



    }


    return (





        <>
            <div className="product-table">


        



                <input type="text" name="" id="search-box" placeholder='search product' 
                 onChange={handleproduct} value={key}/><i class="fa-solid fa-magnifying-glass" id='search-icon'></i>

                <ul className="product-list">
                    <li className="trows1"  >S.No</li>
                    <li className="trows1" >Name</li>
                    <li className="trows1" >price</li>
                    <li className="trows1" >Category</li>
                    <li className="trows1"  >Company</li>
                    <li className="trows1" id='last-cell' >operation</li>



                </ul>





                {product.length > 0 ? product.map((product, index) =>


                    <ul className="product-list">


                        <li className="trows">{index + 1}</li>
                        <li className="trows">{product.name}</li>
                        <li className="trows">{product.price}</li>
                        <li className="trows">{product.category}</li>
                        <li className="trows" >{product.company}</li>
                        <li className="trows" id='company-cell'><button type='button' className='delete' onClick={() => deletdata(product._id)} >delete</button ><Link to={"/up/" + product._id} id='update-button'>update</Link></li>


                        {/* <button type='button' id='update-button' onClick={() => { updatedata(product._id) }}>update</button> */}



                    </ul>

                ) : ' '
                }




            </div>
        </>




    )
}



export default Productlist;



