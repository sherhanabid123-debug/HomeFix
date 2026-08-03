import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, FileText, Award, Phone, ShieldCheck, Mail } from 'lucide-react';
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
    const matchesTab = filterTab === 'All' || a.status === filterTab;
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
                {tab === 'All' ? safeApps.length : safeApps.filter(a => a && a.status === tab).length}
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
          filteredApps.map((app) => {
            const skillsList = Array.isArray(app.skills) ? app.skills : [app.trade || 'General Repairs'];
            const avatarPhoto = app.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150';
            const govDoc = app.govIdFile || 'Aadhaar / ID Card';
            const license = app.wiremanLicense || `${app.trade || 'Service'} Specialist`;

            return (
              <div key={app.id || Math.random()} className="app-card glass-card">
                <div className="app-card-header">
                  <img src={avatarPhoto} alt={app.name || 'Applicant'} className="applicant-avatar" />
                  <div>
                    <h3 className="applicant-name">{app.name || 'Applicant'}</h3>
                    <p className="text-xs text-gray">{app.trade || 'Technician'} • {app.city || 'Kannur'}</p>
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
                  <div className="detail-line">
                    <Mail size={14} className="text-gray" /> <span>{app.email || 'N/A'}</span>
                  </div>

                  <div className="skills-badge-list">
                    {skillsList.map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))}
                  </div>

                  <div className="doc-preview-box">
                    <FileText size={16} className="text-primary" />
                    <div className="doc-info">
                      <span className="doc-name">{govDoc}</span>
                      <span className="doc-license">{license}</span>
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
            );
          })
        ) : (
          <div className="glass-card p-6 text-center text-gray w-full">
            No technician applications matching filter.
          </div>
        )}
      </div>
    </div>
  );
}
