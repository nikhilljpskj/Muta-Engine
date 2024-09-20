// src/pages/Product.jsx
import React from 'react';
import './Product.scss';

const Product = ({ name, price }) => {
    return (
        <div className="product">
            <div className="product__image">
                <img src={`/images/${name.toLowerCase()}.jpg`} alt={name} />
            </div>
            <div className="product__details">
                <h3>{name}</h3>
                <p>{price}</p>
            </div>
        </div>
    );
};

export default Product;
