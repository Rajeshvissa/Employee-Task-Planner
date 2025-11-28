import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, employeeAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, AlertCircle, X } from 'lucide-react';
import '../styles/Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, employeeFilter, user?.role]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters based on filters
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      
      // Only include employee filter for admins
      if (user?.role === 'admin' && employeeFilter !== 'all') {
        params.assigned_to = employeeFilter;
      }
      
      console.log('Fetching tasks with params:', params, 'User role:', user?.role, 'User name:', user?.name);
      
      const response = await taskAPI.getAll(params);
      let fetchedTasks = Array.isArray(response.data) ? response.data : [];
      
      console.log('Fetched tasks:', fetchedTasks);
      
      setAllTasks(fetchedTasks);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setTasks([]);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = () => {
    fetchTasks();
    setShowForm(false);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setEmployeeFilter('all');
  };

  const isFiltered = statusFilter !== 'all' || employeeFilter !== 'all';

  if (loading) return <div className="loading-spinner">Loading tasks...</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track your tasks</p>
        </div>
        {user?.role === 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} /> Add Task
          </button>
        )}
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm && user?.role === 'admin' && (
        <TaskForm
          onTaskAdded={handleTaskAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="filter-buttons">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {user?.role === 'admin' && (
          <div className="filter-group">
            <label>Assigned To:</label>
            <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {isFiltered && (
          <button className="btn btn-secondary reset-btn" onClick={resetFilters}>
            <X size={16} /> Reset Filters
          </button>
        )}
      </div>

      <div className="tasks-grid">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleTaskDeleted}
              onUpdate={handleTaskUpdated}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
