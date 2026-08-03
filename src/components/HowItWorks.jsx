import React from 'react';
import { CalendarCheck, UserCheck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import './HowItWorks.css';

export default function HowItWorks({ onOpenBooking }) {
  return (
    <section id="how-it-works" className="how-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge secondary">
            <ShieldCheck size={14} />
            <span>Book in 3 Steps</span>
          </div>
          <h2 className="section-title">How HomeFix Works</h2>
          <p className="section-subtitle mx-auto">
            Booking a professional has never been simpler. Just 3 quick steps to get service at your doorstep.
          </p>
        </div>

        {/* 3-Step Timeline Grid */}
        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step-card glass-card">
            <div className="step-number-badge">01</div>
            <div className="step-icon-bg icon-blue">
              <CalendarCheck size={32} />
            </div>
            <h3 className="step-title">1. Book</h3>
            <p className="step-desc">
              Choose your required electrical or plumbing service, select your district (Kannur, Kozhikode or Kochi), and pick a convenient time slot.
            </p>
            <div className="step-footer-tag">Instant Request</div>
          </div>

          {/* Connection Indicator Arrow (Desktop) */}
          <div className="step-connector">
            <ArrowRight size={24} />
          </div>

          {/* Step 2 */}
          <div className="step-card glass-card">
            <div className="step-number-badge">02</div>
            <div className="step-icon-bg icon-green">
              <UserCheck size={32} />
            </div>
            <h3 className="step-title">2. Get Matched</h3>
            <p className="step-desc">
              We match you with a highly rated technician near your location, usually in under 2 minutes.
            </p>
            <div className="step-footer-tag">Rated Technicians</div>
          </div>

          {/* Connection Indicator Arrow (Desktop) */}
          <div className="step-connector">
            <ArrowRight size={24} />
          </div>

          {/* Step 3 */}
          <div className="step-card glass-card">
            <div className="step-number-badge">03</div>
            <div className="step-icon-bg icon-amber">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="step-title">3. Relax</h3>
            <p className="step-desc">
              Track your technician's live ETA on your phone. Get the repair completed with standard transparent billing & 30-day warranty.
            </p>
            <div className="step-footer-tag">Warranty Protected</div>
          </div>
        </div>

        {/* Bottom Callout Banner */}
        <div className="how-cta-banner">
          <div className="banner-text">
            <h3>Need an Emergency Electrician or Plumber Right Now?</h3>
            <p>Technicians available on standby in Kannur, Kozhikode & Kochi.</p>
          </div>
          <button onClick={onOpenBooking} className="btn-primary">
            <span>Book Express Service</span>
          </button>
        </div>
      </div>
    </section>
  );
}
