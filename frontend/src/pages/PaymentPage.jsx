import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; // Assuming the Header is in the same folder structure
import Footer from '../components/Footer'; // Assuming the Footer is in the same folder structure
import './PaymentPage.scss'; // Import the SCSS file

const PaymentPage = () => {
    const { rentalId } = useParams();
    const [rentalDetails, setRentalDetails] = useState(null);
    const navigate = useNavigate(); // Initialize navigate for navigation

    useEffect(() => {
        const fetchRentalDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rentals/${rentalId}`);
                setRentalDetails(response.data);
            } catch (error) {
                console.error('Error fetching rental details:', error);
            }
        };

        fetchRentalDetails();
    }, [rentalId]);

    const handlePayment = async () => {
        if (!rentalDetails) return;

        const totalAmount = parseFloat(rentalDetails.total_price) + parseFloat(rentalDetails.total_price_gst);

        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-order', {
                total_amount: totalAmount,
                rentalId: rentalId,
                userId: rentalDetails.user_id // Pass user_id if available
            });

            const { orderId } = response.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: totalAmount * 100, // Razorpay expects amount in paise
                currency: 'INR',
                name: 'Rental Payment',
                description: 'Payment for rental',
                order_id: orderId,
                handler: async (response) => {
                    console.log('Razorpay response:', response);
                    alert('Payment successful!');
                    navigate('/orderdetails');
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    if (!rentalDetails) return <p>Loading...</p>;

    const totalAmount = parseFloat(rentalDetails.total_price) + parseFloat(rentalDetails.total_price_gst);

    return (
        <>
            <Header />
            <div className="payment-page">
                <h2>Payment for Rental</h2>
                <div className="rental-details">
                    <p>Product ID: {rentalDetails.product_id}</p>
                    <p>Quantity: {rentalDetails.quantity}</p>
                    <p>Start Date: {rentalDetails.start_date}</p>
                    <p>End Date: {rentalDetails.end_date}</p>
                    <p>Total Amount: ₹{rentalDetails.total_price}</p>
                    <p>GST Total Amount: ₹{rentalDetails.total_price_gst}</p>
                </div>
                <button className="pay-button" onClick={handlePayment}>
                    Pay ₹{totalAmount}
                </button>
            </div>
            <Footer />
        </>
    );
};

export default PaymentPage;
