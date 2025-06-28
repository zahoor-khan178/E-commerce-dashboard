// import '../Css/productlist.css'; // Assuming these CSS files exist and are correctly linked
import '../Css/productlist.query.css';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Productlist = () => {
    const [products, setProducts] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // Corrected variable name from 'nevigate' to 'navigate'

    useEffect(() => {
        // Initial fetch of products when the component mounts
        getProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Function to fetch products from the backend
    const getProducts = async () => {
        setLoading(true); // Set loading state to true while fetching

        try {
            // Retrieve token from local storage
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user')); // Also get user data

            // If no token or user data found, redirect to login immediately
            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token'); // Clear token
                localStorage.removeItem('user');   // Clear user data
                setProducts([]); // Clear products state
                navigate('/login'); // Redirect to login page
                return; // *** CRITICAL: Stop execution here ***
            }

            // Make the API call to fetch products
            let result = await fetch("http://localhost:9000/product", {
                headers: {
                    authorization: `bearer ${token}` // Attach token to headers
                }
            });

            // Check if the response was not successful (e.g., 401, 403 status)
            if (!result.ok) {
                const errorData = await result.json(); // Parse the error message from the backend
                // Display the alert message received from the backend
                
                localStorage.removeItem('token'); // Clear token
                localStorage.removeItem('user');   // Clear user data
                setProducts([]); // Clear products state
                
                alert(errorData.message || `HTTP error! Status: ${result.status}`);
                // IMPORTANT: Navigate immediately after the alert and state cleanup
                navigate('/login');

                // *** CRITICAL: Return immediately to prevent any further code execution
                //    in this function after navigation has been initiated. This prevents
                //    any potential race conditions or re-renders that could cause a second alert. ***
                return;
            }

            // If successful, parse the JSON response and update products state
            result = await result.json();
            setProducts(result);

        } catch (error) {
            // Catch network errors or issues with parsing JSON
            console.error("Failed to fetch products:", error);
            window.alert("Failed to connect to the server or an unexpected error occurred. Please try again.");
            setProducts([]); // Ensure products array is empty on error
        } finally {
            // Always set loading to false, but only if we are still on this page
            // (i.e., not redirected to login already). This helps prevent state updates on unmounted components.
            if (window.location.pathname !== '/login') {
                setLoading(false);
            }
        }
    };

    // Function to delete a product
    const deleteData = async (id) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            let result = await fetch(`http://localhost:9000/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${token}`
                }
            });

            if (!result.ok) {
                const errorData = await result.json();
                window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            result = await result.json();
            if (result) {
                getProducts(); // Re-fetch products to update the list
                alert('Record is deleted successfully.'); // Alert for successful delete
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert('Failed to delete record due to a network error or unexpected issue.');
        }
    };

    // Function to handle product search
    const handleSearch = async (event) => {
        const key = event.target.value;
        setSearchKey(key); // Update search input state

        if (!key.trim()) { // If search key is empty, fetch all products
            getProducts();
        } else {
            setLoading(true); // Set loading while searching
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const user = JSON.parse(localStorage.getItem('user'));

                if (!token || !user) {
                    window.alert("Your session has expired or you are not logged in. Please log in again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }

                let result = await fetch(`http://localhost:9000/search/${key}`, {
                    method: "GET",
                    headers: {
                        authorization: `bearer ${token}`
                    }
                });

                if (!result.ok) {
                    const errorData = await result.json();
                    window.alert(errorData.message || `HTTP error! Status: ${result.status}`);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }

                result = await result.json();
                setProducts(result); // Update products with search results
            } catch (error) {
                console.error("Failed to search products:", error);
                setProducts([]); // Clear products on search error
            } finally {
                if (window.location.pathname !== '/login') {
                    setLoading(false); // Always set loading to false when done
                }
            }
        }
    };

    return (
        <div className="product-table">
            <div className="search-container">
                <input
                    type="text"
                    id="search-box"
                    placeholder='Search product'
                    onChange={handleSearch}
                    value={searchKey}
                />
            </div>

            <table className="product-list">
                <thead>
                    <tr className="table-header-row">
                        <th className="th-cell">S.No</th>
                        <th className="th-cell">Name</th>
                        <th className="th-cell">Price</th>
                        <th className="th-cell">Category</th>
                        <th className="th-cell">Company</th>
                        <th className="th-cell">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Conditional rendering for loading state, no products, or product list */}
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="loading-message">Loading products...</td>
                        </tr>
                    ) : (
                        products.length > 0 ? (
                            products.map((product, index) => (
                                <tr className="table-row" key={product._id || index}> {/* Use _id for key if available, fallback to index */}
                                    <td className="td-cell">{index + 1}</td>
                                    <td className="td-cell">{product.name}</td>
                                    <td className="td-cell">{product.price}</td>
                                    <td className="td-cell">{product.category}</td>
                                    <td className="td-cell">{product.company}</td>
                                    <td className="td-cell button-cell">
                                        <button type='button' className='delete' onClick={() => deleteData(product._id)}>Delete</button>
                                        <Link to={`/up/${product._id}`} className='update-button-style'>Update</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-products-message">No products found. Please add some or check your search.</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Productlist;
