import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Product.scss';

const Product = () => {
    const [sort, setSort] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSort = (e) => {
        const value = e.target.value;
        setSort(value);
        if (value === 'price-low-high') {
            setFilteredProducts([...products].sort((a, b) => a.price_per_day - b.price_per_day));
        } else if (value === 'price-high-low') {
            setFilteredProducts([...products].sort((a, b) => b.price_per_day - a.price_per_day));
        }
    };

    return (
        <div className="product-page">
            <div className="filter-sort">
                <select onChange={handleSort} value={sort}>
                    <option value="">Sort By</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                </select>
                <button>Filter</button>
            </div>
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-item">
                            {product.image_urls && product.image_urls.length > 0 ? (
                                <img
                                    src={`http://localhost:5000${product.image_urls[0]}`}
                                    alt={product.name}
                                    className="product-image"
                                    onClick={() => navigate(`/product/${product.id}`)} // Use navigate for redirection
                                />
                            ) : (
                                <p>No Image Available</p>
                            )}
                            <p>{product.name}</p>
                            <p>Price: ${product.price_per_day}</p>
                            <p>Category: {product.category_name}</p>
                        </div>
                    ))
                ) : (
                    <p>No Products Available</p>
                )}
            </div>
        </div>
    );
};

export default Product;
