// import '../Css/productlist.css';
import '../Css/productlist.query.css';


import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Productlist = () => {
    const [products, setProducts] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        setLoading(true); // Set loading before starting fetch
        try {
            let result = await fetch("http://localhost:9000/product");
            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }
            result = await result.json();
            setProducts(result);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]); // Ensure products array is empty on error
        } finally {
            setLoading(false); // Always set loading to false when done
        }
    };

    const deleteData = async (id) => {
        try {
            let result = await fetch(`http://localhost:9000/delete/${id}`, {
                method: 'DELETE'
            });
            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }
            result = await result.json();
            if (result) {
                getProducts();
                alert('Record is deleted.');
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert('Failed to delete record.');
        }
    };

    const handleSearch = async (event) => {
        const key = event.target.value;
        setSearchKey(key);

        if (!key.trim()) { // Use .trim() to handle whitespace
            getProducts(); // Fetch all products if search key is empty
        } else {
            setLoading(true); // Set loading while searching
            try {
                let result = await fetch(`http://localhost:9000/search/${key}`, {
                    method: "GET"
                });
                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                }
                result = await result.json();
                setProducts(result);
            } catch (error) {
                console.error("Failed to search products:", error);
                setProducts([]); // Clear products on search error
            } finally {
                setLoading(false); // Always set loading to false when done
            }
        }
    };

    // REMOVE THIS BLOCK - It's causing the input to unmount/remount
    // if (loading) {
    //     return <div className="loading-message">Loading products...</div>;
    // }

    return (
        <div className="product-table">
            <div className="search-container">
                <input
                    type="text"
                    id="search-box"
                    placeholder='search product'
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
                    {/* --- START OF CHANGES TO FIX FOCUS ISSUE --- */}
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
                                <td colSpan="6" className="no-products-message">No products found.</td>
                            </tr>
                        )
                    )}
                    
                </tbody>
            </table>
        </div>
    );
};

export default Productlist;