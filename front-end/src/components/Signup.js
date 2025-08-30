import '../Css/signup.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ✅ API base URL from environment variable
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSignup = async () => {
        if (!name || !email || !password) {
            alert('All fields are required.');
            return;
        }

        try {
            let response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            let result = await response.json();

            if (result.auth) {
                localStorage.setItem('user', JSON.stringify(result.result));
                localStorage.setItem('token', JSON.stringify(result.auth));
                navigate("/");
            } else {
                alert(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            alert('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <form
                className="signup-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                }}
            >
                <h2>Create Account</h2>
                
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        className="form-input"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="form-input"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter a password"
                        className="form-input"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button type="submit" className="signup-button">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
