import React, { useState } from 'react';
import { Zap, Wrench, Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@homefix.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (attempts >= 5) {
      setErrorMessage('Account locked due to too many failed attempts. Try again in 15 minutes.');
      return;
    }

    // Security Verification Simulation
    if (email.trim().toLowerCase() === 'admin@homefix.in' && password === 'admin123') {
      setErrorMessage('');
      onLoginSuccess({
        email,
        name: 'Sherhan Abid',
        role: 'Super Admin'
      });
    } else {
      setAttempts(attempts + 1);
      setErrorMessage('Invalid credentials.');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotEmailSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotEmailSent(false);
    }, 2500);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card glass-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="logo-icon-badge">
            <Zap className="icon-zap" size={22} />
            <Wrench className="icon-wrench" size={18} />
          </div>
          <div className="login-brand-title">
            <span>Home<span className="highlight">Fix</span></span>
            <span className="admin-badge">INTERNAL ADMIN</span>
          </div>
        </div>

        <p className="login-sub">Authorised Operations & Management Portal</p>

        {errorMessage && (
          <div className="login-error-alert">
            <ShieldAlert size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="form-input icon-indent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@homefix.in"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Password</label>
              <button 
                type="button" 
                className="forgot-link-btn"
                onClick={() => setForgotModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="form-input icon-indent pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-checkbox">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember session (12 Hours)</span>
            </label>
          </div>

          <button type="submit" className="btn-primary w-full login-btn">
            <span>Sign In to Admin</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="demo-credentials-box">
          <strong>🔒 Internal Demo Access:</strong>
          <div>Email: <code>admin@homefix.in</code></div>
          <div>Password: <code>admin123</code></div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="modal-overlay" onClick={() => setForgotModalOpen(false)}>
          <div className="modal-content login-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Reset Admin Password</h3>
            <p className="modal-sub">Enter your internal email address to receive password reset authorization.</p>

            {!forgotEmailSent ? (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input type="email" className="form-input" placeholder="admin@homefix.in" required />
                </div>
                <div className="modal-btn-row">
                  <button type="button" onClick={() => setForgotModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Send Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={48} color="#10B981" className="mx-auto mb-2" />
                <p className="font-bold text-dark">Reset Link Sent!</p>
                <p className="text-sm text-gray">Check your inbox for instructions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
