import React from 'react';
import { NavLink } from 'react-router-dom';

export default function DashboardLayout({ title, navItems, children }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="eyebrow mb-3">{title}</div>
        <nav className="nav flex-column">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} me-2`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
