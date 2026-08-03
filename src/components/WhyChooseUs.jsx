import React from 'react';
import { ShieldCheck, Tag, Zap, Lock, MapPin, Headphones } from 'lucide-react';
import './WhyChooseUs.css';

const WHY_CARDS = [
  {
    icon: ShieldCheck,
    title: 'Rated By Real Customers',
    desc: 'Every job gets reviewed. Technicians with poor ratings get dropped from the platform.',
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
    desc: 'Average technician arrival time under 45 minutes anywhere in Kannur, Kozhikode & Kochi.',
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
    desc: 'Follow every step of your booking, from confirmed to on the way to done.',
    color: 'green'
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Dedicated support team ready to assist with scheduling, queries, and feedback.',
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
            No more asking neighbors for a plumber's number or waiting around all day. Every technician on HomeFix is checked and rated before they reach your door.
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
