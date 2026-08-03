import React, { useState } from 'react';
import { Search, Eye, UserX, CheckCircle2, Trash2, Filter, UserCheck, ShieldCheck } from 'lucide-react';
import TechnicianDetailModal from './TechnicianDetailModal';
import './TechnicianManagement.css';

export default function TechnicianManagement({ technicians, setTechnicians }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);

  const filteredTechnicians = (Array.isArray(technicians) ? technicians : []).filter(t => {
    if (!t) return false;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesCity = cityFilter === 'All' || t.city === cityFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = (t.name && String(t.name).toLowerCase().includes(query)) || 
                          (t.phone && String(t.phone).includes(query)) || 
                          (t.serviceAreas && String(t.serviceAreas).toLowerCase().includes(query));
    return matchesCategory && matchesCity && matchesSearch;
  });

  const handleToggleStatus = (techId, newStatus) => {
    setTechnicians(technicians.map(t => t.id === techId ? { ...t, status: newStatus } : t));
    if (selectedTech && selectedTech.id === techId) {
      setSelectedTech({ ...selectedTech, status: newStatus });
    }
  };

  const handleDeleteTech = (techId) => {
    if (window.confirm('Are you sure you want to delete this technician profile?')) {
      setTechnicians(technicians.filter(t => t.id !== techId));
      setSelectedTech(null);
    }
  };

  return (
    <div className="tech-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Technician Roster</h2>
          <p>Manage electricians and plumbers on the platform</p>
        </div>
      </div>

      <div className="filter-panel glass-card">
        <div className="search-city-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search technician name, phone, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="city-select-box">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
            </select>
          </div>

          <div className="city-select-box">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="All">All Cities</option>
              <option value="Kannur">Kannur</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Kochi">Kochi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Technician</th>
              <th>Category</th>
              <th>Phone & City</th>
              <th>Rating</th>
              <th>Jobs Completed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechnicians.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className="tech-table-cell">
                    <img src={t.photo} alt={t.name} className="tech-avatar-table" />
                    <div>
                      <strong className="block">{t.name}</strong>
                      <span className="text-xs text-gray">{t.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`service-name-pill ${t.category === 'Electrician' ? 'blue' : 'green'}`}>
                    {t.category === 'Electrician' ? '⚡ Electrician' : '🚰 Plumber'}
                  </span>
                </td>
                <td>
                  <div className="cust-cell">
                    <span>{t.phone}</span>
                    <span className="text-xs text-gray">{t.city}</span>
                  </div>
                </td>
                <td>
                  <strong className="text-amber">⭐ {t.rating}</strong>
                </td>
                <td>
                  <span className="font-bold">{t.jobsCompleted}</span>
                </td>
                <td>
                  <span className={`status-pill ${t.status === 'Online' ? 'status-completed' : t.status === 'Suspended' ? 'status-cancelled' : 'status-pending'}`}>
                    ● {t.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    <button onClick={() => setSelectedTech(t)} className="action-icon-btn blue" title="View Profile">
                      <Eye size={16} />
                    </button>
                    {t.status === 'Suspended' ? (
                      <button onClick={() => handleToggleStatus(t.id, 'Online')} className="action-icon-btn green" title="Activate">
                        <CheckCircle2 size={16} />
                      </button>
                    ) : (
                      <button onClick={() => handleToggleStatus(t.id, 'Suspended')} className="action-icon-btn amber" title="Suspend">
                        <UserX size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDeleteTech(t.id)} className="action-icon-btn red" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTech && (
        <TechnicianDetailModal 
          tech={selectedTech}
          onClose={() => setSelectedTech(null)}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTech}
        />
      )}
    </div>
  );
}
