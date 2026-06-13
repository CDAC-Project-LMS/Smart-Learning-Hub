import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { courseApi } from '../../api/courseApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    courseApi.getMine({ page: 0, size: 5 })
      .then(({ data }) => setCourses(data.content))
      .finally(() => setIsLoading(false));
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0);
  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + (c.averageRating || 0), 0) / courses.length).toFixed(1)
    : '—';

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h3 className="mb-0">Welcome back, {user.name.split(' ')[0]}</h3>
        <Link to="/instructor/courses/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1" /> New course
        </Link>
      </div>
      <p className="text-muted mb-4">Here's how your courses are doing.</p>

      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="stat-card">
                <i className="bi bi-easel fs-3" style={{ color: 'var(--primary)' }} />
                <div>
                  <div className="stat-value">{courses.length}</div>
                  <div className="stat-label">Published courses</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <i className="bi bi-people fs-3" style={{ color: 'var(--success)' }} />
                <div>
                  <div className="stat-value">{totalStudents}</div>
                  <div className="stat-label">Total enrollments</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <i className="bi bi-star fs-3" style={{ color: 'var(--accent-dark)' }} />
                <div>
                  <div className="stat-value">{avgRating}</div>
                  <div className="stat-label">Average rating</div>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mb-3">Your recent courses</h5>
          {courses.length === 0 ? (
            <div className="card p-4 text-center text-muted">
              You haven't created any courses yet. <Link to="/instructor/courses/new">Create your first course</Link>.
            </div>
          ) : (
            <div className="list-group">
              {courses.map((c) => (
                <Link key={c.id} to={`/instructor/courses/${c.id}/edit`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <span>{c.title}</span>
                  <span className="text-muted small">{c.totalEnrollments} students</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
