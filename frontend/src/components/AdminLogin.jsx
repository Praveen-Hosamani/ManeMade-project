import React, { useState } from 'react';
import '../styles/adminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Adding a slight delay for better UX (feels like it's checking)
    setTimeout(() => {
      if (password === 'PRAVEENp@123') {
        sessionStorage.setItem('admin_authenticated', 'true');
        onLogin();
      } else {
        setError('Invalid admin password. Access denied.');
        setPassword('');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1>Admin Access</h1>
          <p>Please enter your secret password to continue</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-password">Secure Password</label>
            <div className="password-input-wrapper">
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                Unlock Dashboard
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
