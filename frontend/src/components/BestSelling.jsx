import React from 'react';
import '../styles/bestSelling.css';
import { products } from '../data/products';

const BestSelling = ({ onAddToCart }) => {

  return (
    <section id="best-selling" className="best-selling-section">
      <h2 className="best-selling-title">Best Selling Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <div className="product-name-price">
                <div className="name-weight">
                  <span className="product-name">{product.name}</span>
                  <span className="product-weight">{product.weight}</span>
                </div>
                <div className="price-stock">
                  <span className="product-price">₹{product.price}</span>
                  <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <button 
                className="add-to-cart-btn" 
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product)}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
