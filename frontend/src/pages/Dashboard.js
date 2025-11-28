import React, { useState, useEffect } from 'react';
import { dashboardAPI, taskAPI, employeeAPI } from '../services/api';
import { BarChart3, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashStats, tasksRes, employeesRes] = await Promise.all([
        dashboardAPI.getStats(),
        taskAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      const totalTasks = tasksRes.data.length;
      const completedTasks = tasksRes.data.filter((t) => t.status === 'completed').length;
      const pendingTasks = tasksRes.data.filter((t) => t.status === 'pending').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setStats({
        totalTasks,
        completedTasks,
        totalEmployees: employeesRes.data.length,
        pendingTasks,
        completionRate,
        ...dashStats.data,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your task management hub</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-tasks">
            <BarChart3 size={28} />
          </div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats?.totalTasks || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <h3>Completed Tasks</h3>
            <p className="stat-number">{stats?.completedTasks || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <h3>Pending Tasks</h3>
            <p className="stat-number">{stats?.pendingTasks || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon employees">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats?.totalEmployees || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completion-rate">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <h3>Completion Rate</h3>
            <p className="stat-number">{stats?.completionRate || 0}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
