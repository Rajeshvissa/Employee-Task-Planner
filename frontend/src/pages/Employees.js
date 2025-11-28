import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeCard from '../components/EmployeeCard';
import { Plus, AlertCircle } from 'lucide-react';
import '../styles/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = () => {
    fetchEmployees();
    setShowForm(false);
  };

  if (loading) return <div className="loading-spinner">Loading employees...</div>;

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div>
          <h1>Employees</h1>
          <p>Manage your team members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Employee
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <EmployeeForm
          onEmployeeAdded={handleEmployeeAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="employees-grid">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))
        ) : (
          <div className="empty-state">
            <p>No employees added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
