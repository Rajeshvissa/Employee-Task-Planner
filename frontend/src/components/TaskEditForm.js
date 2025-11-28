import React, { useState, useEffect } from 'react';
import { taskAPI, employeeAPI } from '../services/api';
import { X, Send } from 'lucide-react';
import '../styles/TaskForm.css';

const TaskEditForm = ({ task, onTaskUpdated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    // Populate form with existing task data
    setTitle(task.title || '');
    setDescription(task.description || '');
    setAssignedTo(task.assigned_to || '');
    setStatus(task.status || 'pending');
  }, [task]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const taskData = {
        title,
        description,
        assigned_to: assignedTo || null,
        status,
      };
      console.log('Updating task data:', taskData);
      await taskAPI.update(task.id, taskData);
      onTaskUpdated();
    } catch (err) {
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || err.response?.data?.details || 'Failed to update task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="form-header">
          <h2>Edit Task</h2>
          <button className="btn-close" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} /> {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditForm;
