import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, Zap, Wrench, Fan, ToggleLeft, Droplets, GitCommit, Calendar, Clock, MapPin, ShieldCheck, ArrowRight, ChevronDown, Check, Navigation, Building, MessageSquare, ExternalLink, Smartphone } from 'lucide-react';
import { generateWhatsAppLink, sendInstantBookingSMS } from '../services/notificationService';
import './BookingModal.css';

const SERVICES_LIST = [
  {
    id: 'Electrical Repairs',
    title: 'Electrical Repairs',
    icon: Zap,
    category: 'Electrical',
    desc: 'Short circuits, MCB trips, wiring & flickering lights',
    color: 'blue'
  },
  {
    id: 'Plumbing Repairs',
    title: 'Plumbing Repairs',
    icon: Wrench,
    category: 'Plumbing',
    desc: 'Faucet leaks, clogged drains, toilet repairs',
    color: 'green'
  },
  {
    id: 'Fan Installation',
    title: 'Fan Installation',
    icon: Fan,
    category: 'Electrical',
    desc: 'Ceiling & wall fan mounting, regulator fitting',
    color: 'blue'
  },
  {
    id: 'Switch & Socket Replacement',
    title: 'Switch & Socket Replacement',
    icon: ToggleLeft,
    category: 'Electrical',
    desc: 'Modular switchboards, socket replacement, DB box',
    color: 'blue'
  },
  {
    id: 'Water Leak Repairs',
    title: 'Water Leak Repairs',
    icon: Droplets,
    category: 'Plumbing',
    desc: 'Concealed pipe leaks, ceiling dampness & tank sealing',
    color: 'green'
  },
  {
    id: 'Pipe Installation',
    title: 'Pipe Installation',
    icon: GitCommit,
    category: 'Plumbing',
    desc: 'CPVC & PVC pipe fitting for bathroom & kitchen',
    color: 'green'
  }
];

const TIME_SLOTS = [
  {
    id: 'Immediate / ASAP',
    title: 'Express Arrival (< 45 Mins)',
    badge: 'Fastest',
    desc: 'Technician dispatched immediately to your doorstep',
    icon: Zap,
    color: 'emerald'
  },
  {
    id: 'Today Afternoon (2 PM - 5 PM)',
    title: 'Today Afternoon (2 PM - 5 PM)',
    badge: 'Available',
    desc: 'Scheduled arrival between 2:00 PM and 5:00 PM today',
    icon: Clock,
    color: 'blue'
  },
  {
    id: 'Today Evening (5 PM - 8 PM)',
    title: 'Today Evening (5 PM - 8 PM)',
    badge: 'Popular',
    desc: 'Scheduled arrival between 5:00 PM and 8:00 PM today',
    icon: Clock,
    color: 'amber'
  },
  {
    id: 'Tomorrow Morning (9 AM - 12 PM)',
    title: 'Tomorrow Morning (9 AM - 12 PM)',
    badge: 'Flexible',
    desc: 'Scheduled arrival between 9:00 AM and 12:00 PM tomorrow',
    icon: Calendar,
    color: 'indigo'
  }
];

export default function BookingModal({ isOpen, onClose, initialService = '' }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(initialService || 'Electrical Repairs');
  const [district, setDistrict] = useState('Kannur');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState('Immediate / ASAP');
  
  // Notification states
  const [generatedId, setGeneratedId] = useState('');
  const [smsNotificationToast, setSmsNotificationToast] = useState(null);

  // Custom Dropdowns state & refs
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [slotDropdownOpen, setSlotDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef(null);
  const slotDropdownRef = useRef(null);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  // Click outside listener for custom dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
      }
      if (slotDropdownRef.current && !slotDropdownRef.current.contains(event.target)) {
        setSlotDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
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

  const currentServiceObj = SERVICES_LIST.find(s => s.id === service) || SERVICES_LIST[0];
  const CurrentServiceIcon = currentServiceObj.icon;

  const currentSlotObj = TIME_SLOTS.find(s => s.id === slot) || TIME_SLOTS[0];
  const CurrentSlotIcon = currentSlotObj.icon;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const newId = `HF-${Math.floor(8800 + Math.random() * 1000)}`;
    setGeneratedId(newId);
    setStep(3); // Confirmation

    // Trigger instant SMS / WhatsApp Notification Simulation
    sendInstantBookingSMS({ bookingId: newId, service, phone, slot });

    // Show simulated incoming SMS banner toast
    setSmsNotificationToast({
      id: newId,
      phone: phone || '+91 98470 12345',
      text: `💬 WhatsApp: Booking #${newId} confirmed! HomeFix technician matching for ${service} in ${district}.`
    });

    setTimeout(() => {
      setSmsNotificationToast(null);
    }, 7000);
  };

  const whatsappUrl = generateWhatsAppLink({
    bookingId: generatedId || 'HF-8942',
    service,
    district,
    address,
    landmark,
    phone,
    slot
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Live Simulated Incoming SMS / WhatsApp Toast Banner */}
      {smsNotificationToast && (
        <div className="sms-live-toast-banner">
          <div className="toast-icon-box">
            <MessageSquare size={20} color="#10B981" />
          </div>
          <div className="toast-text-box">
            <strong>Instant WhatsApp & SMS Notification Sent!</strong>
            <p>{smsNotificationToast.text}</p>
          </div>
          <button className="toast-close" onClick={() => setSmsNotificationToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="modal-content booking-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {step === 1 && (
          <div className="modal-body-step">
            <div className="modal-header-icon blue-bg">
              <Zap size={24} />
            </div>
            <h3 className="modal-title">Book a Verified Service</h3>
            <p className="modal-sub">Step 1 of 2: Select your required repair</p>

            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              
              {/* Custom Modern Service Select Dropdown */}
              <div className="form-group" ref={serviceDropdownRef}>
                <label className="form-label">Service Type</label>
                
                <div 
                  className={`custom-select-trigger ${serviceDropdownOpen ? 'open' : ''}`}
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                >
                  <div className="trigger-content">
                    <div className={`service-icon-pill ${currentServiceObj.color}`}>
                      <CurrentServiceIcon size={20} />
                    </div>
                    <div className="trigger-text">
                      <span className="selected-title">{currentServiceObj.title}</span>
                      <span className="selected-desc">{currentServiceObj.desc}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`trigger-chevron ${serviceDropdownOpen ? 'rotate' : ''}`} />
                </div>

                {serviceDropdownOpen && (
                  <div className="custom-select-dropdown">
                    <div className="dropdown-options-list">
                      {SERVICES_LIST.map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = item.id === service;
                        return (
                          <div 
                            key={item.id}
                            className={`custom-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setService(item.id);
                              setServiceDropdownOpen(false);
                            }}
                          >
                            <div className={`option-icon-box ${item.color}`}>
                              <ItemIcon size={18} />
                            </div>
                            <div className="option-text flex-1">
                              <div className="option-title-row">
                                <span className="option-title">{item.title}</span>
                                <span className={`option-category-tag ${item.color}`}>
                                  {item.category}
                                </span>
                              </div>
                              <span className="option-desc">{item.desc}</span>
                            </div>
                            {isSelected && (
                              <Check size={18} className="option-check" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Select District in Kerala</label>
                <div className="district-radio-group">
                  <label className={`radio-pill ${district === 'Kannur' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="district" 
                      value="Kannur" 
                      checked={district === 'Kannur'}
                      onChange={() => setDistrict('Kannur')}
                    />
                    <MapPin size={16} />
                    <span>Kannur</span>
                  </label>
                  <label className={`radio-pill ${district === 'Kozhikode' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="district" 
                      value="Kozhikode" 
                      checked={district === 'Kozhikode'}
                      onChange={() => setDistrict('Kozhikode')}
                    />
                    <MapPin size={16} />
                    <span>Kozhikode</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-4">
                <span>Continue to Address & Time</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="modal-body-step">
            <div className="modal-header-icon green-bg">
              <Calendar size={24} />
            </div>
            <h3 className="modal-title">Address & Schedule</h3>
            <p className="modal-sub">Step 2 of 2: {service} in {district}</p>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Door No., Street & Locality</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. House No 42, Thana Road, Near Fort"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Landmark Input Field */}
              <div className="form-group">
                <label className="form-label">Nearby Landmark (Optional)</label>
                <div className="input-with-icon">
                  <Navigation size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input icon-indent" 
                    placeholder="e.g. Opposite AKG Hospital, Near Fort Road"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (WhatsApp for ETA & SMS)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Modern Custom Date & Time Slot Dropdown */}
              <div className="form-group" ref={slotDropdownRef}>
                <label className="form-label">Preferred Date & Time Slot</label>
                
                <div 
                  className={`custom-select-trigger ${slotDropdownOpen ? 'open' : ''}`}
                  onClick={() => setSlotDropdownOpen(!slotDropdownOpen)}
                >
                  <div className="trigger-content">
                    <div className={`service-icon-pill ${currentSlotObj.color}`}>
                      <CurrentSlotIcon size={20} />
                    </div>
                    <div className="trigger-text">
                      <span className="selected-title">{currentSlotObj.title}</span>
                      <span className="selected-desc">{currentSlotObj.desc}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`trigger-chevron ${slotDropdownOpen ? 'rotate' : ''}`} />
                </div>

                {slotDropdownOpen && (
                  <div className="custom-select-dropdown">
                    <div className="dropdown-options-list">
                      {TIME_SLOTS.map((item) => {
                        const SlotIcon = item.icon;
                        const isSelected = item.id === slot;
                        return (
                          <div 
                            key={item.id}
                            className={`custom-option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setSlot(item.id);
                              setSlotDropdownOpen(false);
                            }}
                          >
                            <div className={`option-icon-box ${item.color}`}>
                              <SlotIcon size={18} />
                            </div>
                            <div className="option-text flex-1">
                              <div className="option-title-row">
                                <span className="option-title">{item.title}</span>
                                <span className={`option-category-tag ${item.color}`}>
                                  {item.badge}
                                </span>
                              </div>
                              <span className="option-desc">{item.desc}</span>
                            </div>
                            {isSelected && (
                              <Check size={18} className="option-check" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="booking-summary-box">
                <div className="summary-row">
                  <span>Estimated Inspection & Labor</span>
                  <span className="summary-price">₹299</span>
                </div>
                <div className="summary-note">
                  <ShieldCheck size={14} /> Pay after job completion via UPI/Cash. 30-Day Guarantee included.
                </div>
              </div>

              <div className="modal-btn-row">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Confirm Booking & Trigger SMS
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="modal-body-step text-center">
            <div className="success-check-anim">
              <CheckCircle2 size={56} className="success-icon" />
            </div>
            <h3 className="modal-title">Booking Confirmed!</h3>
            <p className="modal-sub">
              Booking <strong>#{generatedId || 'HF-8942'}</strong> for <strong>{service}</strong> in <strong>{district}</strong>.
            </p>

            <div className="booking-ticket">
              <div className="ticket-row">
                <span>Status:</span>
                <span className="ticket-status">👷 Dispatching Nearby Tech</span>
              </div>
              <div className="ticket-row">
                <span>Arrival Window:</span>
                <strong>{slot}</strong>
              </div>
              <div className="ticket-row">
                <span>Location:</span>
                <span>{address} {landmark ? `(Landmark: ${landmark})` : ''}, {district}</span>
              </div>
            </div>

            <p className="ticket-sms-note mb-3">
              💬 Instant SMS & WhatsApp confirmation sent to <strong>{phone || '+91 Kerala'}</strong>.
            </p>

            {/* Direct WhatsApp Open Trigger */}
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp w-full mb-3"
            >
              <MessageSquare size={18} />
              <span>Open Confirmation on WhatsApp</span>
              <ExternalLink size={14} />
            </a>

            <button onClick={onClose} className="btn-primary w-full">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
