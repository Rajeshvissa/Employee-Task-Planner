import React, { useState } from 'react';
import { employeeAPI } from '../services/api';
import { X, Send } from 'lucide-react';
import '../styles/EmployeeForm.css';

const EmployeeForm = ({ onEmployeeAdded, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      await employeeAPI.add({
        name,
        email,
        position: position || 'General',
      });
      onEmployeeAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form-overlay">
      <div className="employee-form-modal">
        <div className="form-header">
          <h2>Add New Employee</h2>
          <button className="btn-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter employee name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              id="position"
              type="text"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Send size={20} /> {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
