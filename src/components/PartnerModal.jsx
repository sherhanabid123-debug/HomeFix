import React, { useState } from 'react';
import { X, Briefcase, CheckCircle2, ShieldCheck, MapPin, Phone, User, Award } from 'lucide-react';
import './PartnerModal.css';

export default function PartnerModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trade: 'Electrician',
    district: 'Kannur',
    phone: '',
    experience: '3-5 years'
  });

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content partner-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <div className="modal-body-step">
            <div className="modal-header-icon emerald-bg">
              <Briefcase size={24} />
            </div>
            <h3 className="modal-title">Become a HomeFix Technician</h3>
            <p className="modal-sub">Earn steady daily income serving Kannur & Kozhikode.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text"
                    className="form-input icon-indent"
                    placeholder="e.g. Suresh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Trade Skill</label>
                <select 
                  className="form-select"
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                >
                  <option value="Electrician">⚡ Licensed Electrician</option>
                  <option value="Plumber">🚰 Experienced Plumber</option>
                  <option value="Both Electrical & Plumbing">🛠️ Both Electrical & Plumbing Expert</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary District</label>
                <select 
                  className="form-select"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  <option value="Kannur">Kannur District</option>
                  <option value="Kozhikode">Kozhikode District</option>
                  <option value="Other Kerala District">Other Kerala District (Waitlist)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (WhatsApp)</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel"
                    className="form-input icon-indent"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Work Experience</label>
                <select 
                  className="form-select"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="1-2 years">1 - 2 Years</option>
                  <option value="3-5 years">3 - 5 Years</option>
                  <option value="5-10 years">5 - 10 Years</option>
                  <option value="10+ years">10+ Years (Master Technician)</option>
                </select>
              </div>

              <div className="partner-guarantee-note">
                <ShieldCheck size={16} /> Free onboarding • Zero registration fees • Free tool kit
              </div>

              <button type="submit" className="btn-emerald w-full mt-4">
                Submit Technician Application
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-body-step text-center">
            <div className="success-check-anim">
              <CheckCircle2 size={56} className="success-icon-emerald" />
            </div>
            <h3 className="modal-title">Application Submitted!</h3>
            <p className="modal-sub">
              Thank you <strong>{formData.name}</strong>. Our Kerala Technician Onboarding Officer will contact you within 24 hours.
            </p>

            <div className="partner-summary-box">
              <div className="ps-row">
                <span>Trade:</span> <strong>{formData.trade}</strong>
              </div>
              <div className="ps-row">
                <span>Location:</span> <strong>{formData.district}</strong>
              </div>
              <div className="ps-row">
                <span>Verification Status:</span> <span className="status-pending">⏳ Document Verification Pending</span>
              </div>
            </div>

            <p className="partner-hotline-note">
              📞 Questions? Call Technician Help Desk at <strong>+91 (497) 270-PROS</strong>
            </p>

            <button onClick={onClose} className="btn-primary w-full mt-4">
              Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
