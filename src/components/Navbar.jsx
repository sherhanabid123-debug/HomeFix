import React, { useState, useEffect } from 'react';
import { Wrench, Zap, Menu, X, ArrowRight, Clock, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenBooking, onOpenPartner, onOpenTrack, onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#" className="navbar-logo">
          <div className="logo-icon-badge">
            <Zap className="icon-zap" size={20} />
            <Wrench className="icon-wrench" size={18} />
          </div>
          <div className="logo-text">
            <span className="brand-name">Home<span className="highlight">Fix</span></span>
            <span className="brand-tag">KERALA</span>
          </div>
        </a>

        {/* Top Navigation Links */}
        <nav className="desktop-nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#services" className="nav-link">Services</a>
          <button onClick={onOpenPartner} className="nav-link-btn-text">Become a Technician</button>
          <a href="#faq" className="nav-link">Support</a>
        </nav>

        {/* CTA Actions */}
        <div className="desktop-actions">
          <button onClick={onOpenTrack} className="nav-link-btn" title="Track your live service request">
            <Clock size={16} />
            <span>Track Booking</span>
          </button>

          <button onClick={onOpenAuth} className="nav-btn-login">
            <User size={16} />
            <span>Login</span>
          </button>

          <button onClick={onOpenBooking} className="btn-primary btn-sm">
            <span>Book a Service</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#partner" onClick={() => { setMobileMenuOpen(false); onOpenPartner(); }}>Become a Technician</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Support</a>
          </nav>
          <div className="mobile-drawer-actions">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} 
              className="btn-secondary w-full mb-2"
            >
              Login
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} 
              className="btn-primary w-full mb-2"
            >
              Book a Service
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTrack(); }} 
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              <span>Track Booking</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
