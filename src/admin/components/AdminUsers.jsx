import React, { useState } from 'react';
import { ShieldCheck, Plus, UserPlus, Trash2 } from 'lucide-react';
import './AdminUsers.css';

export default function AdminUsers({ adminUsers, setAdminUsers }) {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Support Executive');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (name && email) {
      const newUser = {
        id: `ADM-0${adminUsers.length + 1}`,
        name,
        email,
        role,
        status: 'Active',
        lastLogin: 'Never',
        permissions: role === 'Super Admin' ? ['all'] : ['bookings', 'customers']
      };
      setAdminUsers([...adminUsers, newUser]);
      setName('');
      setEmail('');
      setNewModalOpen(false);
    }
  };

  return (
    <div className="admin-users-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Admin Staff & Role Permissions</h2>
          <p>Manage internal HomeFix administrative team members and access levels</p>
        </div>

        <button onClick={() => setNewModalOpen(true)} className="btn-primary btn-sm">
          <UserPlus size={16} /> Add Staff User
        </button>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID & Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                  <span className="block text-xs text-gray">{u.id}</span>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`service-name-pill ${u.role === 'Super Admin' ? 'blue' : 'green'}`}>
                    {u.role}
                  </span>
                </td>
                <td><span className="text-xs text-gray">{u.lastLogin}</span></td>
                <td><span className="status-pill status-completed">{u.status}</span></td>
                <td>
                  <button onClick={() => setAdminUsers(adminUsers.filter(usr => usr.id !== u.id))} className="action-icon-btn red" title="Delete User">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {newModalOpen && (
        <div className="modal-overlay" onClick={() => setNewModalOpen(false)}>
          <div className="modal-content p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Add Staff Member</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Support Executive">Support Executive</option>
                </select>
              </div>
              <div className="modal-btn-row">
                <button type="button" onClick={() => setNewModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Staff User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
