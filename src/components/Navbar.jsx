import React, { useState, useEffect } from 'react';
import { Wrench, Zap, Menu, X, ArrowRight, Clock } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenBooking, onOpenPartner, onOpenTrack }) {
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

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <a href="#services" className="nav-link">Popular Services</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#why-us" className="nav-link">Why HomeFix</a>
          <a href="#coverage" className="nav-link">Service Areas</a>
          <a href="#testimonials" className="nav-link">Reviews</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>

        {/* CTA Actions */}
        <div className="desktop-actions">
          <button onClick={onOpenTrack} className="nav-link-btn" title="Track your live service request">
            <Clock size={16} />
            <span>Track Booking</span>
          </button>

          <button onClick={onOpenPartner} className="nav-btn-partner">
            Become a Technician
          </button>
          <button onClick={onOpenBooking} className="btn-primary btn-sm">
            <span>Book Now</span>
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
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Popular Services</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)}>Why HomeFix</a>
            <a href="#coverage" onClick={() => setMobileMenuOpen(false)}>Service Areas</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          </nav>
          <div className="mobile-drawer-actions">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTrack(); }} 
              className="btn-secondary w-full flex items-center justify-center gap-2 mb-2"
            >
              <Clock size={18} />
              <span>Track Booking</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} 
              className="btn-primary w-full"
            >
              Book a Service
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenPartner(); }} 
              className="btn-secondary w-full"
            >
              Become a Technician
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
