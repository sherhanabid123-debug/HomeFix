import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Phone, User, Mail, ShieldCheck, CheckCircle2, ArrowRight, Eye, EyeOff, Wrench, Zap, Clock, AlertTriangle, FileText } from 'lucide-react';
import { loginWithCredentials, registerCustomer, registerTechnician, resetPassword, getRegisteredUsers } from './authStore';
import { triggerGoogleLoginPopup, parseGoogleJwt } from './googleAuthService';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, initialMode = 'tech_register', initialRole = 'technician', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot' | 'tech_register' | 'tech_status' | 'google_prompt'
  const [role, setRole] = useState(initialRole); // 'customer' | 'technician'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Google OAuth State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePhone, setGooglePhone] = useState('');
  const googleBtnRef = useRef(null);

  // Technician Specific States
  const [category, setCategory] = useState('Electrician');
  const [experience, setExperience] = useState('3-5 Years');
  const [city, setCity] = useState('Kannur');
  const [govId, setGovId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAcc, setBankAcc] = useState('');

  // Tech Status Banner
  const [techStatusInfo, setTechStatusInfo] = useState(null);

  // Sync mode whenever initialMode or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'tech_register');
      setRole(initialRole || 'technician');
      setErrorMessage('');
    }
  }, [isOpen, initialMode, initialRole]);

  const handleGoogleProfileSuccess = (profile) => {
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());

    if (existing) {
      localStorage.setItem('homefix_current_user', JSON.stringify(existing));
      onAuthSuccess(existing);
      return;
    }

    setGoogleEmail(profile.email);
    setGoogleName(profile.name);
    setMode('google_prompt');
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginWithCredentials({ phoneOrEmail: phone, password });
    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    const user = res.user;

    if (user.role === 'technician') {
      if (user.status === 'pending') {
        setTechStatusInfo({
          type: 'pending',
          title: 'Application Under Review',
          msg: 'Your technician account application is currently under review by HomeFix operations team. You will receive access after approval.'
        });
        setMode('tech_status');
        return;
      } else if (user.status === 'rejected') {
        setTechStatusInfo({
          type: 'rejected',
          title: 'Application Rejected',
          msg: 'Your application was not approved at this time. Please contact HomeFix support for details.'
        });
        setMode('tech_status');
        return;
      }
    }

    onAuthSuccess(user);
  };

  const handleCustomerRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms & Privacy Policy.');
      return;
    }

    const res = registerCustomer({ name: fullName, phone, email, password });
    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    onAuthSuccess(res.user);
  };

  const handleTechRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = registerTechnician({
      name: fullName,
      phone,
      email: email || `${phone}@homefix.in`,
      password: 'techpassword123',
      category,
      experience,
      city,
      serviceAreas: `${city} Central`,
      govId,
      bankAccount: bankAcc,
      upiId
    });

    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    // Do NOT auto login for pre-launch waiting list
    localStorage.removeItem('homefix_current_user');

    setTechStatusInfo({
      type: 'pending',
      title: 'Technician Application Submitted!',
      msg: 'Thank you for joining the HomeFix Technician Waiting List. Our operations desk will review your details and contact you shortly.'
    });
    setMode('tech_status');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    const res = resetPassword({ phone, newPassword: password });
    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    setMode('login');
    setErrorMessage('');
    alert('Password reset successfully! Please sign in with your new password.');
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!googleEmail) {
      setErrorMessage('Please enter your Google email address.');
      return;
    }

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase().trim());

    if (existing) {
      localStorage.setItem('homefix_current_user', JSON.stringify(existing));
      onAuthSuccess(existing);
      return;
    }

    const newGoogleUser = {
      id: `GOOG-${Math.floor(1000 + Math.random() * 9000)}`,
      role: role === 'technician' ? 'technician' : 'customer',
      name: googleName.trim() || googleEmail.split('@')[0],
      email: googleEmail.trim().toLowerCase(),
      phone: googlePhone.trim() || '9847000000',
      city: 'Kannur',
      status: 'approved',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    const updatedUsers = [...users, newGoogleUser];
    localStorage.setItem('homefix_registered_users', JSON.stringify(updatedUsers));
    localStorage.setItem('homefix_current_user', JSON.stringify(newGoogleUser));
    onAuthSuccess(newGoogleUser);
  };

  const triggerGooglePrompt = () => {
    setErrorMessage('');
    const triggered = triggerGoogleLoginPopup({
      onSuccess: (googleProfile) => {
        handleGoogleProfileSuccess(googleProfile);
      },
      onError: (err) => {
        console.warn("Google OAuth error, using account prompt fallback:", err);
        setMode('google_prompt');
      }
    });

    if (!triggered) {
      setMode('google_prompt');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* ================= LOGIN MODE ================= */}
        {mode === 'login' && (
          <div className="auth-step-body">
            <div className="auth-header text-center">
              <div className="brand-auth-badge">
                <Zap size={22} className="text-primary" />
              </div>
              <h3 className="auth-title">Welcome to HomeFix</h3>
              <p className="auth-sub">Sign in to manage your bookings and repairs in Kerala</p>
            </div>

            {/* Google Sign In Button */}
            <button type="button" onClick={triggerGooglePrompt} className="btn-google-signin">
              <svg className="google-svg-logo" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Phone Number / Email</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input icon-indent" 
                    placeholder="98470 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="flex-between mb-1">
                  <label className="form-label mb-0">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setErrorMessage(''); }} 
                    className="forgot-link-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input icon-indent pr-10" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-4">
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer-note mt-4 text-center">
              Don’t have an account?{' '}
              <button onClick={() => { setMode('register'); setErrorMessage(''); }} className="link-text-btn">
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ================= GOOGLE PROMPT MODE ================= */}
        {mode === 'google_prompt' && (
          <div className="auth-step-body">
            <div className="auth-header text-center">
              <svg className="google-svg-logo mb-2" width="32" height="32" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="auth-title">Sign in with Google</h3>
              <p className="auth-sub">Select or enter your Google Account to continue to HomeFix</p>
            </div>

            {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

            <form onSubmit={handleGoogleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Google Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input icon-indent" 
                    placeholder="user@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input icon-indent" 
                    placeholder="Your Name"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (For service updates)</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input icon-indent" 
                    placeholder="98470 12345"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                Continue with Google Account
              </button>
            </form>

            <div className="auth-footer-note mt-3 text-center">
              <button onClick={() => setMode('login')} className="link-text-btn">
                Back to standard Sign In
              </button>
            </div>
          </div>
        )}

        {/* ================= CUSTOMER REGISTRATION MODE ================= */}
        {mode === 'register' && (
          <div className="auth-step-body">
            <div className="auth-header text-center">
              <h3 className="auth-title">Create HomeFix Account</h3>
              <p className="auth-sub">Book verified electricians and plumbers across Kerala</p>
            </div>

            {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

            <form onSubmit={handleCustomerRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input icon-indent" 
                    placeholder="Anjali Menon"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input icon-indent" 
                    placeholder="98470 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input icon-indent" 
                    placeholder="anjali@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-input icon-indent" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-input icon-indent" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label className="checkbox-row mb-4">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)} 
                />
                <span className="text-xs text-gray-600">
                  I agree to HomeFix <a href="#" className="underline">Terms of Service</a> & <a href="#" className="underline">Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="btn-primary w-full">
                Create Account & Continue
              </button>
            </form>

            <div className="auth-footer-note mt-4 text-center">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrorMessage(''); }} className="link-text-btn">
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ================= TECHNICIAN REGISTRATION MODE ================= */}
        {mode === 'tech_register' && (
          <div className="auth-step-body">
            <div className="auth-header text-center">
              <div className="brand-auth-badge green-bg">
                <Wrench size={22} className="text-secondary" />
              </div>
              <h3 className="auth-title">Join Technician Waiting List</h3>
              <p className="auth-sub">Apply to become a verified HomeFix trade partner in Kerala</p>
            </div>

            {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

            <form onSubmit={handleTechRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="94470 98765"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Trade Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="Plumber">🚰 Plumber</option>
                  </select>
                </div>
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <select className="form-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="1-3 Years">1 - 3 Years</option>
                    <option value="3-5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Primary District</label>
                  <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="Kannur">Kannur</option>
                    <option value="Kozhikode">Kozhikode</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Government ID Number (Aadhaar / Voter ID)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="XXXX-XXXX-1234"
                  value={govId}
                  onChange={(e) => setGovId(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group">
                  <label className="form-label">Bank Account Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="19283746501"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">UPI ID for Payouts</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-emerald w-full mt-3">
                Join Technician Waiting List
              </button>
            </form>
          </div>
        )}

        {/* ================= TECHNICIAN STATUS BANNER ================= */}
        {mode === 'tech_status' && techStatusInfo && (
          <div className="auth-step-body text-center">
            <div className="tech-status-icon">
              {techStatusInfo.type === 'pending' ? (
                <Clock size={52} color="#D97706" />
              ) : (
                <AlertTriangle size={52} color="#DC2626" />
              )}
            </div>
            <h3 className="auth-title">{techStatusInfo.title}</h3>
            <p className="auth-sub">{techStatusInfo.msg}</p>

            <button onClick={onClose} className="btn-primary w-full mt-4">
              Close
            </button>
          </div>
        )}

        {/* ================= FORGOT PASSWORD MODE ================= */}
        {mode === 'forgot' && (
          <div className="auth-step-body">
            <div className="auth-header text-center">
              <h3 className="auth-title">Reset Password</h3>
              <p className="auth-sub">Enter your registered phone number and new password</p>
            </div>

            {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

            <form onSubmit={handleForgotSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Registered Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input icon-indent" 
                    placeholder="98470 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-input icon-indent" 
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-input icon-indent" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Reset Password
              </button>
            </form>

            <div className="auth-footer-note mt-4 text-center">
              <button onClick={() => setMode('login')} className="link-text-btn">
                Back to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
