import React, { useState } from 'react';
import { X, MapPin, User, Phone, Mail, Calendar, Clock, ShieldCheck, Printer, RefreshCw, XCircle, DollarSign, CheckCircle2, MessageSquare } from 'lucide-react';
import './BookingDetailModal.css';

export default function BookingDetailModal({ booking, onClose, onUpdateStatus, onReassign, technicians = [] }) {
  const [internalNote, setInternalNote] = useState('');
  const [notesList, setNotesList] = useState([booking.internalNotes].filter(Boolean));
  const [showReassignDropdown, setShowReassignDropdown] = useState(false);

  if (!booking) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (internalNote.trim()) {
      setNotesList([...notesList, `${new Date().toLocaleTimeString()} - ${internalNote}`]);
      setInternalNote('');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-detail-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="drawer-id-row">
              <h2>{booking.id}</h2>
              <span className={`status-pill status-${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-gray">{booking.service} • {booking.city}</p>
          </div>
          <button onClick={onClose} className="drawer-close-btn"><X size={20} /></button>
        </div>

        <div className="drawer-body">
          {/* Action Toolbar */}
          <div className="drawer-toolbar glass-card">
            <button onClick={handlePrintInvoice} className="btn-secondary btn-xs">
              <Printer size={14} /> Print Invoice
            </button>

            <button onClick={() => onUpdateStatus(booking.id, 'Cancelled')} className="btn-danger-outline btn-xs">
              <XCircle size={14} /> Cancel Booking
            </button>

            {booking.paymentStatus.includes('Paid') && (
              <button onClick={() => onUpdateStatus(booking.id, 'Refunded')} className="btn-secondary btn-xs">
                <DollarSign size={14} /> Issue Refund
              </button>
            )}

            <button onClick={() => setShowReassignDropdown(!showReassignDropdown)} className="btn-primary btn-xs">
              <RefreshCw size={14} /> Reassign Tech
            </button>
          </div>

          {showReassignDropdown && (
            <div className="reassign-box glass-card">
              <h4>Reassign Technician</h4>
              <div className="reassign-row">
                <select id="techSelect" className="form-select text-sm">
                  {technicians && technicians.length > 0 ? (
                    technicians.map(t => (
                      <option key={t.id || t.name} value={t.id || t.name}>
                        {t.name} ({t.city || 'Kerala'} - {t.trade || t.category || 'Technician'})
                      </option>
                    ))
                  ) : (
                    <option value="">No technicians available to reassign</option>
                  )}
                </select>
                <button 
                  onClick={() => {
                    const sel = document.getElementById('techSelect');
                    onReassign(booking.id, sel.options[sel.selectedIndex].text.split(' (')[0]);
                    setShowReassignDropdown(false);
                  }}
                  className="btn-emerald btn-xs"
                >
                  Confirm Reassign
                </button>
              </div>
            </div>
          )}

          {/* Grid Layout: Customer & Technician */}
          <div className="drawer-grid-2">
            {/* Customer Info Card */}
            <div className="info-card glass-card">
              <h3 className="card-sub-header">Customer Information</h3>
              <div className="info-row">
                <User size={16} className="text-primary" />
                <strong>{booking.customerName}</strong>
              </div>
              <div className="info-row">
                <Phone size={16} className="text-gray" />
                <a href={`tel:${booking.customerPhone}`}>{booking.customerPhone}</a>
              </div>
              <div className="info-row">
                <Mail size={16} className="text-gray" />
                <span>{booking.customerEmail}</span>
              </div>
            </div>

            {/* Technician Info Card */}
            <div className="info-card glass-card">
              <h3 className="card-sub-header">Technician Assigned</h3>
              {booking.technicianName !== 'Unassigned' ? (
                <>
                  <div className="tech-profile-inline">
                    <img src={booking.technicianPhoto} alt={booking.technicianName} className="tech-avatar-sm" />
                    <div>
                      <strong>{booking.technicianName}</strong>
                      <span className="text-xs text-emerald block">Verified Pro</span>
                    </div>
                  </div>
                  <div className="info-row mt-2">
                    <Phone size={16} className="text-gray" />
                    <a href={`tel:${booking.technicianPhone}`}>{booking.technicianPhone}</a>
                  </div>
                </>
              ) : (
                <div className="unassigned-box">
                  <p>No technician matched yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Location & Map Representation */}
          <div className="info-card glass-card">
            <h3 className="card-sub-header">Service Location & Address</h3>
            <p className="font-semibold text-dark mb-2">
              <MapPin size={16} className="inline mr-1 text-primary" />
              {booking.address}
            </p>

            {/* Stylized Map View */}
            <div className="map-view-box">
              <div className="map-pin-pulse">
                <span className="dot"></span>
                <span>{booking.location} (GPS Verified)</span>
              </div>
            </div>
          </div>

          {/* Uploaded Job Photos */}
          {booking.uploadedPhotos && booking.uploadedPhotos.length > 0 && (
            <div className="info-card glass-card">
              <h3 className="card-sub-header">Uploaded Customer Photos</h3>
              <div className="photos-grid">
                {booking.uploadedPhotos.map((photo, i) => (
                  <img key={i} src={photo} alt="Job issue photo" className="job-photo-thumb" />
                ))}
              </div>
            </div>
          )}

          {/* Service & Price Summary */}
          <div className="info-card glass-card">
            <h3 className="card-sub-header">Pricing & Financial Breakdown</h3>
            <div className="financial-table">
              <div className="f-row">
                <span>Base Service Rate</span>
                <span>₹{booking.estimatedPrice}</span>
              </div>
              <div className="f-row">
                <span>Platform Commission ({15}%)</span>
                <span>₹{booking.commission.toFixed(2)}</span>
              </div>
              <div className="f-row total-row">
                <span>Technician Net Payout</span>
                <span className="text-emerald font-bold">₹{booking.technicianPayout.toFixed(2)}</span>
              </div>
              <div className="f-row mt-2">
                <span>Payment Status</span>
                <span className="font-bold">{booking.paymentStatus} ({booking.paymentMethod})</span>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="info-card glass-card">
            <h3 className="card-sub-header">Booking Status History</h3>
            <div className="timeline-mini">
              {booking.timeline.map((item, idx) => (
                <div key={idx} className="t-mini-item">
                  <span className="t-time">{item.time}</span>
                  <span className="t-event">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="info-card glass-card">
            <h3 className="card-sub-header">Internal Operations Notes</h3>
            <div className="notes-list mb-3">
              {notesList.map((note, i) => (
                <div key={i} className="note-bubble">{note}</div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="note-form">
              <input 
                type="text" 
                placeholder="Add operational note for staff..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="form-input text-sm"
              />
              <button type="submit" className="btn-secondary btn-sm">Add Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
