import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import LoginModal from './LoginModal';

const Navbar = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('manemade_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all products for search
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products for navbar:', err));
  }, []);

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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('manemade_user');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
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
        {user ? (
          <div 
            className="user-profile-container" 
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <div className="user-profile">
              <div className="profile-icon-wrapper">
                <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="user-name">{user.firstName || user.email.split('@')[0]}</span>
              <svg className={`chevron-icon ${showProfileDropdown ? 'rotate' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <div className="item-icon profile">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <span>My Profile</span>
                </Link>
                <Link to="/my-orders" className="dropdown-item">
                  <div className="item-icon orders">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  </div>
                  <span>My Orders</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="dropdown-item">
                    <div className="item-icon admin">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <div className="item-icon logout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="action-btn" onClick={() => setIsLoginModalOpen(true)}>Login</button>
        )}
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem('manemade_user', JSON.stringify(userData));
        }}
      />
    </nav>
  );
};

export default Navbar;
