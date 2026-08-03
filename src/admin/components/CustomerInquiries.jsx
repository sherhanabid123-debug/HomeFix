import React, { useState } from 'react';
import { Search, MessageSquare, Phone, Mail, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import './CustomerInquiries.css';

export default function CustomerInquiries({ inquiries = [], setInquiries }) {
  const [filterTab, setFilterTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const filtered = safeInquiries.filter(item => {
    if (!item) return false;
    const matchesTab = filterTab === 'All' || item.status === filterTab;
    const query = searchQuery.toLowerCase();
    const matchesSearch = (item.name && item.name.toLowerCase().includes(query)) ||
                          (item.phone && item.phone.includes(query)) ||
                          (item.question && item.question.toLowerCase().includes(query));
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    const updated = safeInquiries.map(item => item.id === id ? { ...item, status: newStatus } : item);
    if (typeof setInquiries === 'function') {
      setInquiries(updated);
    }
  };

  const handleDelete = (id) => {
    const updated = safeInquiries.filter(item => item.id !== id);
    if (typeof setInquiries === 'function') {
      setInquiries(updated);
    }
  };

  return (
    <div className="inquiries-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Customer Inquiries & FAQ Questions</h2>
          <p>Review and respond to questions submitted by customers from the landing page FAQ section</p>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="status-tabs-row">
          {['Pending', 'Resolved', 'All'].map(tab => (
            <button 
              key={tab}
              className={`status-tab ${filterTab === tab ? 'active' : ''}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab} Questions
              <span className="tab-count">
                {tab === 'All' ? safeInquiries.length : safeInquiries.filter(i => i && i.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search asker name, phone, question text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="inquiries-list">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className="inquiry-card glass-card">
              <div className="inquiry-header">
                <div className="asker-badge">
                  <MessageSquare size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="asker-name">{item.name}</h3>
                  <div className="asker-contact-row">
                    <a href={`tel:${item.phone}`} className="contact-link">
                      <Phone size={13} /> {item.phone}
                    </a>
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="contact-link">
                        <Mail size={13} /> {item.email}
                      </a>
                    )}
                    <span className="time-tag">
                      <Clock size={13} /> {item.submittedAt}
                    </span>
                  </div>
                </div>
                <span className={`status-pill ${item.status === 'Resolved' ? 'status-completed' : 'status-pending'}`}>
                  {item.status || 'Pending'}
                </span>
              </div>

              <div className="inquiry-question-box">
                <p className="question-text">"{item.question}"</p>
              </div>

              <div className="inquiry-card-footer">
                {item.status === 'Pending' ? (
                  <button 
                    onClick={() => handleStatusChange(item.id, 'Resolved')}
                    className="btn-emerald btn-xs"
                  >
                    <CheckCircle2 size={14} /> Mark as Answered / Contacted
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Question Resolved
                  </span>
                )}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="btn-danger-outline btn-xs ml-auto"
                  title="Delete inquiry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-6 text-center text-gray w-full">
            No customer inquiries found.
          </div>
        )}
      </div>
    </div>
  );
}
