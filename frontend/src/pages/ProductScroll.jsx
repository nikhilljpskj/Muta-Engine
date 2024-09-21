import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductScroll.scss'; // Include this for styling

const ProductScroll = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home/products');
                setProducts(response.data.products || []);  // Handle if products are undefined
            } catch (error) {
                console.error('Error fetching products:', error.response?.data || error.message);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-scroll-container">
            <h2>Products</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="products">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="product-item">
                                {product.image ? (
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                                <p>{product.name}</p>
                                <p>Price per day: ${product.price_per_day}</p>
                            </div>
                        ))
                    ) : (
                        <p>No Products Available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductScroll;
