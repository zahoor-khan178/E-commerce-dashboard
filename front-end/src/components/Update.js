import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Update = () => {
    const [name, setname] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [company, setcompany] = useState('');
    const [error, seterror] = useState(false);

    const param = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Get API base URL from .env
    const API_URL = process.env.REACT_APP_API_URL;

    // Input handlers
    const changen = (event) => setname(event.target.value);
    const changep = (event) => setprice(event.target.value);
    const changecat = (event) => setcategory(event.target.value);
    const changecomp = (event) => setcompany(event.target.value);

    // Fetch product data
    const getproductdata = useCallback(async () => {
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

            let result = await fetch(`${API_URL}/update/${param.id}`, {
                headers: {
                    authorization: `bearer ${token}`
                }
            });

            if (!result.ok) {
                const errorData = await result.json();
                if (window.location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            result = await result.json();
            setname(result.name);
            setprice(result.price);
            setcategory(result.category);
            setcompany(result.company);
        } catch (error) {
            console.error("Failed to fetch product data:", error);
            window.alert("Failed to connect to the server or an unexpected error occurred. Please try again.");
        }
    }, [param.id, navigate, location, API_URL]);

    useEffect(() => {
        getproductdata();
    }, [getproductdata]);

    // Update product
    const updateproduct = useCallback(async () => {
        if (!name || !price || !category || !company) {
            seterror(true);
            window.alert("Please fill in all fields.");
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

        try {
            let result = await fetch(`${API_URL}/update/${param.id}`, {
                method: "PUT",
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${token}`
                }
            });

            if (!result.ok) {
                const errorData = await result.json();
                if (window.location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            result = await result.json();
            console.log(result);

            if (result) {
                window.alert('Product updated successfully!');
                navigate('/pl');
            }
        } catch (err) {
            console.error('Error while updating product:', err);
            window.alert('Failed to update product due to a network error or unexpected issue.');
        }
    }, [name, price, category, company, param.id, navigate, location, API_URL]);

    return (
        <div className="productcomp">
            <h3 className="producth">Update Product</h3>

            <input type="text" className="productinput" placeholder='Enter name' onChange={changen} value={name} />
            {error && !name && <span className="invalidinput">Invalid name</span>}

            <input type="number" className="productinput" placeholder='Enter price' onChange={changep} value={price} />
            {error && !price && <span className="invalidinput">Invalid price</span>}

            <input type="text" className="productinput" placeholder='Enter category' onChange={changecat} value={category} />
            {error && !category && <span className="invalidinput">Invalid category</span>}

            <input type="text" className="productinput" placeholder='Enter company' onChange={changecomp} value={company} />
            {error && !company && <span className="invalidinput">Invalid company</span>}

            <button className="addproductbutton" type='button' onClick={updateproduct}>
                Update Product
            </button>
        </div>
    )
}

export default Update;
