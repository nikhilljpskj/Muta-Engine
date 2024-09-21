import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductDetails.scss';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        const userId = JSON.parse(localStorage.getItem('user')).id; // Fetch user ID from localStorage
        const cartData = {
            user_id: userId,
            product_id: product.id,
            quantity: 1 // Default quantity
        };

        try {
            await axios.post('http://localhost:5000/api/cart', cartData);
            setIsPopupOpen(true); // Open the popup for confirmation
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error);
        }
    };

    const handleOrderSummary = () => {
        navigate(`/order-summary/${product.id}`); // Make sure product.id is available
    };
    

    if (!product) return <p>Loading...</p>;

    const imageUrl = product.image_urls && product.image_urls.length > 0
        ? `http://localhost:5000${product.image_urls[0]}`
        : null;

    return (
        <div className="product-details">
            <h2>{product.name}</h2>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                />
            ) : (
                <p>No Image Available</p>
            )}
            <p>Price: ${product.price_per_day}</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category_name}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>

            {isPopupOpen && (
                <div className="popup">
                    <h3>Item Added to Cart</h3>
                    <img src={imageUrl} alt={product.name} />
                    <p>Name: {product.name}</p>
                    <p>Price: ${product.price_per_day}</p>
                    <button onClick={handleOrderSummary}>Order Summary</button>
                    <button onClick={() => setIsPopupOpen(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
