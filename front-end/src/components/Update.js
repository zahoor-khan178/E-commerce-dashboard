import { useState, useEffect, useCallback } from "react" // Import useCallback

import { useParams, useNavigate } from "react-router-dom"

const Update = () => {
    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [category, setcategory] = useState('')
    const [company, setcompany] = useState('')
    const [error, seterror] = useState(false) // State to manage form validation errors
    const param = useParams(); // Hook to get URL parameters (e.g., product ID)
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Handlers for input changes
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

    // Function to fetch product data for pre-filling the form - Wrapped in useCallback
    const getproductdata = useCallback(async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            // Check if user is authenticated; if not, alert and redirect to login
            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return; // Stop execution
            }

            // Fetch product data using the ID from URL parameters
            let result = await fetch(`http://localhost:9000/update/${param.id}`, {
                headers: {
                    authorization: `bearer ${token}` // Use the parsed token directly
                }
            });

            // Handle non-OK HTTP responses (e.g., 401 Unauthorized, 404 Not Found)
            if (!result.ok) {
                const errorData = await result.json();
                // Only show alert if not already on the login page (to prevent double alerts)
                if (window.location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                }

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login'); // Redirect to login
                return; // Stop execution
            }

            // Parse the successful response and set state for form fields
            result = await result.json();
            setname(result.name)
            setprice(result.price)
            setcategory(result.category)
            setcompany(result.company)
        } catch (error) {
            // Catch network errors or issues with JSON parsing
            console.error("Failed to fetch product data:", error);
            window.alert("Failed to connect to the server or an unexpected error occurred. Please try again.");
            // Optionally, navigate to a safe page or show a generic error page
        }
    }, [param.id, navigate, setname, setprice, setcategory, setcompany]); // Dependencies for useCallback

    // useEffect to call getproductdata when the component mounts or param.id changes
    useEffect(() => {
        getproductdata();
    }, [getproductdata]); // getproductdata is now a stable dependency

    // Function to update the product - Wrapped in useCallback
    const updateproduct = useCallback(async () => {
        // Form validation
        if (!name || !price || !category || !company) {
            seterror(true);
            window.alert("Please fill in all fields."); // Provide user feedback for validation
            return;
        }

        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));

        // Check authentication before sending update request
        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
        }

        try {
            // Send PUT request to update product
            let result = await fetch(`http://localhost:9000/Update/${param.id}`, {
                method: "PUT", // Use PUT for updates
                body: JSON.stringify({ name, price, category, company }),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${token}` // Use the parsed token directly
                }
            });

            // Handle non-OK HTTP responses
            if (!result.ok) {
                const errorData = await result.json();

                if (window.location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                }

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            result = await result.json();
            console.log(result); // Log response from backend

            if (result) {
                window.alert('Product updated successfully!'); // Use window.alert for consistency
                navigate('/pl'); // Navigate back to product list after successful update
            }
        } catch (err) {
            console.error('Error while updating product:', err);
            window.alert('Failed to update product due to a network error or unexpected issue.');
        }
    }, [name, price, category, company, param.id, navigate, seterror]); // Dependencies for useCallback

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

            <button className="addproductbutton" type='button' onClick={updateproduct}>Update Product</button>
        </div>
    )
}

export default Update;
