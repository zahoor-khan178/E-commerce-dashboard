import '../Css/addproduct.css';
import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Addproduct = () => {
    const [name, setname] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [company, setcompany] = useState('');
    const [error, seterror] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Input handlers
    const changen = (e) => setname(e.target.value);
    const changep = (e) => setprice(e.target.value);
    const changecat = (e) => setcategory(e.target.value);
    const changecomp = (e) => setcompany(e.target.value);

    // Add Product Function
    const addproduct = useCallback(async () => {
        // Validation check
        if (!name || !price || !category || !company) {
            seterror(true);
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

            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:9000";

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
                onChange={changen}
                value={name}
            />
            {error && !name && <span className="invalidinput">Invalid name</span>}

            <input
                type="number"
                className="productinput"
                placeholder="Enter price"
                onChange={changep}
                value={price}
            />
            {error && !price && <span className="invalidinput">Invalid price</span>}

            <input
                type="text"
                className="productinput"
                placeholder="Enter category"
                onChange={changecat}
                value={category}
            />
            {error && !category && <span className="invalidinput">Invalid category</span>}

            <input
                type="text"
                className="productinput"
                placeholder="Enter company"
                onChange={changecomp}
                value={company}
            />
            {error && !company && <span className="invalidinput">Invalid company</span>}

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
