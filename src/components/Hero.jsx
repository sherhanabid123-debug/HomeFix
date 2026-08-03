import React from 'react';
import { Star, ShieldCheck, Zap, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import './Hero.css';

export default function Hero({ onOpenBooking, onOpenPartner }) {
  return (
    <section className="hero-section">
      <div className="hero-bg-glow glow-blue"></div>
      <div className="hero-bg-glow glow-green"></div>

      <div className="container hero-container">
        {/* Left Column: Text & CTAs */}
        <div className="hero-content">
          <div className="location-pill">
            <MapPin size={16} className="pin-icon" />
            <span>Serving <strong>Kannur & Kozhikode</strong> • Expanding across Kerala</span>
          </div>

          <h1 className="hero-title">
            Book Trusted Electricians & Plumbers in <span className="highlight-gradient">Minutes.</span>
          </h1>

          <p className="hero-subtitle">
            From small repairs to emergency services, HomeFix connects you with verified local professionals across Kerala—fast, reliable, and transparent.
          </p>

          {/* Quick Value Props */}
          <div className="hero-bullets">
            <div className="bullet-item">
              <CheckCircle2 size={18} className="bullet-icon" />
              <span>Upfront Pricing</span>
            </div>
            <div className="bullet-item">
              <CheckCircle2 size={18} className="bullet-icon" />
              <span>Background Verified</span>
            </div>
            <div className="bullet-item">
              <CheckCircle2 size={18} className="bullet-icon" />
              <span>45-Min Arrival</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-cta-group">
            <button onClick={onOpenBooking} className="btn-primary hero-btn">
              <span>Book a Service</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={onOpenPartner} className="btn-secondary hero-btn">
              <span>Become a Technician</span>
            </button>
          </div>
        </div>

        {/* Right Column: Illustration & Floating Glass UI Cards */}
        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img 
              src="/images/hero.jpg" 
              alt="HomeFix Kerala verified electricians and plumbers arriving at customer home" 
              className="hero-main-image"
            />

            {/* Floating Glass UI Card 1: ⭐ 4.9 Average Rating */}
            <div className="floating-card float-rating">
              <div className="card-icon star-bg">
                <Star size={20} fill="#F59E0B" color="#F59E0B" />
              </div>
              <div className="card-info">
                <div className="card-value">⭐ 4.9 Rating</div>
                <div className="card-sub">1,200+ Kerala Customers</div>
              </div>
            </div>

            {/* Floating Glass UI Card 2: 👷 Verified Professionals */}
            <div className="floating-card float-verified">
              <div className="card-icon shield-bg">
                <ShieldCheck size={20} color="#10B981" />
              </div>
              <div className="card-info">
                <div className="card-value">👷 Verified Professionals</div>
              </div>
            </div>

            {/* Floating Glass UI Card 3: ⚡ Same-Day Service */}
            <div className="floating-card float-speed">
              <div className="card-icon zap-bg">
                <Zap size={20} color="#2563EB" />
              </div>
              <div className="card-info">
                <div className="card-value">⚡ Same-Day</div>
                <div className="card-sub">Arrives in &lt; 45 Mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
