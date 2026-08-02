import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, FileText, Award, Phone, ShieldCheck, Mail } from 'lucide-react';
import './TechnicianApplications.css';

export default function TechnicianApplications({ applications, setApplications, onApproveApplicant }) {
  const [filterTab, setFilterTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(a => {
    const matchesTab = filterTab === 'All' || a.status === filterTab;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.phone.includes(searchQuery) ||
                          a.trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (newStatus === 'Approved') {
      const app = applications.find(a => a.id === id);
      if (app && onApproveApplicant) {
        onApproveApplicant(app);
      }
    }
  };

  return (
    <div className="apps-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Technician Applications</h2>
          <p>Review new applicant trade licenses, skills, and background documents</p>
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
                {tab === 'All' ? applications.length : applications.filter(a => a.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search applicant name, trade, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="apps-cards-grid">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} className="app-card glass-card">
              <div className="app-card-header">
                <img src={app.photo} alt={app.name} className="applicant-avatar" />
                <div>
                  <h3 className="applicant-name">{app.name}</h3>
                  <p className="text-xs text-gray">{app.trade} • {app.city}</p>
                  <span className="text-xs font-bold text-primary">{app.experience} Experience</span>
                </div>
                <span className={`status-pill ${app.status === 'Approved' ? 'status-completed' : app.status === 'Rejected' ? 'status-cancelled' : 'status-pending'}`}>
                  {app.status}
                </span>
              </div>

              <div className="app-details-body">
                <div className="detail-line">
                  <Phone size={14} className="text-gray" /> <span>{app.phone}</span>
                </div>
                <div className="detail-line">
                  <Mail size={14} className="text-gray" /> <span>{app.email}</span>
                </div>

                <div className="skills-badge-list">
                  {app.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">{skill}</span>
                  ))}
                </div>

                <div className="doc-preview-box">
                  <FileText size={16} className="text-primary" />
                  <div className="doc-info">
                    <span className="doc-name">{app.govIdFile}</span>
                    <span className="doc-license">{app.wiremanLicense}</span>
                  </div>
                </div>
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
            No technician applications matching filter.
          </div>
        )}
      </div>
    </div>
  );
}
