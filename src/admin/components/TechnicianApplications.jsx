import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Phone, Mail, Calendar, MapPin, Wrench, User } from 'lucide-react';
import './TechnicianApplications.css';

export default function TechnicianApplications({ applications = [], setApplications, onApproveApplicant }) {
  const [filterTab, setFilterTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const safeApps = Array.isArray(applications) ? applications : [];

  const filteredApps = safeApps.filter(a => {
    if (!a) return false;
    const name = a.name || '';
    const phone = a.phone || '';
    const trade = a.trade || '';
    const status = (a.status || 'Pending').toLowerCase();
    const matchesTab = filterTab === 'All' || status === filterTab.toLowerCase();
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          phone.includes(searchQuery) ||
                          trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    if (typeof setApplications === 'function') {
      setApplications(safeApps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
    if (newStatus === 'Approved') {
      const app = safeApps.find(a => a.id === id);
      if (app && onApproveApplicant) {
        onApproveApplicant(app);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="apps-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Technician Applications</h2>
          <p>Review new applicant registrations and waiting list submissions</p>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="status-tabs-row">
          {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
            <button 
              key={tab}
              className={`status-tab ${filterTab === tab ? 'active' : ''}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab} Applications
              <span className="tab-count">
                {tab === 'All' ? safeApps.length : safeApps.filter(a => a && (a.status || 'Pending').toLowerCase() === tab.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search applicant name, specialization, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="apps-cards-grid">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id || Math.random()} className="app-card glass-card">
              <div className="app-card-header">
                {app.photo ? (
                  <img src={app.photo} alt={app.name} className="applicant-avatar" />
                ) : (
                  <div className="applicant-initials-badge">
                    {getInitials(app.name)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="applicant-name">{app.name || 'Applicant'}</h3>
                  <p className="text-xs text-gray">
                    <Wrench size={12} className="inline mr-1 text-emerald-600" />
                    <strong>{app.trade || 'Technician'}</strong> • {app.city || 'Kannur'}
                  </p>
                  <span className="text-xs font-bold text-primary">{app.experience || '1-3 Years'} Experience</span>
                </div>
                <span className={`status-pill ${app.status === 'Approved' ? 'status-completed' : app.status === 'Rejected' ? 'status-cancelled' : 'status-pending'}`}>
                  {app.status || 'Pending'}
                </span>
              </div>

              <div className="app-details-body">
                <div className="detail-line">
                  <Phone size={14} className="text-gray" /> <span>{app.phone || 'N/A'}</span>
                </div>
                {app.email && (
                  <div className="detail-line">
                    <Mail size={14} className="text-gray" /> <span>{app.email}</span>
                  </div>
                )}
                <div className="detail-line">
                  <MapPin size={14} className="text-gray" /> <span>Primary District: <strong>{app.city || 'Kannur'}</strong></span>
                </div>
                {app.appliedDate && (
                  <div className="detail-line">
                    <Calendar size={14} className="text-gray" /> <span>Applied: {app.appliedDate}</span>
                  </div>
                )}
              </div>

              <div className="app-card-footer">
                {app.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Approved')} 
                      className="btn-emerald btn-xs flex-1"
                    >
                      <CheckCircle2 size={14} /> Approve Applicant
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Rejected')} 
                      className="btn-danger-outline btn-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray italic">Status: {app.status}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-6 text-center text-gray w-full">
            No technician applications found.
          </div>
        )}
      </div>
    </div>
  );
}
