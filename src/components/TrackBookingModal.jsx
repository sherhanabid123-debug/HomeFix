import React, { useState, useEffect } from 'react';
import { X, Search, Clock, MapPin, Phone, CheckCircle2, AlertCircle, ShieldCheck, Zap, UserCheck, MessageSquare, ArrowRight } from 'lucide-react';
import './TrackBookingModal.css';

export default function TrackBookingModal({ isOpen, onClose, defaultBookingId = '' }) {
  const [searchQuery, setSearchQuery] = useState(defaultBookingId || '');
  const [activeBooking, setActiveBooking] = useState(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const liveBookings = JSON.parse(localStorage.getItem('homefix_live_bookings') || '[]');
      if (defaultBookingId) {
        setSearchQuery(defaultBookingId);
        const match = liveBookings.find(b => b.id.toLowerCase() === defaultBookingId.toLowerCase());
        if (match) setActiveBooking(match);
        else if (liveBookings.length > 0) setActiveBooking(liveBookings[0]);
      } else if (liveBookings.length > 0) {
        setActiveBooking(liveBookings[0]);
        setSearchQuery(liveBookings[0].id);
      }
    }
  }, [isOpen, defaultBookingId]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchError('');
    const liveBookings = JSON.parse(localStorage.getItem('homefix_live_bookings') || '[]');
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchError('Please enter your Booking ID or Phone Number');
      return;
    }

    const found = liveBookings.find(
      b => b.id.toLowerCase() === query || (b.customerPhone && b.customerPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')))
    );

    if (found) {
      setActiveBooking(found);
    } else {
      setSearchError(`No booking found matching "${searchQuery}". Please check your Booking ID.`);
      setActiveBooking(null);
    }
  };

  const handleCancelBooking = (bookingId) => {
    const liveBookings = JSON.parse(localStorage.getItem('homefix_live_bookings') || '[]');
    const updated = liveBookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b);
    localStorage.setItem('homefix_live_bookings', JSON.stringify(updated));
    setActiveBooking({ ...activeBooking, status: 'Cancelled' });
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Assigned': return 2;
      case 'Accepted':
      case 'On The Way': return 3;
      case 'Started': return 4;
      case 'Completed': return 5;
      default: return 1;
    }
  };

  const currentStep = activeBooking ? getStepIndex(activeBooking.status) : 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content track-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="track-modal-header">
          <div className="modal-header-icon blue-bg">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="modal-title">Track Live Service Booking</h3>
            <p className="modal-sub">Real-time status updates for your repair request</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="track-search-form">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="track-search-input"
              placeholder="Enter Booking ID (e.g. HF-8942) or Phone No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-search-submit">
              Search
            </button>
          </div>
          {searchError && <p className="search-error-msg">{searchError}</p>}
        </form>

        {activeBooking ? (
          <div className="track-details-card">
            {/* Ticket Top Bar */}
            <div className="track-ticket-header">
              <div>
                <span className="booking-id-badge">#{activeBooking.id}</span>
                <h4 className="track-service-title">{activeBooking.service}</h4>
              </div>
              <span className={`status-badge-pill status-${activeBooking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {activeBooking.status === 'Pending' ? '👷 Matching Technician' : activeBooking.status}
              </span>
            </div>

            {/* Visual Stepper */}
            {activeBooking.status !== 'Cancelled' ? (
              <div className="track-stepper-container">
                <div className="stepper-track-bar">
                  <div className="stepper-progress-fill" style={{ width: `${((currentStep - 1) / 4) * 100}%` }}></div>
                </div>
                <div className="stepper-nodes">
                  <div className={`step-node ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="node-circle">1</div>
                    <span className="node-label">Received</span>
                  </div>
                  <div className={`step-node ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="node-circle">2</div>
                    <span className="node-label">Assigned</span>
                  </div>
                  <div className={`step-node ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="node-circle">3</div>
                    <span className="node-label">On The Way</span>
                  </div>
                  <div className={`step-node ${currentStep >= 4 ? 'active' : ''}`}>
                    <div className="node-circle">4</div>
                    <span className="node-label">In Progress</span>
                  </div>
                  <div className={`step-node ${currentStep >= 5 ? 'active' : ''}`}>
                    <div className="node-circle">5</div>
                    <span className="node-label">Done</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="cancelled-banner">
                <AlertCircle size={20} />
                <span>This booking has been cancelled.</span>
              </div>
            )}

            {/* Technician Card */}
            <div className="technician-info-card">
              <div className="tech-avatar">
                {activeBooking.technicianName !== 'Unassigned' ? (
                  <UserCheck size={24} color="#2563EB" />
                ) : (
                  <Zap size={24} color="#F59E0B" />
                )}
              </div>
              <div className="tech-details flex-1">
                <strong>{activeBooking.technicianName !== 'Unassigned' ? activeBooking.technicianName : 'Matching Verified Technician...'}</strong>
                <p className="text-xs text-gray-500">
                  {activeBooking.technicianName !== 'Unassigned' ? `⭐ 4.9 • ${activeBooking.category} Expert` : `Locating nearest electrician/plumber in ${activeBooking.city}`}
                </p>
              </div>
              {activeBooking.technicianPhone && activeBooking.technicianPhone !== '-' && (
                <a href={`tel:${activeBooking.technicianPhone}`} className="btn-call-tech" title="Call Technician">
                  <Phone size={16} />
                </a>
              )}
            </div>

            {/* Address & Details Grid */}
            <div className="track-info-grid">
              <div className="info-item">
                <span className="info-label">Customer Name</span>
                <strong>{activeBooking.customerName || 'Customer'}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Scheduled Arrival</span>
                <strong>{activeBooking.scheduledSlot}</strong>
              </div>
              <div className="info-item span-2">
                <span className="info-label">Address & Landmark</span>
                <span>{activeBooking.address}, {activeBooking.city}</span>
              </div>
            </div>

            {/* Footer Actions */}
            {activeBooking.status === 'Pending' && (
              <div className="track-footer-actions">
                <button 
                  onClick={() => handleCancelBooking(activeBooking.id)} 
                  className="btn-cancel-link"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-booking-state">
            <Clock size={40} className="text-gray-300 mb-2" />
            <p>No active booking found. You can book a verified service on demand!</p>
          </div>
        )}
      </div>
    </div>
  );
}
