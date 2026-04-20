import React, { useState, useEffect } from 'react';
import '../styles/bestSelling.css';

const BestSelling = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        // Shuffle the items for "Best Selling" as requested ("hinde mundhe madu")
        // This ensures the order is different from the fixed "Popular" section.
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">Loading fresh products for you...</div>;

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
                  <span className={`product-stock ${product.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stockStatus}
                  </span>
                </div>
              </div>
              <button 
                className="add-to-cart-btn" 
                disabled={product.stockStatus !== 'In Stock'}
                onClick={() => onAddToCart(product)}
              >
                {product.stockStatus === 'In Stock' ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSelling;
