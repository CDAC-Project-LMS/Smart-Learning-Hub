import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { courseApi } from '../../api/courseApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/admin/users', label: 'Users', icon: 'bi-people' },
  { to: '/admin/courses', label: 'Courses', icon: 'bi-journal-richtext' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function ManageCoursesAdmin() {
  const { showToast } = useToast();
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    courseApi.getAllAdmin({ page, size: 10 })
      .then(({ data }) => setPageData(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course? This will remove all its lessons, quizzes, and enrollments.')) return;
    try {
      await courseApi.removeAdmin(courseId);
      showToast('Course deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete course', 'error');
    }
  };

  return (
    <DashboardLayout title="Admin" navItems={NAV_ITEMS}>
      <h3 className="mb-4">All courses</h3>

      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageData?.content?.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td className="text-muted small">{c.instructorName}</td>
                    <td><span className="badge-category">{c.category || 'General'}</span></td>
                    <td>₹{c.price}</td>
                    <td>{c.totalEnrollments}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
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
