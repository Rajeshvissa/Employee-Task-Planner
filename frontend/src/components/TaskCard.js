import React, { useState } from 'react';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Check, X, Edit2 } from 'lucide-react';
import TaskEditForm from './TaskEditForm';
import '../styles/TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const { user } = useAuth();

  const handleStatusToggle = async () => {
    try {
      setError('');
      setUpdating(true);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskAPI.update(task.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update task';
      setError(message);
      console.error('Failed to update task:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError('');
        await taskAPI.delete(task.id);
        onDelete(task.id);
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to delete task';
        setError(message);
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleTaskEdited = () => {
    setShowEditForm(false);
    onUpdate();
  };

  return (
    <div className={`task-card ${task.status}`}>
      {error && <div className="task-error">{error}</div>}
      {showEditForm && (
        <TaskEditForm
          task={task}
          onTaskUpdated={handleTaskEdited}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      <div className="task-header">
        <div className="task-title-section">
          <h3>{task.title}</h3>
          <span className={`status-badge ${task.status}`}>{task.status}</span>
        </div>
        {user?.role === 'admin' && (
          <div className="task-actions">
            <button
              className="btn-edit"
              onClick={() => setShowEditForm(true)}
              title="Edit task"
            >
              <Edit2 size={18} />
            </button>
            <button
              className="btn-delete"
              onClick={handleDelete}
              title="Delete task"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <span className="task-assigned">
          {task.assigned_to ? `Assigned to: ${task.assigned_to}` : 'Unassigned'}
        </span>
        <button
          className={`btn-status ${task.status}`}
          onClick={handleStatusToggle}
          disabled={updating}
        >
          {task.status === 'completed' ? (
            <>
              <Check size={16} /> Completed
            </>
          ) : (
            <>
              <X size={16} /> Pending
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
