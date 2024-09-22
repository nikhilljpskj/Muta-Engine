const Razorpay = require('razorpay');
const express = require('express');
const db = require('../config/db'); // Import your DB config

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { total_amount, rentalId, userId } = req.body;

    console.log('Received data:', { total_amount, rentalId, userId });

    const paymentStatus = 1; // Set initial payment status to 0

    // Validate inputs
    if (!total_amount || !rentalId || !userId) {
        return res.status(400).json({ message: 'Total amount, rental ID, and user ID are required' });
    }

    const totalAmount = Math.round(parseFloat(total_amount) * 100); // Convert to paise

    const options = {
        amount: totalAmount, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${rentalId}`,
    };

    try {
        // Create order in Razorpay
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order);

        // Insert payment details into the payments table, including the Razorpay order ID
        const result = await db.query(
            'INSERT INTO payments (rental_id, user_id, payment_status, amount, razorpay_order_id) VALUES (?, ?, ?, ?, ?)',
            [rentalId, userId, paymentStatus, totalAmount, order.id]
        );

        console.log('Database insert result:', result);

        // Update the rentals table to set status to 1
        const updateResult = await db.query(
            'UPDATE rentals SET status = 1 WHERE id = ?',
            [rentalId]
        );

        console.log('Rentals table update result:', updateResult);

        // Respond with the created order ID and rental ID
        res.json({ orderId: order.id, rentalId });
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
};
