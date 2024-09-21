import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderSummary.scss';

const OrderSummary = () => {
    const { productId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${productId}`);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [productId]);

    useEffect(() => {
        calculateTotalPrice();
    }, [startDate, endDate, quantity, orderDetails]);

    const calculateTotalPrice = () => {
        const gst = 0.18; // 18%
        let total = 0;

        if (orderDetails) {
            const days = calculateDaysBetween(startDate, endDate);
            if (days > 0) {
                total = orderDetails.price_per_day * quantity * days;
            }
        }

        setTotalPrice(total);
    };

    const calculateDaysBetween = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const differenceInTime = endDate - startDate;
        return Math.ceil(differenceInTime / (1000 * 3600 * 24));
    };

    const handleProceedToPayment = () => {
        // Logic for proceeding to payment
    };

    if (!orderDetails) return <p>Loading...</p>;

    const imageUrl = orderDetails.image_urls && orderDetails.image_urls.length > 0
        ? `http://localhost:5000${orderDetails.image_urls[0]}`
        : null;

    return (
        <div className="order-summary">
            <h2>Rental Summary</h2>
            <div className="order-item">
                {imageUrl ? (
                    <img src={imageUrl} alt={orderDetails.name} className="product-image" />
                ) : (
                    <div className="no-image">No Image Available</div>
                )}
                <div className="order-details">
                    <h3>{orderDetails.name}</h3>
                    <p>Price per Day: <span>${orderDetails.price_per_day}</span></p>
                    <label>
                        Quantity:
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={e => setQuantity(Math.max(1, e.target.value))} 
                            min="1" 
                        />
                    </label>
                </div>
            </div>
            <div className="date-picker">
                <label>
                    Start Date:
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                    />
                </label>
                <label>
                    End Date:
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                    />
                </label>
            </div>
            <div className="totals">
                <p>Total: <span>${totalPrice.toFixed(2)}</span></p>
                <p>GST (18%): <span>${(totalPrice * 0.18).toFixed(2)}</span></p>
                <p>Grand Total: <span>${(totalPrice * 1.18).toFixed(2)}</span></p>
            </div>
            <button className="proceed-button" onClick={handleProceedToPayment}>Proceed to Payment</button>
        </div>
    );
};

export default OrderSummary;
