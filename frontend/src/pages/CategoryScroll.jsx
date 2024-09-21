import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryScroll.scss'; // Include this for styling

const CategoryScroll = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home/categories');
        setCategories(response.data.categories || []);  // Handle if categories are undefined
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-scroll-container">
      <h2>Categories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="categories">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-item">
                <h3>{category.name}</h3>
                <div className="products">
                  {category.products && category.products.length > 0 ? (
                    category.products.map((product) => (
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
              </div>
            ))
          ) : (
            <p>No Categories Available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryScroll;
