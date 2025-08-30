import '../Css/productlist.query.css';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Productlist = () => {
    const [products, setProducts] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Use API URL from environment variables
    const API_URL = process.env.REACT_APP_API_URL;

    // Function to fetch products from the backend - Wrapped in useCallback
    const getProducts = useCallback(async () => {
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setProducts([]);
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            let result = await fetch(`${API_URL}/product`, {
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
                setProducts([]);
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            result = await result.json();
            setProducts(result);

        } catch (error) {
            console.error("Failed to fetch products:", error);
            window.alert("Failed to connect to the server or an unexpected error occurred. Please try again.");
            setProducts([]);
        } finally {
            if (window.location.pathname !== '/login') {
                setLoading(false);
            }
        }
    }, [navigate, location, API_URL]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    // Function to delete a product - Wrapped in useCallback
    const deleteData = useCallback(async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this record?");

        if (!confirm) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user) {
                window.alert("Your session has expired or you are not logged in. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setProducts([]);
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            let result = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
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
                setProducts([]);
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            result = await result.json();
            if (result) {
                getProducts();
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            window.alert('Failed to delete record due to a network error or unexpected issue.');
        } finally {
            if (window.location.pathname !== '/login') {
                setLoading(false);
            }
        }
    }, [getProducts, navigate, location, API_URL]);

    // Function to handle product search - Wrapped in useCallback
    const handleSearch = useCallback(async (event) => {
        const key = event.target.value;
        setSearchKey(key);

        if (!key.trim()) {
            getProducts();
        } else {
            setLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const user = JSON.parse(localStorage.getItem('user'));

                if (!token || !user) {
                    window.alert("Your session has expired or you are not logged in. Please log in again.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setProducts([]);
                    navigate('/login', { state: { from: location.pathname } });
                    return;
                }

                let result = await fetch(`${API_URL}/search/${key}`, {
                    method: "GET",
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
                    setProducts([]);
                    navigate('/login', { state: { from: location.pathname } });
                    return;
                }

                result = await result.json();
                setProducts(result);
            } catch (error) {
                console.error("Failed to search products:", error);
                setProducts([]);
            } finally {
                if (window.location.pathname !== '/login') {
                    setLoading(false);
                }
            }
        }
    }, [getProducts, navigate, location, API_URL]);

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
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="loading-message">Loading products...</td>
                        </tr>
                    ) : (
                        products.length > 0 ? (
                            products.map((product, index) => (
                                <tr className="table-row" key={product._id || index}>
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
