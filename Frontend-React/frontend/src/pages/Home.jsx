import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    courseApi.getAll({ page: 0, size: 3, sortBy: 'id', direction: 'desc' })
      .then(({ data }) => setFeaturedCourses(data.content))
      .catch(() => setFeaturedCourses([]));
  }, []);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero-section py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="eyebrow mb-2">Learn at your own pace</div>
              <h1 className="display-4 mb-3" style={{ lineHeight: 1.1 }}>
                Skills stick when<br />you learn them in order.
              </h1>
              <p className="lead text-secondary mb-4">
                Smart Learning Hub breaks every course into a clear path of lessons and quizzes,
                so you always know exactly what's next - and get a certificate when you finish.
              </p>
              <div className="d-flex gap-2">
                <Link to="/courses" className="btn btn-primary btn-lg px-4">Browse courses</Link>
                <Link to="/register" className="btn btn-outline-primary btn-lg px-4">Create free account</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-elevated p-4">
                <div className="eyebrow mb-3">A typical course path</div>
                <div className="lesson-path-step pb-2">
                  <div>
                    <div className="lesson-path-number">1</div>
                    <div className="lesson-path-line" />
                  </div>
                  <div className="pb-3">
                    <div className="fw-semibold">Watch the lessons</div>
                    <div className="text-muted small">Bite-sized videos, in the order that makes sense.</div>
                  </div>
                </div>
                <div className="lesson-path-step pb-2">
                  <div>
                    <div className="lesson-path-number">2</div>
                    <div className="lesson-path-line" />
                  </div>
                  <div className="pb-3">
                    <div className="fw-semibold">Take the quiz</div>
                    <div className="text-muted small">Instant, automatic scoring - know where you stand.</div>
                  </div>
                </div>
                <div className="lesson-path-step">
                  <div>
                    <div className="lesson-path-number">3</div>
                  </div>
                  <div>
                    <div className="fw-semibold">Earn your certificate</div>
                    <div className="text-muted small">Downloadable proof you can add to your resume.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Featured courses ---------------- */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="eyebrow mb-1">Fresh on the platform</div>
            <h2>Recently added courses</h2>
          </div>
          <Link to="/courses" className="btn btn-sm btn-outline-primary">View all</Link>
        </div>
        <div className="row g-4">
          {featuredCourses.length === 0 && (
            <p className="text-muted">Check back soon - new courses are added regularly.</p>
          )}
          {featuredCourses.map((course) => (
            <div className="col-md-4" key={course.id}>
              <Link to={`/courses/${course.id}`} className="text-decoration-none text-reset">
                <div className="card h-100">
                  <div className="course-card-image">
                    <i className="bi bi-book" />
                  </div>
                  <div className="card-body">
                    <span className="badge-category">{course.category || 'General'}</span>
                    <h5 className="mt-2 mb-1">{course.title}</h5>
                    <p className="text-muted small mb-2">by {course.instructorName}</p>
                    <div className="fw-semibold" style={{ color: 'var(--primary)' }}>
                      &#8377;{course.price}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section className="container pb-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <i className="bi bi-mortarboard fs-1" style={{ color: 'var(--primary)' }} />
            <h5 className="mt-3">For students</h5>
            <p className="text-muted small">Learn at your pace, track progress, and earn certificates.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-easel fs-1" style={{ color: 'var(--primary)' }} />
            <h5 className="mt-3">For instructors</h5>
            <p className="text-muted small">Publish courses, build quizzes, and see how students progress.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-shield-check fs-1" style={{ color: 'var(--primary)' }} />
            <h5 className="mt-3">For admins</h5>
            <p className="text-muted small">Oversee the whole platform from one dashboard.</p>
          </div>
        </div>
      </section>
    </>
  );
}
