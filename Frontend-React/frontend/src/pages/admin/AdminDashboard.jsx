import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/admin/users', label: 'Users', icon: 'bi-people' },
  { to: '/admin/courses', label: 'Courses', icon: 'bi-journal-richtext' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(({ data }) => setStats(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout title="Admin" navItems={NAV_ITEMS}>
      <h3 className="mb-1">Platform overview</h3>
      <p className="text-muted mb-4">A snapshot of Smart Learning Hub right now.</p>

      {isLoading || !stats ? <LoadingSpinner /> : (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-mortarboard fs-3" style={{ color: 'var(--primary)' }} />
              <div>
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-label">Students</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-easel fs-3" style={{ color: 'var(--primary)' }} />
              <div>
                <div className="stat-value">{stats.totalInstructors}</div>
                <div className="stat-label">Instructors</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-journal-richtext fs-3" style={{ color: 'var(--primary)' }} />
              <div>
                <div className="stat-value">{stats.totalCourses}</div>
                <div className="stat-label">Courses</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-journal-bookmark fs-3" style={{ color: 'var(--success)' }} />
              <div>
                <div className="stat-value">{stats.totalEnrollments}</div>
                <div className="stat-label">Enrollments</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-award fs-3" style={{ color: 'var(--accent-dark)' }} />
              <div>
                <div className="stat-value">{stats.totalCertificatesIssued}</div>
                <div className="stat-label">Certificates issued</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <i className="bi bi-currency-rupee fs-3" style={{ color: 'var(--success)' }} />
              <div>
                <div className="stat-value">₹{stats.totalRevenue}</div>
                <div className="stat-label">Total revenue</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
