


import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const auth_data=localStorage.getItem('loginuser');

    useEffect(()=>{

        if(auth_data)
        {
            navigate('/');
        }
    });

   




    const changen = (event) => {

        setname(event.target.value);


    }
    const changee = (event) => {

        setemail(event.target.value);


    }
    const changep = (event) => {

        setpassword(event.target.value);


    }


    const signdata = async () => {


        if (!name  ) {

            alert('name field is empty.')
            return;
        }
        if (!email) {

            alert('email field is empty.')
            return;
        }
        if (!password) {

            alert('password field is empty.')
            return;
        }

        try {
         
            let result;
            result = await fetch('http://localhost:9000/register',
                {
                    method: 'post',
                    body: JSON.stringify({ name, email, password }),
                    headers: { 'content-type': 'application/json' }

                });

            result = await result.json();
            console.log(result)
            localStorage.setItem('user', JSON.stringify(result))

            if (result) {

                navigate("/");
            }
        }
        catch(err){

            console.log('error while fetching:',err)
        }
        }


        





    return (

        <div>
            <div className="sign">
                <form >
                <h1>Registeration</h1>
                    <input type="text" placeholder='Enter your name' className='inputbox' onChange={changen} value={name} />
                    <input type="text" placeholder='Enter your email' className='inputbox' onChange={changee} value={email} />
                    <input type="text" placeholder='Enter a password' className='inputbox' onChange={changep} value={password} />
                    <button type='button' id='signsubmit' onClick={signdata}>signup</button>
                </form>

            </div>


        </div>


    )
}

export default Signup;