import React, { useState } from 'react';
import { IndianRupee, TrendingUp, CreditCard, DollarSign, Download, Filter } from 'lucide-react';
import './PaymentsManagement.css';

export default function PaymentsManagement({ bookings = [] }) {
  const [methodFilter, setMethodFilter] = useState('All');

  const safeBookings = Array.isArray(bookings) ? bookings.filter(Boolean) : [];

  const filteredTransactions = safeBookings.filter(b => 
    methodFilter === 'All' || (b.paymentMethod && String(b.paymentMethod).includes(methodFilter))
  );

  const totalRevenue = safeBookings.reduce((sum, b) => sum + (b.status === 'Completed' ? (Number(b.estimatedPrice) || 0) : 0), 0);
  const totalCommission = safeBookings.reduce((sum, b) => sum + (b.status === 'Completed' ? (Number(b.commission) || 0) : 0), 0);
  const pendingSettlements = safeBookings.filter(b => b.paymentStatus && String(b.paymentStatus).includes('Pending')).reduce((sum, b) => sum + (Number(b.technicianPayout) || 0), 0);

  return (
    <div className="payments-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Financials & Payments</h2>
          <p>Revenue analytics, platform commission tracking & technician settlements</p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card glass-card">
          <span className="text-xs text-gray font-bold">Today's Revenue</span>
          <span className="text-2xl font-bold text-dark mt-1">₹{totalRevenue}</span>
        </div>
        <div className="kpi-card glass-card">
          <span className="text-xs text-gray font-bold">Monthly Revenue</span>
          <span className="text-2xl font-bold text-primary mt-1">₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="kpi-card glass-card">
          <span className="text-xs text-gray font-bold">Commission Earned (15%)</span>
          <span className="text-2xl font-bold text-emerald mt-1">₹{totalCommission.toFixed(2)}</span>
        </div>
        <div className="kpi-card glass-card">
          <span className="text-xs text-gray font-bold">Pending Settlements</span>
          <span className="text-2xl font-bold text-amber mt-1">₹{pendingSettlements.toFixed(2)}</span>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="search-city-row">
          <span className="font-bold text-sm">Filter by Method:</span>
          <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="form-select text-sm w-auto">
            <option value="All">All Payment Methods</option>
            <option value="UPI">UPI (GPay/PhonePe)</option>
            <option value="Cash">Cash on Delivery</option>
            <option value="Card">Credit/Debit Card</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Commission (15%)</th>
              <th>Tech Net Payout</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((b) => {
                const estPrice = Number(b.estimatedPrice) || 0;
                const comm = Number(b.commission) || 0;
                const payout = Number(b.technicianPayout) || 0;
                const status = b.paymentStatus || 'Pending';

                return (
                  <tr key={b.id || Math.random()}>
                    <td><strong>{b.id || 'N/A'}</strong></td>
                    <td>{b.customerName || 'Customer'}</td>
                    <td><strong className="text-dark">₹{estPrice}</strong></td>
                    <td><span className="service-name-pill">{b.paymentMethod || 'UPI'}</span></td>
                    <td><span className="text-emerald font-bold">₹{comm.toFixed(2)}</span></td>
                    <td><span className="font-bold">₹{payout.toFixed(2)}</span></td>
                    <td>
                      <span className={`status-pill ${status.includes('Paid') ? 'status-completed' : status.includes('Refunded') ? 'status-cancelled' : 'status-pending'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray py-6">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
