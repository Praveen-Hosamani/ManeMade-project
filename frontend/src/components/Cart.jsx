import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/cart.css';

const Cart = ({ cart, removeFromCart, updateQuantity, clearCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 40 : 0;
  const discount = subtotal * 0.06; // 6% discount that changes as cart increases
  const total = subtotal + deliveryCharge - discount;

  const handlePlaceOrder = () => {
    navigate(`/checkout?total=${total.toFixed(2)}`);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-content">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Treat yourself to some of our best-selling products!</p>
          <Link to="/" className="continue-shopping">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <Link to="/" className="back-link">← Continue Shopping</Link>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <div className="item-meta">
                  <span className="item-weight">{item.weight}</span>
                  <span className="item-price">₹{item.price}</span>
                </div>
              </div>
              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                title="Remove Item"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charge</span>
            <span>+ ₹{deliveryCharge.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount">
              <span>Extra Discount</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
