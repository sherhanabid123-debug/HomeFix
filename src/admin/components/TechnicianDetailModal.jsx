import React from 'react';
import { X, ShieldCheck, MapPin, Phone, Mail, Award, CreditCard, Star, CheckCircle2, Lock, UserX, AlertTriangle } from 'lucide-react';
import './TechnicianDetailModal.css';

export default function TechnicianDetailModal({ tech, onClose, onToggleStatus, onDelete }) {
  if (!tech) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tech-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tech-modal-header">
          <div className="tech-header-profile">
            <img src={tech.photo} alt={tech.name} className="tech-modal-avatar" />
            <div>
              <h3>{tech.name}</h3>
              <p className="text-sm text-gray">{tech.category} • {tech.city} Network</p>
              <span className={`status-pill ${tech.status === 'Online' ? 'status-completed' : tech.status === 'Suspended' ? 'status-cancelled' : 'status-pending'}`}>
                ● {tech.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="drawer-close-btn"><X size={20} /></button>
        </div>

        <div className="tech-modal-body">
          {/* Action Toolbar */}
          <div className="drawer-toolbar glass-card mb-4">
            {tech.status === 'Suspended' ? (
              <button onClick={() => onToggleStatus(tech.id, 'Online')} className="btn-emerald btn-xs">
                <CheckCircle2 size={14} /> Activate Technician
              </button>
            ) : (
              <button onClick={() => onToggleStatus(tech.id, 'Suspended')} className="btn-danger-outline btn-xs">
                <UserX size={14} /> Suspend Technician
              </button>
            )}

            <button onClick={() => alert(`Reset password email dispatched to ${tech.email}`)} className="btn-secondary btn-xs">
              <Lock size={14} /> Reset Password
            </button>

            <button onClick={() => onDelete(tech.id)} className="btn-secondary btn-xs text-red">
              Delete Profile
            </button>
          </div>

          {/* Grid Stats */}
          <div className="tech-stats-row">
            <div className="t-stat-card glass-card">
              <span className="t-stat-label">Jobs Completed</span>
              <span className="t-stat-val">{tech.jobsCompleted}</span>
            </div>
            <div className="t-stat-card glass-card">
              <span className="t-stat-label">Average Rating</span>
              <span className="t-stat-val">⭐ {tech.rating}</span>
            </div>
            <div className="t-stat-card glass-card">
              <span className="t-stat-label">Monthly Earnings</span>
              <span className="t-stat-val text-emerald">₹{tech.monthlyEarnings.toLocaleString()}</span>
            </div>
          </div>

          {/* Verification & Documents */}
          <div className="info-card glass-card">
            <h4 className="card-sub-header">Verification & Documents</h4>
            <div className="info-row">
              <ShieldCheck size={16} className="text-secondary" />
              <span>Government ID: <strong>{tech.govIdType} ({tech.govIdNumber})</strong></span>
            </div>
            <div className="info-row">
              <Award size={16} className="text-primary" />
              <span>Experience: <strong>{tech.experience}</strong></span>
            </div>
          </div>

          {/* Banking Details */}
          <div className="info-card glass-card">
            <h4 className="card-sub-header">Banking & Payout Accounts</h4>
            <div className="info-row">
              <CreditCard size={16} className="text-gray" />
              <span>Bank: <strong>{tech.bankName}</strong></span>
            </div>
            <div className="info-row">
              <span>A/C No: <strong>{tech.accountNumber}</strong> (IFSC: {tech.ifsc})</span>
            </div>
            <div className="info-row">
              <span>UPI ID: <strong className="text-primary">{tech.upiId}</strong></span>
            </div>
          </div>

          {/* Coverage & Languages */}
          <div className="info-card glass-card">
            <h4 className="card-sub-header">Service Radius & Spoken Languages</h4>
            <p className="text-sm mb-2"><MapPin size={14} className="inline text-primary mr-1" /> {tech.serviceAreas}</p>
            <p className="text-sm text-gray">Languages: <strong>{tech.languages}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
