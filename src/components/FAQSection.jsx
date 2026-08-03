import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import './FAQSection.css';

const FAQ_DATA = [
  {
    q: 'How do I book a technician?',
    a: 'Simply click the "Book a Service" button on HomeFix, select your required service (Electrical or Plumbing), enter your address in Kannur or Kozhikode, and choose a preferred time slot. You will receive immediate SMS/WhatsApp confirmation with technician details.'
  },
  {
    q: 'Are technicians verified?',
    a: 'Yes, 100%. Every electrician and plumber on HomeFix undergoes strict background verification, government ID check, and practical trade skill evaluations before joining our Kerala network.'
  },
  {
    q: 'How do payments work?',
    a: 'Payments are completely transparent and handled after job completion. You can pay your technician directly using UPI (GPay, PhonePe, Paytm), Credit/Debit Card, or cash. You will get a digital tax invoice sent to your phone.'
  },
  {
    q: 'Can I schedule for later?',
    a: 'Absolutely! You can choose immediate express booking (arrival in < 45 minutes) or schedule a technician for a specific date and time up to 7 days in advance.'
  },
  {
    q: 'What if I’m not satisfied?',
    a: 'Customer satisfaction is guaranteed. All HomeFix services come with a 30-Day Service Guarantee. If any issue reoccurs or you are unhappy with the quality, we will dispatch a senior technician to re-inspect and fix it for free.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQ_DATA.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know about booking electricians and plumbers with HomeFix in Kerala.
          </p>
        </div>

        {/* FAQ Search Bar */}
        <div className="faq-search-wrapper">
          <Search size={18} className="faq-search-icon" />
          <input 
            type="text"
            placeholder="Search questions (e.g. payment, verification, timing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Accordion List */}
        <div className="faq-accordion-list">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item glass-card ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question-btn"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <div className="faq-toggle-icon">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Help Box */}
        <div className="faq-help-box glass-card">
          <div className="help-icon-wrapper">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4>Still have a question?</h4>
            <p>Our Kerala customer support team is available 24/7 to assist you.</p>
          </div>
          <a href="tel:+919535337959" className="btn-secondary btn-sm">
            Call Support: +91 95353 37959
          </a>
        </div>
      </div>
    </section>
  );
}
