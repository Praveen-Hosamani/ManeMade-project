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
      email: '',
    };
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showQRCode, setShowQRCode] = useState(false);
  const [payConfirm, setPayConfirm] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset payConfirm whenever modal is opened
  useEffect(() => {
    if (!showQRCode) setPayConfirm(false);
  }, [showQRCode]);

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

    if (name === 'email') {
      // Basic email syntax check while typing could be too intrusive, so we just set it
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

      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        const currentUser = JSON.parse(localStorage.getItem('manemade_user'));
        if (!currentUser && !formData.email) {
          alert('Please enter a valid email address for order updates.');
          return;
        }
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'upi') {
      setShowQRCode(true);
    } else {
      processOrder();
    }
  };

  const processOrder = async () => {
    setLoading(true);
    const currentUser = JSON.parse(localStorage.getItem('manemade_user'));
    
    // Guest check: If not logged in, we use the email from the form
    const emailToUse = currentUser ? currentUser.email : formData.email;
    
    if (!emailToUse) {
      alert('Email is required for the order.');
      setLoading(false);
      return;
    }

    const orderData = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      email: currentUser ? currentUser.email : formData.email,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderId(data.orderId);
        clearCart();
        setShowQRCode(false);
        setStep(4);
      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
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
                  <div className="form-field full-width">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="For order updates"
                      value={formData.email}
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
                    <span>+ ₹8.00</span>
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
                <button className="primary-btn highlight" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Your Order'}
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
                  <span className="value">#{orderId || 'PENDING'}</span>
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

      {showQRCode && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card fade-in">
            <button className="close-modal" onClick={() => setShowQRCode(false)}>×</button>
            <div className="payment-modal-header">
              <h3>Scan & Pay</h3>
              <p>Complete payment to proceed</p>
            </div>
            
            <div className="qr-container">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=8792331970-2@ybl&pn=ManeMade&am=${totalAmount}&cu=INR`)}`} 
                alt="Payment QR Code" 
                className="payment-qr"
              />
              <div className="upi-id-badge">8792331970-2@ybl</div>
            </div>

            <div className="payment-amount-section">
              <span className="pay-label">Total to Pay</span>
              <h2 className="pay-amount">₹{totalAmount.toFixed(2)}</h2>
            </div>

            <div className="modal-actions">
              <button 
                className={`primary-btn highlight full-width ${payConfirm ? 'confirming' : ''}`} 
                onClick={() => {
                  if (!payConfirm) {
                    setPayConfirm(true);
                  } else {
                    processOrder();
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : (payConfirm ? 'Confirm: I Have Paid' : 'i have Paid')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
