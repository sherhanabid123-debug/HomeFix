import React from 'react';
import { Briefcase, CheckCircle2, ArrowRight, Shield, CreditCard, Clock, TrendingUp } from 'lucide-react';
import './PartnerSection.css';

export default function PartnerSection({ onOpenPartner }) {
  return (
    <section id="partner" className="partner-section">
      <div className="container">
        <div className="partner-card-wrapper glass-card">
          <div className="partner-grid">
            {/* Left Content */}
            <div className="partner-content">
              <div className="section-badge secondary">
                <Briefcase size={14} />
                <span>Technician Network</span>
              </div>

              <h2 className="partner-headline">
                Earn More with <span className="highlight-emerald">HomeFix</span>
              </h2>

              <p className="partner-text">
                Join our growing network of verified electricians and plumbers. Get more customer bookings, flexible work schedules, and reliable daily payouts.
              </p>

              <div className="partner-features">
                <div className="pf-item">
                  <div className="pf-icon"><CreditCard size={20} /></div>
                  <div>
                    <h4>Timely Payouts</h4>
                    <p>Daily or weekly payouts straight into your bank account.</p>
                  </div>
                </div>

                <div className="pf-item">
                  <div className="pf-icon"><Clock size={20} /></div>
                  <div>
                    <h4>Flexible Work Hours</h4>
                    <p>Choose your preferred service slots and working radius.</p>
                  </div>
                </div>

                <div className="pf-item">
                  <div className="pf-icon"><TrendingUp size={20} /></div>
                  <div>
                    <h4>More Customers</h4>
                    <p>Access thousands of homeowners in Kannur & Kozhikode.</p>
                  </div>
                </div>

                <div className="pf-item">
                  <div className="pf-icon"><Shield size={20} /></div>
                  <div>
                    <h4>Support When You Need It</h4>
                    <p>Reach our partner support line if a job goes sideways or a customer doesn't show.</p>
                  </div>
                </div>
              </div>

              <div className="partner-cta">
                <button onClick={onOpenPartner} className="btn-emerald hero-btn">
                  <span>Become a Technician</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="partner-visual">
              <div className="partner-img-wrapper">
                <img 
                  src="/images/partner.jpg" 
                  alt="HomeFix electrician and plumber technician holding smartphone" 
                  className="partner-img"
                />
                
                {/* Floating Partner Stat Card */}
                <div className="partner-stat-card">
                  <div className="stat-val">₹35,000+</div>
                  <div className="stat-lbl">Avg. Monthly Technician Earnings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
