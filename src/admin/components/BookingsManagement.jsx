import React, { useState } from 'react';
import { Search, Download, Filter, Eye, Phone, RefreshCw, XCircle, MapPin, Calendar, Plus } from 'lucide-react';
import BookingDetailModal from './BookingDetailModal';
import './BookingsManagement.css';

export default function BookingsManagement({ bookings, setBookings }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const STATUS_OPTIONS = ['All', 'Pending', 'Assigned', 'Accepted', 'On The Way', 'Started', 'Completed', 'Cancelled'];

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesCity = cityFilter === 'All' || b.city === cityFilter;
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCity && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Customer', 'Phone', 'Service', 'Location', 'Status', 'Time', 'Amount'];
    const rows = filteredBookings.map(b => [
      b.id, b.customerName, b.customerPhone, b.service, b.location, b.status, b.bookingTime, b.estimatedPrice
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `homefix_bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleReassignTech = (bookingId, techName) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, technicianName: techName, status: 'Assigned' } : b));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, technicianName: techName, status: 'Assigned' });
    }
  };

  return (
    <div className="bookings-mgmt-page">
      {/* Top Header */}
      <div className="module-header glass-card">
        <div>
          <h2>Bookings Management</h2>
          <p>Live job dispatches and customer requests across Kerala</p>
        </div>

        <div className="header-action-group">
          <button onClick={handleExportCSV} className="btn-secondary btn-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="filter-panel glass-card">
        <div className="status-tabs-row">
          {STATUS_OPTIONS.map(status => (
            <button 
              key={status}
              className={`status-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
              <span className="tab-count">
                {status === 'All' ? bookings.length : bookings.filter(b => b.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <div className="search-city-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search booking ID, customer, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="city-select-box">
            <Filter size={14} className="text-gray-400" />
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="All">All Cities</option>
              <option value="Kannur">Kannur</option>
              <option value="Kozhikode">Kozhikode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Technician</th>
              <th>Location</th>
              <th>Status</th>
              <th>Booking Time</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong className="booking-id-tag">{b.id}</strong>
                  </td>
                  <td>
                    <div className="cust-cell">
                      <span className="cust-name">{b.customerName}</span>
                      <span className="cust-phone">{b.customerPhone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="service-name-pill">{b.service}</span>
                  </td>
                  <td>
                    {b.technicianName !== 'Unassigned' ? (
                      <span className="tech-assigned-name">👷 {b.technicianName}</span>
                    ) : (
                      <span className="tech-unassigned-badge">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className="text-xs">{b.location}</span>
                  </td>
                  <td>
                    <span className={`status-pill status-${b.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-gray">{b.bookingTime}</span>
                  </td>
                  <td>
                    <span className="font-bold text-sm">₹{b.estimatedPrice}</span>
                    <span className="block text-xs text-gray">{b.paymentStatus}</span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button 
                        onClick={() => setSelectedBooking(b)} 
                        className="action-icon-btn blue" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <a 
                        href={`tel:${b.customerPhone}`} 
                        className="action-icon-btn green" 
                        title="Call Customer"
                      >
                        <Phone size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray">
                  No bookings found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Drawer Modal */}
      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleUpdateStatus}
          onReassign={handleReassignTech}
        />
      )}
    </div>
  );
}
