import React from 'react';
import { BarChart3, TrendingUp, PieChart, MapPin, Zap, Wrench } from 'lucide-react';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  return (
    <div className="analytics-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Analytics & Operational Intelligence</h2>
          <p>Marketplace metrics, revenue trends, service breakdown & city performance</p>
        </div>
      </div>

      <div className="analytics-grid-2">
        {/* Daily Bookings Chart */}
        <div className="chart-card glass-card">
          <h3>Daily Booking Volume (Past 7 Days)</h3>
          <div className="bar-chart-visual" style={{ justifyContent: 'center', alignItems: 'center', color: '#888' }}>
            <p>No data available yet</p>
          </div>
        </div>

        {/* City Performance */}
        <div className="chart-card glass-card">
          <h3>City Demand Breakdown</h3>
          <div className="city-pie-breakdown" style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            <p>No demand data recorded</p>
          </div>
        </div>

        {/* Most Booked Services */}
        <div className="chart-card glass-card">
          <h3>Most Requested Services</h3>
          <div className="service-rank-list" style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            <p>No services requested yet</p>
          </div>
        </div>

        {/* Cancellation Reasons */}
        <div className="chart-card glass-card">
          <h3>Top Cancellation Reasons</h3>
          <div className="service-rank-list" style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            <p>No cancellations recorded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
