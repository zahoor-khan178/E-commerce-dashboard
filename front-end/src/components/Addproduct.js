import '../Css/addproduct.css';
import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Addproduct = () => {
    const [name, setname] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [company, setcompany] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // Add Product Function
    const addproduct = useCallback(async () => {
        // Validation check
        if (!name || !price || !category || !company) {
            alert("All fields are required");
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            const API_URL = process.env.REACT_APP_API_URL;

            const response = await fetch(`${API_URL}/add-product`, {
                method: "POST",
                body: JSON.stringify({
                    name,
                    price,
                    category,
                    company,
                    userid: user._id
                }),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || `HTTP error! status: ${response.status}`);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            // Success case
            window.alert("Product added successfully ✅");
            setname('');
            setprice('');
            setcategory('');
            setcompany('');

        } catch (err) {
            console.error("Error during fetch:", err);
            window.alert("Something went wrong. Please try again later.");
        }
    }, [name, price, category, company, navigate, location]);

    return (
        <div className="productcomp">
            <h3 className="producth">Add Product</h3>

            <input
                type="text"
                className="productinput"
                placeholder="Enter name"
                onChange={(e) => setname(e.target.value)}
                value={name}
            />

            <input
                type="number"
                className="productinput"
                placeholder="Enter price"
                onChange={(e) => setprice(e.target.value)}
                value={price}
            />

            <input
                type="text"
                className="productinput"
                placeholder="Enter category"
                onChange={(e) => setcategory(e.target.value)}
                value={category}
            />

            <input
                type="text"
                className="productinput"
                placeholder="Enter company"
                onChange={(e) => setcompany(e.target.value)}
                value={company}
            />

            <button
                className="addproductbutton"
                type="button"
                onClick={addproduct}
            >
                Add Product
            </button>
        </div>
    );
};

export default Addproduct;
