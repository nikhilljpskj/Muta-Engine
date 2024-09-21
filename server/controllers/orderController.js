const db = require('../config/db'); // Adjust the path as needed

exports.getOrderSummary = (req, res) => {
    const { productId } = req.params;

    const productSql = `
        SELECT p.id, p.name, p.description, p.price_per_day, p.availability, p.stock,
               cart.quantity,
               GROUP_CONCAT(pi.image_url SEPARATOR ',') AS image_urls
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN cart ON cart.product_id = p.id
        WHERE p.id = ?
        GROUP BY p.id
    `;

    db.query(productSql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching order summary:', err);
            return res.status(500).json({ message: 'Error fetching order summary', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Convert image_urls to an array and ensure only one instance of '/uploads/products/' is prepended
        const product = results[0];
        if (product.image_urls) {
            product.image_urls = product.image_urls.split(',').map(imageUrl => {
                if (!imageUrl.startsWith('/uploads/products/')) {
                    return `/uploads/products/${imageUrl}`;
                }
                return imageUrl; // Return as is if it already contains the prefix
            });
        } else {
            product.image_urls = [];
        }

        res.status(200).json(product); // Send back the product details
    });
};
