import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Send, CheckCircle2, User, Phone, Mail, FileText } from 'lucide-react';
import './FAQSection.css';

const FAQ_DATA = [
  {
    q: 'How do I book a technician?',
    a: 'Simply click the "Book a Service" button on HomeFix, select your required service (Electrical or Plumbing), enter your address in Kannur, Kozhikode or Kochi, and choose a preferred time slot. You will receive immediate SMS/WhatsApp confirmation with technician details.'
  },
  {
    q: 'How do you pick your technicians?',
    a: 'Every technician builds a profile on HomeFix and gets rated by customers after each job. Anyone who consistently gets poor ratings or complaints is removed from the platform, so the people you book have a track record you can actually see.'
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
    a: 'All HomeFix services come with a 30 day service guarantee. If the same issue comes back, or you are not happy with the work, we will send a senior technician to re inspect and fix it for free.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Ask Question Form States
  const [askerName, setAskerName] = useState('');
  const [askerPhone, setAskerPhone] = useState('');
  const [askerEmail, setAskerEmail] = useState('');
  const [askerQuestion, setAskerQuestion] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQ_DATA.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAskQuestionSubmit = (e) => {
    e.preventDefault();
    if (!askerName.trim() || !askerPhone.trim() || !askerQuestion.trim()) return;

    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: askerName.trim(),
      phone: askerPhone.trim(),
      email: askerEmail.trim() || '',
      question: askerQuestion.trim(),
      status: 'Pending',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    try {
      const savedInquiries = localStorage.getItem('homefix_live_faq_questions');
      const inquiries = (savedInquiries && savedInquiries !== 'undefined') ? JSON.parse(savedInquiries) : [];
      localStorage.setItem('homefix_live_faq_questions', JSON.stringify([newInquiry, ...inquiries]));
    } catch (err) {
      console.error("Error saving FAQ question:", err);
    }

    setSubmitSuccess(true);
    setAskerName('');
    setAskerPhone('');
    setAskerEmail('');
    setAskerQuestion('');

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

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
            Everything you need to know about booking electricians and plumbers with HomeFix.
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

        {/* Ask a Question Card Form */}
        <div className="ask-question-card glass-card">
          <div className="ask-card-header">
            <div className="ask-icon-badge">
              <MessageSquare size={22} className="text-emerald" />
            </div>
            <div>
              <h3>Ask Us a Custom Question</h3>
              <p>Can't find your answer above? Submit your question and our Kerala operations team will contact you directly.</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="ask-success-alert">
              <CheckCircle2 size={18} />
              <span>Thank you! Your question has been sent to our support desk. We will reach out to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleAskQuestionSubmit} className="ask-form">
            <div className="grid-3-col">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input icon-indent" 
                    placeholder="Anjali Menon"
                    value={askerName}
                    onChange={(e) => setAskerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input 
                    type="tel" 
                    className="form-input icon-indent" 
                    placeholder="9847098765"
                    value={askerPhone}
                    onChange={(e) => setAskerPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input icon-indent" 
                    placeholder="name@email.com"
                    value={askerEmail}
                    onChange={(e) => setAskerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group mt-3">
              <label className="form-label">Your Question / Inquiry *</label>
              <textarea 
                className="form-input text-area-input" 
                placeholder="Type your detailed question here..."
                value={askerQuestion}
                onChange={(e) => setAskerQuestion(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-emerald btn-ask-submit">
              <Send size={16} />
              <span>Submit Question</span>
            </button>
          </form>
        </div>

        {/* Need More Help Box */}
        <div className="faq-help-box glass-card">
          <div className="help-icon-wrapper">
            <Phone size={24} />
          </div>
          <div>
            <h4>Need Urgent Assistance?</h4>
            <p>Our customer helpline is active for instant support in Kerala.</p>
          </div>
          <a href="tel:+919535337959" className="btn-secondary btn-sm">
            Call Helpline: +91 95353 37959
          </a>
        </div>
      </div>
    </section>
  );
}
