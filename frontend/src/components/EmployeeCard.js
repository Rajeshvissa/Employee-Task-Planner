import React, { useState } from 'react';
import { Mail, Briefcase, User, Edit2, Trash2 } from 'lucide-react';
import '../styles/EmployeeCard.css';
import EmployeeEditForm from './EmployeeEditForm';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';

const EmployeeCard = ({ employee, onUpdated, onDeleted }) => {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      setBusy(true);
      await employeeAPI.update(employee.id, updatedData);
      setShowEdit(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Failed to update employee', err);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this employee? This action cannot be undone.')) return;
    try {
      setBusy(true);
      await employeeAPI.delete(employee.id);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error('Failed to delete employee', err);
      alert(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="employee-card">
      <div className="employee-avatar">
        <User size={40} />
      </div>

      <div className="employee-info">
        <h3>{employee.name}</h3>

        <div className="employee-detail">
          <Mail size={16} />
          <span>{employee.email}</span>
        </div>

        {employee.position && (
          <div className="employee-detail">
            <Briefcase size={16} />
            <span>{employee.position}</span>
          </div>
        )}
      </div>

      <div className="employee-footer">
        <span className="employee-status">Active</span>
        {user?.role === 'admin' && (
          <div className="employee-actions">
            <button className="btn-icon" onClick={() => setShowEdit(true)} disabled={busy} title="Edit">
              <Edit2 size={16} />
            </button>
            <button className="btn-icon btn-danger" onClick={handleDelete} disabled={busy} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <EmployeeEditForm
          employee={employee}
          onSave={handleSave}
          onCancel={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default EmployeeCard;
