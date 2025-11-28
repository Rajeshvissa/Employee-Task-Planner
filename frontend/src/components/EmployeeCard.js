import React from 'react';
import { Mail, Briefcase, User } from 'lucide-react';
import '../styles/EmployeeCard.css';

const EmployeeCard = ({ employee }) => {
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
      </div>
    </div>
  );
};

export default EmployeeCard;
