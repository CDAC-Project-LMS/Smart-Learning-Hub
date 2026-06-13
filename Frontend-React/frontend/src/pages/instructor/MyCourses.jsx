import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { courseApi } from '../../api/courseApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function MyCourses() {
  const { showToast } = useToast();
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    courseApi.getMine({ page, size: 8 })
      .then(({ data }) => setPageData(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await courseApi.remove(courseId);
      showToast('Course deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete course', 'error');
    }
  };

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My courses</h3>
        <Link to="/instructor/courses/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1" /> New course
        </Link>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <>
          {pageData?.content?.length === 0 && (
            <div className="card p-4 text-center text-muted">
              You haven't created any courses yet.
            </div>
          )}
          <div className="row g-3">
            {pageData?.content?.map((course) => (
              <div className="col-md-6" key={course.id}>
                <div className="card p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{course.title}</h6>
                      <span className="badge-category">{course.category || 'General'}</span>
                    </div>
                    <span className="fw-semibold" style={{ color: 'var(--primary)' }}>₹{course.price}</span>
                  </div>
                  <p className="text-muted small mb-3">
                    {course.totalEnrollments} students · {course.averageRating || 0}★ ({course.totalReviews} reviews)
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-sm btn-outline-primary" to={`/instructor/courses/${course.id}/edit`}>
                      Edit
                    </Link>
                    <Link className="btn btn-sm btn-outline-primary" to={`/instructor/courses/${course.id}/lessons`}>
                      Lessons
                    </Link>
                    <Link className="btn btn-sm btn-outline-primary" to={`/instructor/courses/${course.id}/quiz`}>
                      Quiz
                    </Link>
                    <Link className="btn btn-sm btn-outline-primary" to={`/instructor/courses/${course.id}/enrollments`}>
                      Students
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(course.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
