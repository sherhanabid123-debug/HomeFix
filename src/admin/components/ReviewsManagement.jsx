import React, { useState } from 'react';
import { Star, EyeOff, Trash2, Phone, ShieldAlert } from 'lucide-react';
import './ReviewsManagement.css';

const INITIAL_REVIEWS = [
  { id: 1, customer: 'Anjali Menon', tech: 'Rajesh Kumar', rating: 5, comment: 'Rajesh arrived in 20 minutes in Kannur and fixed our short circuit cleanly.', date: '2026-08-02', status: 'Published' },
  { id: 2, customer: 'Firoz Moopen', tech: 'Suresh Varma', rating: 5, comment: 'Great plumbing work. Found the concealed leak under kitchen tile accurately.', date: '2026-08-01', status: 'Published' },
  { id: 3, customer: 'Anonymous', tech: 'Vineeth CP', rating: 2, comment: 'Technician arrived 15 mins late due to traffic near Mavoor road.', date: '2026-07-30', status: 'Reported' }
];

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleHide = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: r.status === 'Hidden' ? 'Published' : 'Hidden' } : r));
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="reviews-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Reviews & Ratings Moderation</h2>
          <p>Monitor customer ratings and moderate reported feedback</p>
        </div>
      </div>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Technician</th>
              <th>Rating</th>
              <th>Review Comment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.customer}</strong></td>
                <td>{r.tech}</td>
                <td><span className="text-amber font-bold">⭐ {r.rating}.0</span></td>
                <td><p className="text-xs text-gray">{r.comment}</p></td>
                <td><span className="text-xs">{r.date}</span></td>
                <td>
                  <span className={`status-pill ${r.status === 'Published' ? 'status-completed' : 'status-cancelled'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group">
                    <button onClick={() => handleHide(r.id)} className="action-icon-btn amber" title="Hide Review">
                      <EyeOff size={16} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="action-icon-btn red" title="Delete Review">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
