// import '../Css/footer.css';
import '../Css/footer.query.css';


import React from 'react'

const Footer = () => {


    return (


        <div className="footer">

            <h2 className='hedingdiv'>E-commerece dashboard</h2>
            <div className='middlediv'>
                <div>
                    <h3>Home</h3>
                    <p>The landing page that showcases featured products and provides navigation to other sections of the application.
                    </p>
                </div>
                <div>
                    <h3>Add Product</h3>
                    <p>A user-friendly interface for adding new products to the store. Administrators can input product details such as name, price, category and company.
                    </p>
                </div>
                <div>

                    <h3>Products</h3>
                    <p>Displays all available products in the form of table. Users can view product details, and search for specific product.
                    </p>
                </div>

            </div>
            <div className='listdiv'></div>
        </div>
    )


}

export default Footer;