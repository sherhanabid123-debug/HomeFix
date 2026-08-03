import React from 'react';
import { 
  CalendarCheck, Activity, CheckCircle2, FileCheck, Users, UserCheck, 
  IndianRupee, TrendingUp, AlertTriangle, Star, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import './DashboardOverview.css';

export default function DashboardOverview({ allData = {}, onNavigate }) {
  const bookings = Array.isArray(allData.bookings) ? allData.bookings : [];
  const technicians = Array.isArray(allData.technicians) ? allData.technicians : [];
  const applications = Array.isArray(allData.applications) ? allData.applications : [];
  const customers = Array.isArray(allData.customers) ? allData.customers : [];
  const logs = Array.isArray(allData.logs) ? allData.logs : [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookingsCount = bookings.filter(b => b && b.bookingTime && b.bookingTime.includes(todayStr)).length;
  const activeJobsCount = bookings.filter(b => b && ['Assigned', 'Accepted', 'On The Way', 'Started'].includes(b.status)).length;
  const completedJobsCount = bookings.filter(b => b && b.status === 'Completed').length;
  const pendingApprovalsCount = applications.filter(a => a && a.status === 'Pending').length;
  const totalCustomersCount = customers.length;
  const totalTechniciansCount = technicians.length;
  const todayRevenue = bookings.filter(b => b && b.status === 'Completed' && b.bookingTime && b.bookingTime.includes(todayStr)).reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
  const monthlyRevenue = bookings.filter(b => b && b.status === 'Completed').reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
  
  const totalBookingsCount = bookings.length;
  const cancelledCount = bookings.filter(b => b && b.status === 'Cancelled').length;
  const cancellationRate = totalBookingsCount > 0 ? `${((cancelledCount / totalBookingsCount) * 100).toFixed(1)}%` : '0.0%';

  const ratedBookings = bookings.filter(b => b && b.customerRating > 0);
  const avgRating = ratedBookings.length > 0 
    ? (ratedBookings.reduce((sum, b) => sum + (b.customerRating || 0), 0) / ratedBookings.length).toFixed(1)
    : '0.0';

  const KPI_CARDS = [
    { title: "Today's Bookings", val: todayBookingsCount, trend: 'Live today', isUp: true, icon: CalendarCheck, color: 'blue', tab: 'bookings' },
    { title: "Active Jobs", val: activeJobsCount, trend: 'In Progress', isUp: true, icon: Activity, color: 'green', tab: 'bookings' },
    { title: "Completed Jobs", val: completedJobsCount, trend: 'Total Completed', isUp: true, icon: CheckCircle2, color: 'emerald', tab: 'bookings' },
    { title: "Pending Approvals", val: pendingApprovalsCount, trend: 'Requires Review', isUp: false, icon: FileCheck, color: 'amber', tab: 'applications' },
    { title: "Total Customers", val: totalCustomersCount, trend: 'Registered Users', isUp: true, icon: Users, color: 'indigo', tab: 'customers' },
    { title: "Total Technicians", val: totalTechniciansCount, trend: 'Active Network', isUp: true, icon: UserCheck, color: 'purple', tab: 'technicians' },
    { title: "Today's Revenue", val: `₹${todayRevenue}`, trend: 'Daily Payouts', isUp: true, icon: IndianRupee, color: 'emerald', tab: 'payments' },
    { title: "Monthly Revenue", val: `₹${monthlyRevenue.toLocaleString()}`, trend: 'Total Earned', isUp: true, icon: TrendingUp, color: 'blue', tab: 'payments' },
    { title: "Cancellation Rate", val: cancellationRate, trend: 'System Average', isUp: true, icon: AlertTriangle, color: 'red', tab: 'bookings' },
    { title: "Average Rating", val: `⭐ ${avgRating}`, trend: `${ratedBookings.length} Reviews`, isUp: true, icon: Star, color: 'amber', tab: 'reviews' }
  ];

  return (
    <div className="dashboard-overview-page">
      {/* Top Banner */}
      <div className="overview-welcome-banner glass-card">
        <div>
          <h2>Welcome back, <span className="text-primary">Sherhan</span> 👋</h2>
          <p>HomeFix Operations Dashboard, live monitoring</p>
        </div>
        <div className="banner-actions">
          <button onClick={() => onNavigate('bookings')} className="btn-primary btn-sm">
            <span>Manage Live Bookings</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="kpi-grid">
        {KPI_CARDS.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`kpi-card glass-card color-${kpi.color}`}
              onClick={() => onNavigate(kpi.tab)}
            >
              <div className="kpi-card-top">
                <div className={`kpi-icon-badge ${kpi.color}`}>
                  <IconComp size={22} />
                </div>
                <span className={`kpi-trend ${kpi.isUp ? 'trend-up' : 'trend-warn'}`}>
                  {kpi.trend}
                </span>
              </div>
              <div className="kpi-card-bottom">
                <div className="kpi-value">{kpi.val}</div>
                <div className="kpi-title">{kpi.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Activity Feed & Quick Actions */}
      <div className="overview-two-col">
        {/* Recent Activity Live Timeline */}
        <div className="activity-card glass-card">
          <div className="card-header-row">
            <h3>Recent Activity Feed</h3>
            <button onClick={() => onNavigate('logs')} className="link-btn">View All Logs</button>
          </div>
          
          <div className="activity-timeline">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{log.action}</strong>
                      <span className="timeline-time">{log.timestamp}</span>
                    </div>
                    <div className="timeline-sub">
                      <span>By {log.user}</span> • <span className="cat-badge">{log.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No recent activity logs recorded. Actions taken in the admin portal will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Live Operational Status */}
        <div className="ops-status-card glass-card">
          <h3>City Ops Summary</h3>

          <div className="city-ops-box">
            <div className="city-ops-header">
              <span className="city-name">Kannur Network</span>
              <span className="status-pill active-pill">Active</span>
            </div>
            <div className="city-stats-row">
              <div><span>Active Techs:</span> <strong>{technicians.filter(t => t.city === 'Kannur').length}</strong></div>
              <div><span>Open Jobs:</span> <strong>{bookings.filter(b => b.city === 'Kannur' && b.status !== 'Completed' && b.status !== 'Cancelled').length}</strong></div>
            </div>
          </div>

          <div className="city-ops-box mt-3">
            <div className="city-ops-header">
              <span className="city-name">Kozhikode Network</span>
              <span className="status-pill active-pill">Active</span>
            </div>
            <div className="city-stats-row">
              <div><span>Active Techs:</span> <strong>{technicians.filter(t => t.city === 'Kozhikode').length}</strong></div>
              <div><span>Open Jobs:</span> <strong>{bookings.filter(b => b.city === 'Kozhikode' && b.status !== 'Completed' && b.status !== 'Cancelled').length}</strong></div>
            </div>
          </div>

          <div className="city-ops-box mt-3">
            <div className="city-ops-header">
              <span className="city-name">Kochi Network</span>
              <span className="status-pill active-pill">Active</span>
            </div>
            <div className="city-stats-row">
              <div><span>Active Techs:</span> <strong>{technicians.filter(t => t.city === 'Kochi').length}</strong></div>
              <div><span>Open Jobs:</span> <strong>{bookings.filter(b => b.city === 'Kochi' && b.status !== 'Completed' && b.status !== 'Cancelled').length}</strong></div>
            </div>
          </div>

          <div className="quick-alert-box mt-4">
            <ShieldCheck size={20} className="text-secondary" />
            <div>
              <strong>Dispatch Engine Ready</strong>
              <p className="text-xs text-gray-500">Automated technician matching active for new customer bookings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
