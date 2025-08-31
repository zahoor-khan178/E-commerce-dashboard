import '../Css/login.css';
import { useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
   
    const navigate = useNavigate();
    const location = useLocation();

    const change = (event) => setemail(event.target.value);
    const changep = (event) => setpassword(event.target.value);

    // Handle Login (wrapped in useCallback for stability)
    const handlechange = useCallback(async () => {
        // Basic validation
        if (!email || !password) {
           
            window.alert("Both email and password are required.");
            return;
        }

        try {
            // Use env variable instead of hardcoding URL
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:9000";

            let response = await fetch(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || `Login failed. Status: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (result.auth) {
                // Save user and token to localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', JSON.stringify(result.auth));

                // Navigate back to previous page or home
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
                window.alert("Login successful!");
            } else {
                window.alert("Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Error while logging in:", err);
            window.alert("Failed to connect to server. Please try again later.");
        }
    }, [email, password, location, navigate]);

    return (
        <div className='logindiv'>
            <h2 className='logheadign'>Login</h2>

            <input 
                className='loginh1' 
                type="text" 
                placeholder='Enter email' 
                onChange={change} 
                value={email} 
            />
           

            <input 
                className='loginh2' 
                type="password" 
                placeholder='Enter password' 
                onChange={changep} 
                value={password} 
            />
           

            <button 
                className="loginbutton" 
                type='button' 
                onClick={handlechange}
            >
                Login
            </button>

            <li id='account-link'>
                <Link to='/sign' style={{ textDecoration: 'none', color: 'blue' }}>
                    Create new account
                </Link>
            </li>
        </div>
    );
};

export default Login;
