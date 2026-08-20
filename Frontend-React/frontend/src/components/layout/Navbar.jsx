import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user
    ? user.role === 'ADMIN'
      ? '/admin/dashboard'
      : user.role === 'INSTRUCTOR'
        ? '/instructor/dashboard'
        : '/student/dashboard'
    : '/login';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-font" to="/">
          <i className="bi bi-mortarboard-fill me-2" style={{ color: 'var(--accent-dark)' }} />
          Smart Learning Hub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Log in</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm px-3" to="/register">Get started</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={dashboardPath}>Dashboard</Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-sm btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user.name?.split(' ')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">Profile</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>Log out</button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
