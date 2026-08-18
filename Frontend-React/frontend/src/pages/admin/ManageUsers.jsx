import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/admin/users', label: 'Users', icon: 'bi-people' },
  { to: '/admin/courses', label: 'Courses', icon: 'bi-journal-richtext' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

const FILTERS = [
  { key: 'all', label: 'All users' },
  { key: 'students', label: 'Students' },
  { key: 'instructors', label: 'Instructors' }
];

export default function ManageUsers() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    const params = { page, size: 10 };
    const request = filter === 'students'
      ? adminApi.getStudents(params)
      : filter === 'instructors'
        ? adminApi.getInstructors(params)
        : adminApi.getAllUsers(params);

    request.then(({ data }) => setPageData(data)).finally(() => setIsLoading(false));
  };

  useEffect(load, [filter, page]);

  const handleToggleActive = async (userId, currentlyActive) => {
    try {
      await adminApi.setUserStatus(userId, !currentlyActive);
      showToast(`User ${currentlyActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update user', 'error');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user account? This cannot be undone.')) return;
    try {
      await adminApi.deleteUser(userId);
      showToast('User deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete user', 'error');
    }
  };

  return (
    <DashboardLayout title="Admin" navItems={NAV_ITEMS}>
      <h3 className="mb-4">Manage users</h3>

      <div className="btn-group mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => { setFilter(f.key); setPage(0); }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageData?.content?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td className="text-muted small">{u.email}</td>
                    <td><span className="badge-category">{u.role}</span></td>
                    <td>
                      <span className={`badge ${u.isActive ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            pageNumber={pageData?.pageNumber || 0}
            totalPages={pageData?.totalPages || 0}
            onPageChange={setPage}
          />
        </>
      )}
    </DashboardLayout>
  );
}
