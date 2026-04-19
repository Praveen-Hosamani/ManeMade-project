import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/checkout.css';

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalAmount = parseFloat(new URLSearchParams(location.search).get('total')) || 0;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedAddress = localStorage.getItem('manemade_delivery_address');
    return savedAddress ? JSON.parse(savedAddress) : {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    };
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Persist address to localStorage
  useEffect(() => {
    localStorage.setItem('manemade_delivery_address', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Immediate restrictions while typing
    if (name === 'phone' || name === 'pincode') {
      if (value !== '' && !/^[0-9]+$/.test(value)) return;
      if (name === 'phone' && value.length > 10) return;
      if (name === 'pincode' && value.length > 6) return;
    }
    
    if (name === 'fullName') {
      if (value !== '' && !/^[A-Za-z\s]+$/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
        alert('Please fill in all delivery details!');
        return;
      }
      
      // Specific Validations
      if (!/^[A-Za-z\s]{2,}$/.test(formData.fullName)) {
        alert('Please enter a valid name (letters only, min 2 characters).');
        return;
      }
      
      if (!/^[0-9]{10}$/.test(formData.phone)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      
      if (!/^[0-9]{6}$/.test(formData.pincode)) {
        alert('Please enter a valid 6-digit pincode.');
        return;
      }

      if (formData.address.trim().length < 15) {
        alert('Please provide a complete and detailed address (House No, Street name, Area, etc.) for accurate delivery.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePlaceOrder = () => {
    clearCart();
    setStep(4);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderStepHeader = () => {
    if (step === 4) return null;

    const steps = [
      { id: 1, label: 'Address' },
      { id: 2, label: 'Order Summary' },
      { id: 3, label: 'Payment' }
    ];

    return (
      <div className="checkout-stepper">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <div className={`step-item ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-number">
                {step > s.id ? '✓' : s.id}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${step > s.id ? 'filled' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {renderStepHeader()}

        <div className="step-content-box">
          {step === 1 && (
            <div className="step-pane fade-in">
              <h2 className="step-title">Delivery Details</h2>
              <form className="address-form shadow-sm">
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      placeholder="Receiver's full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Complete Address</label>
                    <textarea 
                      name="address" 
                      placeholder="House No., Street, Landmark..."
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    ></textarea>
                  </div>
                  <div className="form-field">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Pincode</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      placeholder="6-digit PIN"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </form>
              <div className="step-actions">
                <button className="secondary-btn" onClick={() => navigate('/cart')}>Back to Cart</button>
                <button className="primary-btn" onClick={nextStep}>Review Order</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-pane fade-in">
              <h2 className="step-title">Order Summary</h2>
              <div className="order-summary-list">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="summary-item-total">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="summary-calc-section">
                  <div className="calc-row">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Delivery Charge</span>
                    <span>+ ₹40.00</span>
                  </div>
                  <div className="calc-row discount">
                    <span>Special Discount (6%)</span>
                    <span>- ₹{(calculateSubtotal() * 0.06).toFixed(2)}</span>
                  </div>
                  <div className="calc-divider"></div>
                  <div className="calc-row grand-total">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="delivery-preview">
                  <h4>Delivering to:</h4>
                  <p><strong>{formData.fullName}</strong></p>
                  <p>{formData.address}, {formData.city} - {formData.pincode}</p>
                  <p>Ph: {formData.phone}</p>
                </div>
              </div>
              <div className="step-actions">
                <button className="secondary-btn" onClick={prevStep}>Back</button>
                <button className="primary-btn" onClick={nextStep}>Continue to Payment</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-pane fade-in">
              <h2 className="step-title">Payment Method</h2>
              <div className="payment-selection">
                <div className={`payment-card ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                  <div className="payment-icon">⚡</div>
                  <div className="payment-info">
                    <span className="payment-name">UPI / QR</span>
                    <span className="payment-desc">Google Pay, PhonePe, Paytm</span>
                  </div>
                  <div className="payment-radio"></div>
                </div>
                <div className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <span className="payment-name">Credit / Debit Card</span>
                    <span className="payment-desc">Visa, Mastercard, RuPay</span>
                  </div>
                  <div className="payment-radio"></div>
                </div>
                <div className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                  <div className="payment-icon">🏠</div>
                  <div className="payment-info">
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-desc">Pay at your doorstep</span>
                  </div>
                  <div className="payment-radio"></div>
                </div>
              </div>
              
              <div className="final-checkout-summary">
                <div className="final-total">
                  <span>Payable Amount</span>
                  <span className="amount">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="step-actions">
                <button className="secondary-btn" onClick={prevStep}>Back</button>
                <button className="primary-btn highlight" onClick={handlePlaceOrder}>
                  Place Your Order
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="success-pane fade-in">
              <div className="success-icon-container">
                <div className="check-mark">✓</div>
              </div>
              <h2 className="success-title">Congratulations!</h2>
              <p className="success-msg">Your order has been successfully placed.</p>
              
              <div className="order-info-card">
                <div className="info-row">
                  <span>Order ID</span>
                  <span className="value">#{Math.floor(Math.random() * 900000) + 100000}</span>
                </div>
                <div className="info-row">
                  <span>Total Amount</span>
                  <span className="value">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span>Delivery Estimate</span>
                  <span className="value">⚡ 10 - 30 Min</span>
                </div>
              </div>

              <p className="thank-you-text">Thank you for choosing <strong>ManeMade</strong> for your natural skincare needs!</p>
              
              <button className="primary-btn" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
