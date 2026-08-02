import React, { useState } from 'react';
import { History, Search, Filter } from 'lucide-react';
import './ActivityLogs.css';

export default function ActivityLogs({ logs }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="logs-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Audit & Activity Logs</h2>
          <p>Complete historical audit log of all internal administrative actions</p>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search action, admin user, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin User</th>
              <th>Action Performed</th>
              <th>Category</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((l) => (
              <tr key={l.id}>
                <td><span className="text-xs text-gray">{l.timestamp}</span></td>
                <td><strong>{l.user}</strong></td>
                <td><span className="text-sm font-semibold">{l.action}</span></td>
                <td><span className="service-name-pill">{l.category}</span></td>
                <td><code className="text-xs text-gray">{l.ip}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
