import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, LayoutDashboard, CheckSquare, Users } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Task Tracker</h1>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {user?.role === 'admin' && (
              <li>
                <button
                  className="nav-link"
                  onClick={() => {
                    navigate('/dashboard');
                    setMenuOpen(false);
                  }}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </button>
              </li>
            )}
            <li>
              <button
                className="nav-link"
                onClick={() => {
                  navigate('/tasks');
                  setMenuOpen(false);
                }}
              >
                <CheckSquare size={20} /> Tasks
              </button>
            </li>
            {user?.role === 'admin' && (
              <li>
                <button
                  className="nav-link"
                  onClick={() => {
                    navigate('/employees');
                    setMenuOpen(false);
                  }}
                >
                  <Users size={20} /> Employees
                </button>
              </li>
            )}
          </ul>

          <div className="navbar-user">
            <span className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`user-role ${user?.role}`}>{user?.role}</span>
            </span>
            <button className="btn btn-logout" onClick={handleLogout}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
