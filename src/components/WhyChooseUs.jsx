import React from 'react';
import { ShieldCheck, Tag, Zap, Lock, MapPin, Headphones } from 'lucide-react';
import './WhyChooseUs.css';

const WHY_CARDS = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    desc: '100% background checked and skill-evaluated trade experts.',
    color: 'blue'
  },
  {
    icon: Tag,
    title: 'Transparent Pricing',
    desc: 'Know exact rates beforehand. No surprise surge charges or hidden convenience fees.',
    color: 'green'
  },
  {
    icon: Zap,
    title: 'Fast Response',
    desc: 'Average technician arrival time under 45 minutes anywhere in Kannur & Kozhikode.',
    color: 'amber'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    desc: 'Pay after service completion via UPI, Credit Card, or Cash with digital receipt.',
    color: 'blue'
  },
  {
    icon: MapPin,
    title: 'Live Booking Status',
    desc: 'Real-time GPS tracking of your technician’s travel status and estimated arrival.',
    color: 'green'
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Dedicated Kerala support team ready to assist with scheduling, queries, and feedback.',
    color: 'amber'
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="why-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge">
            <ShieldCheck size={14} />
            <span>Why Homeowners Trust Us</span>
          </div>
          <h2 className="section-title">Why Choose HomeFix</h2>
          <p className="section-subtitle mx-auto">
            We are redefining home maintenance in Kerala by bringing reliability, safety, and modern convenience to every doorway.
          </p>
        </div>

        <div className="why-grid">
          {WHY_CARDS.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="why-card glass-card">
                <div className={`why-icon-box ${card.color}`}>
                  <IconComponent size={28} />
                </div>
                <h3 className="why-card-title">{card.title}</h3>
                <p className="why-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
