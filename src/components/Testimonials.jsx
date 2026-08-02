import React from 'react';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';
import './Testimonials.css';

const TESTIMONIALS_DATA = [
  {
    name: 'Anjali Menon',
    location: 'Kannur (Thana)',
    service: 'Electrical Repair & Fan Installation',
    rating: 5,
    date: '2 days ago',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    comment: 'Our main distribution box had a short circuit on a Sunday morning. HomeFix matched us with technician Rajesh in under 15 minutes. He arrived in Kannur with full tools and fixed it safely!'
  },
  {
    name: 'Firoz Moopen',
    location: 'Kozhikode (Beach Road)',
    service: 'Water Leak & Pipe Repair',
    rating: 5,
    date: '1 week ago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    comment: 'Extremely professional plumbing service. I had a concealed pipe leak in the kitchen wall. The plumber diagnosed it accurately using a detector without unnecessary wall damage. Very transparent pricing.'
  },
  {
    name: 'Dr. Priya Varma',
    location: 'Kozhikode (Mavoor Road)',
    service: 'Switchboard Replacement',
    rating: 5,
    date: '3 days ago',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    comment: 'As a working professional, scheduling home repairs used to be a hassle. With HomeFix, I picked an evening slot and received live technician tracking. Highly recommended across Kerala!'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="reviews-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge">
            <Star size={14} fill="#2563EB" color="#2563EB" />
            <span>Customer Stories</span>
          </div>
          <h2 className="section-title">Trusted by Kerala Homeowners</h2>
          <p className="section-subtitle mx-auto">
            See how HomeFix delivers peace of mind to families across Kannur and Kozhikode.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS_DATA.map((t, i) => (
            <div key={i} className="testimonial-card glass-card">
              <Quote className="quote-icon" size={32} />
              
              <div className="stars-row">
                {[...Array(t.rating)].map((_, starIdx) => (
                  <Star key={starIdx} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
                <span className="rating-num">5.0</span>
              </div>

              <p className="testimonial-text">"{t.comment}"</p>

              <div className="testimonial-footer">
                <img src={t.image} alt={t.name} className="user-avatar" />
                <div className="user-details">
                  <div className="user-name">
                    <span>{t.name}</span>
                    <CheckCircle2 size={14} className="verified-icon" />
                  </div>
                  <div className="user-meta">
                    <MapPin size={12} />
                    <span>{t.location}</span>
                  </div>
                  <div className="service-tag">{t.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
