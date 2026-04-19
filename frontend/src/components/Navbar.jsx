import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { products } from '../data/products';

const Navbar = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Filtering
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== '') {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleItemClick = (productId) => {
    setShowDropdown(false);
    setSearchQuery('');
    
    // If not on home page, navigate home first
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('best-selling');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('best-selling');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/Items/ManeMade-logo.png" alt="ManeMade Logo" />
      </Link>

      <div className="navbar-search" ref={dropdownRef}>
        <div className={`search-input-wrapper ${searchQuery.length > 0 ? 'search-active' : ''}`}>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery.trim() !== '' && setShowDropdown(true)}
          />
          <button className="search-button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Search Results Dropdown */}
          {showDropdown && filteredProducts.length > 0 && (
            <div className="search-results-dropdown">
              <ul className="results-list">
                {filteredProducts.map((product) => (
                  <li 
                    key={product.id} 
                    className="result-item"
                    onClick={() => handleItemClick(product.id)}
                  >
                    <img src={product.image} alt={product.name} className="result-thumb" />
                    <div className="result-info">
                      <span className="result-name">{product.name}</span>
                      <span className="result-price">₹{product.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showDropdown && filteredProducts.length === 0 && (
            <div className="search-results-dropdown no-results">
              No products found
            </div>
          )}
        </div>
      </div>

      <div className="navbar-actions">
        <button className="action-btn">Login</button>
        <Link to="/cart" className="action-btn cart-btn">
          Cart
          <div className="cart-icon-wrapper">
            <svg className="cart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
