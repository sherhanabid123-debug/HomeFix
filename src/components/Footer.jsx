import React from 'react';
import { Zap, Wrench, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer({ onOpenBooking, onOpenPartner }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container">
        {/* Top Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-brand-col">
            <a href="#" className="navbar-logo">
              <div className="logo-icon-badge">
                <Zap className="icon-zap" size={20} />
                <Wrench className="icon-wrench" size={18} />
              </div>
              <div className="logo-text">
                <span className="brand-name white-text">Home<span className="highlight">Fix</span></span>
                <span className="brand-tag">KERALA</span>
              </div>
            </a>

            <p className="footer-tagline">
              Trusted electricians and plumbers, on demand. Connecting Kerala homeowners with background checked trade experts.
            </p>

            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#services">Popular Services</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#why-us">Why Choose Us</a></li>
              <li><a href="#coverage">Service Areas</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenPartner(); }}>Become a Technician</a></li>
              <li><a href="#faq">FAQ & Support</a></li>
            </ul>
          </div>

          {/* Column 3: Service Cities */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Service Areas</h4>
            <ul className="footer-links-list">
              <li><a href="#coverage"><MapPin size={14} /> Kannur (Active)</a></li>
              <li><a href="#coverage"><MapPin size={14} /> Kozhikode (Active)</a></li>
              <li><a href="#coverage"><MapPin size={14} /> Kochi (Coming Soon)</a></li>
              <li><a href="#coverage"><MapPin size={14} /> Thrissur (Coming Soon)</a></li>
              <li><a href="#coverage"><MapPin size={14} /> Trivandrum (Coming Soon)</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Contact & Help</h4>
            <ul className="footer-contact-list">
              <li>
                <Phone size={16} />
                <span>+91 95353 37959</span>
              </li>
              <li>
                <Mail size={16} />
                <span>support@homefixkerala.com</span>
              </li>
            </ul>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} HomeFix. All Rights Reserved. Made for Kerala.</p>
          
          <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
