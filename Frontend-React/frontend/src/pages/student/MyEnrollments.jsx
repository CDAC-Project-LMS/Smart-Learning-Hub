import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { enrollmentApi } from '../../api/enrollmentApi';
import { certificateApi } from '../../api/certificateApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressRing from '../../components/common/ProgressRing';
import Pagination from '../../components/common/Pagination';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/student/enrollments', label: 'My Courses', icon: 'bi-journal-bookmark' },
  { to: '/certificates', label: 'Certificates', icon: 'bi-award' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function MyEnrollments() {
  const { showToast } = useToast();

  const [pageData, setPageData] = useState({
    content: [],
    pageNumber: 0,
    totalPages: 0
  });

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);

    try {
      const response = await enrollmentApi.getMine({
        page,
        size: 8
      });

      console.log("Enrollment Response:", response.data);

      setPageData(response.data);
    } catch (err) {
      console.error("Enrollment Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }

      showToast(
        err.response?.data?.message || "Failed to load enrollments",
        "error"
      );

      setPageData({
        content: [],
        pageNumber: 0,
        totalPages: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleGetCertificate = async (courseId) => {
    try {
      await certificateApi.issue(courseId);
      showToast("Certificate issued successfully!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Certificate cannot be issued",
        "error"
      );
    }
  };

  return (
    <DashboardLayout title="Student" navItems={NAV_ITEMS}>
      <h3 className="mb-4">My Courses</h3>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {pageData.content.length === 0 ? (
            <div className="alert alert-warning">
              No enrolled courses found.
            </div>
          ) : (
            <div className="row g-3">
              {pageData.content.map((e) => (
                <div className="col-md-6" key={e.id}>
                  <div className="card p-3 shadow-sm">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <ProgressRing
                        percentage={e.progressPercentage}
                        size={50}
                      />

                      <div>
                        <h6 className="mb-1">{e.courseTitle}</h6>
                        <small>{e.status}</small>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        className="btn btn-primary btn-sm flex-fill"
                        to={`/courses/${e.courseId}/learn`}
                      >
                        Continue
                      </Link>

                      {e.status === "COMPLETED" && (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() =>
                            handleGetCertificate(e.courseId)
                          }
                        >
                          Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination
            pageNumber={pageData.pageNumber}
            totalPages={pageData.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </DashboardLayout>
  );
}