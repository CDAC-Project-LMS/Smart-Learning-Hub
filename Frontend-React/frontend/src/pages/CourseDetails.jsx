import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { lessonApi } from '../api/lessonApi';
import { quizApi } from '../api/quizApi';
import { reviewApi } from '../api/reviewApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [courseRes, lessonsRes, quizzesRes, reviewsRes] = await Promise.all([
        courseApi.getById(id),
        lessonApi.getForCourse(id),
        quizApi.getForCourse(id),
        reviewApi.getForCourse(id, { page: 0, size: 20 })
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setQuizzes(quizzesRes.data);
      setReviews(reviewsRes.data.content);

      if (user?.role === 'STUDENT') {
        try {
          const enrollRes = await enrollmentApi.getDetails(id);
          setEnrollment(enrollRes.data);
        } catch {
          setEnrollment(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsEnrolling(true);
    try {
      if (Number(course.price) > 0) {
        navigate(`/payment/${id}`);
        return;
      }
      await enrollmentApi.enroll(id);
      showToast('Enrolled! Head to "My Enrollments" to start learning.');
      loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not enroll', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.add(id, reviewForm);
      showToast('Thanks for your review!');
      setReviewForm({ rating: 5, comment: '' });
      loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit review', 'error');
    }
  };

  if (isLoading || !course) {
    return <LoadingSpinner fullPage label="Loading course…" />;
  }

  const isEnrolled = !!enrollment;
  console.log("Enrollment =", enrollment);
console.log("isEnrolled =", isEnrolled);
<p>Enrolled: {String(isEnrolled)}</p>

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-8">
          <span className="badge-category">{course.category || 'General'}</span>
          <h1 className="mt-2 mb-2">{course.title}</h1>
          <p className="text-muted">
            by {course.instructorName} · {course.totalEnrollments} students enrolled
            {course.averageRating > 0 && (
              <> · <StarRating rating={course.averageRating} /> ({course.totalReviews})</>
            )}
          </p>

          <ul className="nav nav-tabs mt-4">
            {['overview', 'lessons', 'reviews'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={activeTab === tab ? { color: 'var(--primary)', fontWeight: 600 } : {}}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            {activeTab === 'overview' && (
              <p style={{ whiteSpace: 'pre-line' }}>{course.description || 'No description provided yet.'}</p>
            )}

            {/*activeTab === 'lessons' && (
              <ul className="list-group">
                {lessons.length === 0 && <p className="text-muted">No lessons published yet.</p>}
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center">
                   
                    <span><span className="text-muted me-2">{lesson.lessonOrder}.</span>{lesson.title}</span>
                    {lesson.isCompleted && <i className="bi bi-check-circle-fill text-success" />}
                  </li>
                ))}
              </ul>
            )*/}
            {activeTab === "lessons" && (
  <ul className="list-group">
    {lessons.length === 0 ? (
      <p className="text-muted">No lessons published yet.</p>
    ) : (
      lessons.map((lesson) => (
        <li key={lesson.id} className="list-group-item">

          <h5>
            <span className="text-muted me-2">
              {lesson.lessonOrder}.
            </span>
            {lesson.title}
          </h5>

          <p>{lesson.description}</p>

          {lesson.isCompleted && (
            <i className="bi bi-check-circle-fill text-success me-2"></i>
          )}

         
         
         {/* <a
  href={lesson.videoUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-danger btn-sm"
>
  ▶ Watch Video
</a>*/}


{isEnrolled ? (
  lesson.videoUrl ? (
    /*<a
      href={lesson.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-danger btn-sm mt-2"
    >
      ▶ Watch Video
    </a>*/
    <Link
  to={`/courses/${id}/learn`}
  className="btn btn-danger btn-sm"
>
  ▶ Watch Video
</Link>
  ) : (
    <span className="text-danger">Video not available</span>
  )
) : (
  <button
    className="btn btn-secondary btn-sm mt-2"
    disabled
  >
    🔒 Enroll to watch
  </button>
)}

        </li>
      ))
    )}
  </ul>
)}

            

            {activeTab === 'reviews' && (
              <div>
                {isEnrolled && (
                  <form onSubmit={handleReviewSubmit} className="card p-3 mb-4">
                    <label className="form-label small">Your rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
                      size="1.4rem"
                    />
                    <textarea
                      className="form-control mt-2"
                      placeholder="Share your experience with this course…"
                      rows={2}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    <button className="btn btn-primary btn-sm mt-2 align-self-start" type="submit">
                      Submit review
                    </button>
                  </form>
                )}
                {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{review.studentName}</strong>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-muted mb-0 small">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-elevated p-4 sticky-top" style={{ top: '90px' }}>
            <div className="course-card-image mb-3">
  {course.image ? (
    <img
      src={course.image}
      alt={course.title}
      className="w-100 h-100 rounded"
      style={{ objectFit: "cover" }}
    />
  ) : (
    <i className="bi bi-book fs-1" />
  )}
</div>
            <div className="fs-3 fw-semibold mb-3" style={{ color: 'var(--primary)' }}>
              {Number(course.price) === 0 ? 'Free' : `₹${course.price}`}
            </div>

            {user?.role === 'STUDENT' && (
              isEnrolled ? (
                <Link to={`/courses/${id}/learn`} className="btn btn-primary w-100 mb-2">
                  Continue learning ({enrollment.progressPercentage}%)
                </Link>
              ) : (
                <button className="btn btn-primary w-100 mb-2" onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? 'Please wait…' : Number(course.price) === 0 ? 'Enroll for free' : 'Enroll now'}
                </button>
              )
            )}
            {!user && (
              <button className="btn btn-primary w-100 mb-2" onClick={() => navigate('/login')}>
                Log in to enroll
              </button>
            )}

            <ul className="list-unstyled small text-muted mt-3 mb-0">
              <li className="mb-2"><i className="bi bi-play-circle me-2" />{lessons.length} lessons</li>
              <li className="mb-2"><i className="bi bi-patch-question me-2" />{quizzes.length} quizzes</li>
              <li><i className="bi bi-award me-2" />Certificate on completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
