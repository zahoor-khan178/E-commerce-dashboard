


import { useState, useEffect } from "react"
import React from 'react'
import { useParams, useNavigate } from "react-router-dom"

const Update = () => {

    // const{setmargin}=useOutletContext();




    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [category, setcategory] = useState('')
    const [company, setcompany] = useState('')
    const [error, seterror] = useState(false)
    const param = useParams();
    const navigate = useNavigate();

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




    useEffect(() => {



        const getproductdata = async () => {

            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }


            let result = await fetch(`http://localhost:9000/update/${param.id}`, {

                headers: {

                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });


            if (!result.ok) {

                const errorData = await result.json();


                if (window.location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP error! status: ${result.status}`);
                }

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');

                return;
            }



            result = await result.json();
            setname(result.name)
            setprice(result.price)
            setcategory(result.category)
            setcompany(result.company)
        }

        getproductdata();
    }, []);





    const updateproduct = async () => {

        if (!name || !price || !category || !company) {
            seterror(true);
            return;
        }

        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));





        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
        }




        let result = await fetch(`http://localhost:9000/Update/${param.id}`,
            {
                method: "put",
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    "content-type": "application/json",
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            }
        );


        if (!result.ok) {

            const errorData = await result.json();

            if (window.location.pathname !== '/login') {
                window.alert(errorData.message || `HTTP error! status: ${result.status}`);
            }



            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');

            return;
        }


        result = await result.json()
        console.log(result)

        if (result) {

            alert('updated successfuly')
            navigate('/pl');
        }


    }



    return (

        <div className="productcomp">

            <h3 className="producth">update product</h3>

            <input type="text" className="productinput" placeholder='enter name' onChange={changen} value={name} />
            {error && !name && <span className="invalidinput">invalid name</span>}

            <input type="number" className="productinput" placeholder='enter price' onChange={changep} value={price} />
            {error && !price && <span className="invalidinput">invalid price</span>}

            <input type="text" className="productinput" placeholder='enter category' onChange={changecat} value={category} />
            {error && !category && <span className="invalidinput">invalid category</span>}

            <input type="text" className="productinput" placeholder='enter company' onChange={changecomp} value={company} />
            {error && !company && <span className="invalidinput">invalid company</span>}

            <button className="addproductbutton" type='button' onClick={updateproduct}>update product</button>
        </div>
    )
}

export default Update;








