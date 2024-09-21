const express = require('express');
const orderController = require('../controllers/orderController'); // Adjust the path as needed
const router = express.Router();

router.get('/cart/:productId', orderController.getOrderSummary);

module.exports = router;
