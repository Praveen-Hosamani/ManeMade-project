import React, { useState, useRef, useEffect } from 'react';
import '../styles/loginModal.css';
import { sendOTPEmail } from '../services/emailjs-service';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Registration
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Generate OTP from Backend
      const response = await fetch('http://localhost:8080/api/auth/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        // Step 2: Send OTP via EmailJS
        const emailResult = await sendOTPEmail(email, data.otp);
        if (emailResult.success) {
          setStep(2);
        } else {
          setError('Failed to send email. Please check EmailJS configuration.');
        }
      } else {
        setError(data.message || 'Failed to generate OTP');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.isNewUser) {
          setUserData(data.user); // Store basic user info
          setStep(3); // Go to Name Entry step
        } else {
          onLoginSuccess(data.user); // Returning user, login directly
          onClose();
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName })
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {step === 1 ? (
          <div className="login-step">
            <h2>Login to your Account</h2>
            <p>Enter your email address to receive an OTP</p>
            
            <form onSubmit={handleSendOTP}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              
              {error && <p className="error-msg">{error}</p>}
              
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </div>
        ) : step === 2 ? (
          <div className="verify-step">
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit code we sent to<br/><strong>{email}</strong></p>
            
            <form onSubmit={handleVerifyOTP}>
              <div className="otp-inputs">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpRefs.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e) }
                    required
                  />
                ))}
              </div>
              
              <div className="resend-container">
                <p>Didn't receive the code? <button type="button" className="resend-link" onClick={() => setStep(1)}>Resend OTP</button></p>
              </div>

              {error && <p className="error-msg">{error}</p>}
              
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          </div>
        ) : (
          <div className="register-step">
            <h2>Complete your Profile</h2>
            <p>Tell us a bit about yourself</p>
            
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
              
              {error && <p className="error-msg">{error}</p>}
              
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Finish & Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
