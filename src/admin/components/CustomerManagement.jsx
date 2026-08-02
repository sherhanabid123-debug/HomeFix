import React, { useState } from 'react';
import { Search, Eye, Phone, Mail, MapPin, Calendar, CreditCard, X, User } from 'lucide-react';
import './CustomerManagement.css';

export default function CustomerManagement({ customers, setCustomers, bookings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customers-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Customer Management</h2>
          <p>View registered Kerala homeowners, booking history & total spend</p>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search customer name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone & City</th>
              <th>Bookings</th>
              <th>Total Spend</th>
              <th>Last Booking</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="cust-cell">
                    <strong className="cust-name">{c.name}</strong>
                    <span className="cust-phone">{c.email}</span>
                  </div>
                </td>
                <td>
                  <span>{c.phone}</span>
                  <span className="block text-xs text-gray">{c.city}</span>
                </td>
                <td>
                  <span className="font-bold text-primary">{c.totalBookings} Jobs</span>
                </td>
                <td>
                  <strong className="text-emerald font-bold">₹{c.totalSpend.toLocaleString()}</strong>
                </td>
                <td>
                  <span className="text-xs text-gray">{c.lastBooking}</span>
                </td>
                <td>
                  <span className="text-xs text-gray">{c.joinedDate}</span>
                </td>
                <td>
                  <span className="status-pill status-completed">Active</span>
                </td>
                <td>
                  <button onClick={() => setSelectedCustomer(c)} className="action-icon-btn blue" title="View Customer Profile">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Drawer */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content booking-detail-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2>{selectedCustomer.name}</h2>
                <p className="text-sm text-gray">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="drawer-close-btn"><X size={20} /></button>
            </div>

            <div className="drawer-body">
              <div className="info-card glass-card">
                <h4 className="card-sub-header">Customer Stats</h4>
                <div className="drawer-grid-2">
                  <div>
                    <span className="text-xs text-gray block">Total Spend</span>
                    <strong className="text-xl text-emerald font-bold">₹{selectedCustomer.totalSpend}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray block">Total Bookings</span>
                    <strong className="text-xl text-primary font-bold">{selectedCustomer.totalBookings}</strong>
                  </div>
                </div>
              </div>

              <div className="info-card glass-card">
                <h4 className="card-sub-header">Saved Addresses</h4>
                {selectedCustomer.savedAddresses.map((addr, i) => (
                  <p key={i} className="text-sm mb-2"><MapPin size={14} className="inline text-primary mr-1" /> {addr}</p>
                ))}
              </div>

              <div className="info-card glass-card">
                <h4 className="card-sub-header">Recent Customer Bookings</h4>
                {bookings.filter(b => b.customerName === selectedCustomer.name).map((b) => (
                  <div key={b.id} className="f-row py-2 border-b border-gray-100">
                    <span>{b.id} - {b.service}</span>
                    <strong className="text-primary">{b.status}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
