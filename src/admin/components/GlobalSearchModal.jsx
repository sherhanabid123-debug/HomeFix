import React, { useState } from 'react';
import { Search, X, CalendarCheck, User, UserCheck, CreditCard, ArrowRight } from 'lucide-react';
import './GlobalSearchModal.css';

export default function GlobalSearchModal({ isOpen, onClose, allData, onNavigate }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingBookings = q ? allData.bookings.filter(b => 
    b.id.toLowerCase().includes(q) || 
    b.customerName.toLowerCase().includes(q) || 
    b.service.toLowerCase().includes(q) ||
    b.city.toLowerCase().includes(q)
  ) : [];

  const matchingTechnicians = q ? allData.technicians.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.phone.includes(q) || 
    t.category.toLowerCase().includes(q)
  ) : [];

  const matchingCustomers = q ? allData.customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.phone.includes(q) || 
    c.email.toLowerCase().includes(q)
  ) : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content global-search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="global-search-header">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search bookings, customers, technicians, payments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="global-search-input"
          />
          <button onClick={onClose} className="search-close-btn"><X size={18} /></button>
        </div>

        <div className="global-search-results">
          {!q && (
            <div className="search-empty-state">
              <p>Type any Customer Name, Booking ID (e.g. HF-8942), Technician Name, or City...</p>
            </div>
          )}

          {q && (
            <>
              {matchingBookings.length > 0 && (
                <div className="result-group">
                  <div className="result-group-title">Bookings ({matchingBookings.length})</div>
                  {matchingBookings.map(b => (
                    <div key={b.id} className="result-item" onClick={() => onNavigate('bookings')}>
                      <CalendarCheck size={18} className="text-primary" />
                      <div>
                        <strong>{b.id} - {b.service}</strong> ({b.customerName} in {b.city})
                      </div>
                      <span className="result-badge">{b.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchingTechnicians.length > 0 && (
                <div className="result-group">
                  <div className="result-group-title">Technicians ({matchingTechnicians.length})</div>
                  {matchingTechnicians.map(t => (
                    <div key={t.id} className="result-item" onClick={() => onNavigate('technicians')}>
                      <UserCheck size={18} className="text-secondary" />
                      <div>
                        <strong>{t.name}</strong> ({t.category} - {t.city})
                      </div>
                      <span className="result-badge green">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchingCustomers.length > 0 && (
                <div className="result-group">
                  <div className="result-group-title">Customers ({matchingCustomers.length})</div>
                  {matchingCustomers.map(c => (
                    <div key={c.id} className="result-item" onClick={() => onNavigate('customers')}>
                      <User size={18} className="text-amber" />
                      <div>
                        <strong>{c.name}</strong> ({c.phone})
                      </div>
                      <span>{c.totalBookings} Bookings</span>
                    </div>
                  ))}
                </div>
              )}

              {matchingBookings.length === 0 && matchingTechnicians.length === 0 && matchingCustomers.length === 0 && (
                <div className="search-empty-state">
                  <p>No results found matching "<strong>{query}</strong>"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
