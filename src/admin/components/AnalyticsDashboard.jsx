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
          <div className="bar-chart-visual">
            <div className="bar-col"><div className="bar-fill h-40"></div><span>Mon</span></div>
            <div className="bar-col"><div className="bar-fill h-52"></div><span>Tue</span></div>
            <div className="bar-col"><div className="bar-fill h-64"></div><span>Wed</span></div>
            <div className="bar-col"><div className="bar-fill h-48"></div><span>Thu</span></div>
            <div className="bar-col"><div className="bar-fill h-72"></div><span>Fri</span></div>
            <div className="bar-col"><div className="bar-fill h-84"></div><span>Sat</span></div>
            <div className="bar-col"><div className="bar-fill h-96"></div><span>Sun</span></div>
          </div>
        </div>

        {/* City Performance */}
        <div className="chart-card glass-card">
          <h3>City Demand Breakdown</h3>
          <div className="city-pie-breakdown">
            <div className="city-bar-item">
              <div className="flex justify-between font-bold text-sm mb-1">
                <span>Kannur District</span>
                <span>35% (140 Jobs)</span>
              </div>
              <div className="progress-bg"><div className="progress-fill blue" style={{ width: '35%' }}></div></div>
            </div>
            <div className="city-bar-item mt-4">
              <div className="flex justify-between font-bold text-sm mb-1">
                <span>Kozhikode District</span>
                <span>40% (160 Jobs)</span>
              </div>
              <div className="progress-bg"><div className="progress-fill green" style={{ width: '40%' }}></div></div>
            </div>
            <div className="city-bar-item mt-4">
              <div className="flex justify-between font-bold text-sm mb-1">
                <span>Kochi District</span>
                <span>25% (100 Jobs)</span>
              </div>
              <div className="progress-bg"><div className="progress-fill amber" style={{ width: '25%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Most Booked Services */}
        <div className="chart-card glass-card">
          <h3>Most Requested Services</h3>
          <div className="service-rank-list">
            <div className="rank-item">
              <span>1. Switch & Socket Replacement</span>
              <strong>38%</strong>
            </div>
            <div className="rank-item">
              <span>2. Electrical Circuit Repairs</span>
              <strong>28%</strong>
            </div>
            <div className="rank-item">
              <span>3. Water Leak Sealing</span>
              <strong>20%</strong>
            </div>
            <div className="rank-item">
              <span>4. Ceiling Fan Installation</span>
              <strong>14%</strong>
            </div>
          </div>
        </div>

        {/* Cancellation Reasons */}
        <div className="chart-card glass-card">
          <h3>Top Cancellation Reasons</h3>
          <div className="service-rank-list">
            <div className="rank-item">
              <span>Customer schedule conflict</span>
              <strong className="text-red">52%</strong>
            </div>
            <div className="rank-item">
              <span>Resolved without escalation</span>
              <strong className="text-amber">28%</strong>
            </div>
            <div className="rank-item">
              <span>Duplicate request</span>
              <strong className="text-gray">20%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
