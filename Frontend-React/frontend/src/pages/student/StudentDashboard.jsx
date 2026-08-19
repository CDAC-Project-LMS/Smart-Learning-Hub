import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { enrollmentApi } from '../../api/enrollmentApi';
import { certificateApi } from '../../api/certificateApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressRing from '../../components/common/ProgressRing';

const NAV_ITEMS = [
  { to: '/student/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/student/enrollments', label: 'My Courses', icon: 'bi-journal-bookmark' },
  { to: '/certificates', label: 'Certificates', icon: 'bi-award' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function StudentDashboard() {

  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      enrollmentApi.getMine({ page: 0, size: 5 }),
      certificateApi.getMine()
    ])
      .then(([enrollRes, certRes]) => {

        setEnrollments(
          enrollRes.data.content || []
        );

        setCertificates(
          certRes.data || []
        );

      })
      .catch((error) => {
        console.error("Failed to load dashboard data", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, []);


  return (
    <DashboardLayout title="Student" navItems={NAV_ITEMS}>

      <h3 className="mb-1">
        Welcome back, {user.name.split(' ')[0]}
      </h3>

      <p className="text-muted mb-4">
        Here's where you left off.
      </p>


      {isLoading ? (
        <LoadingSpinner />
      ) : (

        <>

          {/* Statistics */}

          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="stat-card">

                <i 
                  className="bi bi-journal-bookmark fs-3"
                  style={{ color: 'var(--primary)' }}
                />

                <div>
                  <div className="stat-value">
                    {enrollments.length}
                  </div>

                  <div className="stat-label">
                    Active enrollments
                  </div>
                </div>

              </div>
            </div>



            <div className="col-md-4">

              <div className="stat-card">

                <i 
                  className="bi bi-award fs-3"
                  style={{ color: 'var(--accent-dark)' }}
                />

                <div>

                  <div className="stat-value">
                    {certificates.length}
                  </div>

                  <div className="stat-label">
                    Certificates earned
                  </div>

                </div>

              </div>

            </div>



            <div className="col-md-4">

              <div className="stat-card">

                <i 
                  className="bi bi-graph-up fs-3"
                  style={{ color: 'var(--success)' }}
                />

                <div>

                  <div className="stat-value">

                    {
                      enrollments.length > 0
                        ? Math.round(
                            enrollments.reduce(
                              (sum, e) => sum + e.progressPercentage,
                              0
                            ) / enrollments.length
                          )
                        : 0
                    }%

                  </div>

                  <div className="stat-label">
                    Average progress
                  </div>

                </div>

              </div>

            </div>


          </div>



          {/* Continue Learning */}

          <h5 className="mb-3">
            Continue learning
          </h5>


          {
            enrollments.length === 0 ? (

              <div className="card p-4 text-center text-muted">

                You haven't enrolled in any courses yet.
                <Link to="/courses">
                  Browse the catalog
                </Link>

              </div>

            ) : (

              <div className="row g-3">

                {
                  enrollments.map((e) => (

                    <div 
                      className="col-md-6"
                      key={e.id}
                    >

                      <Link
                        to={`/courses/${e.courseId}/learn`}
                        className="text-decoration-none text-reset"
                      >

                        <div className="card p-3 d-flex flex-row align-items-center gap-3">

                          <ProgressRing
                            percentage={e.progressPercentage}
                            size={50}
                          />

                          <div>

                            <div className="fw-semibold">
                              {e.courseTitle}
                            </div>

                            <div className="text-muted small">
                              {e.status}
                            </div>

                          </div>

                        </div>

                      </Link>

                    </div>

                  ))
                }

              </div>

            )
          }



          {/* Certificates */}

          <h5 className="mb-3 mt-4">
            My Certificates
          </h5>


          {
            certificates.length === 0 ? (

              <div className="card p-4 text-center text-muted">
                No certificates earned yet.
              </div>

            ) : (

              <div className="row g-3">

                {
                  certificates.map((cert) => (

                    <div
                      className="col-md-6"
                      key={cert.id}
                    >

                      <div className="card p-3">

                        <h6>
                          {cert.courseTitle}
                        </h6>


                        <p className="text-muted small mb-2">
                          Certificate No:
                          {" "}
                          {cert.certificateNumber}
                        </p>


                        <p className="text-muted small">
                          Issued on:
                          {" "}
                          {new Date(cert.issueDate)
                            .toLocaleDateString()}
                        </p>


                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            window.open(
                              cert.downloadUrl,
                              "_blank"
                            )
                          }
                        >
                          <i className="bi bi-download"></i>
                          {" "}
                          Download Certificate
                        </button>


                      </div>

                    </div>

                  ))
                }

              </div>

            )
          }


        </>
      )}

    </DashboardLayout>
  );
}