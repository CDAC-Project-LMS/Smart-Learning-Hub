import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonApi } from '../api/lessonApi';
import { courseApi } from '../api/courseApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgressRing from '../components/common/ProgressRing';
import { quizApi } from "../api/quizApi";

// Converts a normal YouTube URL (watch, youtu.be, shorts, or already-embed)
// into an embeddable URL. Returns null if it's not a YouTube link, so
// direct video files (.mp4 etc.) fall back to the native <video> tag.
/*function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const videoId = parsed.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}*/

function getYouTubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // Playlist
    if (parsed.pathname === "/playlist") {
      const list = parsed.searchParams.get("list");
      return list
        ? `https://www.youtube.com/embed/videoseries?list=${list}`
        : null;
    }

    // Normal watch URL
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    // Short URL
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.substring(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    // Shorts
    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/")[2];
      return `https://www.youtube.com/embed/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}

export default function LessonPlayer() {
  const { courseId } = useParams();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [courseRes, lessonsRes, enrollRes] = await Promise.all([
        courseApi.getById(courseId),
        lessonApi.getForCourse(courseId),
        enrollmentApi.getDetails(courseId)
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
      setEnrollment(enrollRes.data);
      setActiveLesson((prev) => prev || lessonsRes.data[0] || null);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);*/
  /*const loadAll = useCallback(async () => {
  console.log("loadAll started");

  setIsLoading(true);

  try {
    const courseRes = await courseApi.getById(courseId);
    console.log("Course:", courseRes.data);

    const lessonsRes = await lessonApi.getForCourse(courseId);
    console.log("Lessons:", lessonsRes.data);

    const enrollRes = await enrollmentApi.getDetails(courseId);
    console.log("Enrollment:", enrollRes.data);

    setCourse(courseRes.data);
    setLessons(lessonsRes.data);
    setEnrollment(enrollRes.data);
    setActiveLesson(lessonsRes.data[0] || null);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
}, [courseId]);*/
const loadAll = useCallback(async () => {
  setIsLoading(true);

  try {
    const [courseRes, lessonsRes, enrollRes, quizRes] =
      await Promise.all([
        courseApi.getById(courseId),
        lessonApi.getForCourse(courseId),
        enrollmentApi.getDetails(courseId),
        quizApi.getForCourse(courseId)
      ]);

    setCourse(courseRes.data);
    setLessons(lessonsRes.data);
    setEnrollment(enrollRes.data);
    setQuizzes(quizRes.data);

    setActiveLesson((prev) => prev || lessonsRes.data[0] || null);

  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
}, [courseId]);
  useEffect(() => { loadAll(); }, [loadAll]);

  const handleMarkComplete = async (lesson) => {
    try {
      await lessonApi.markComplete(lesson.id);
      showToast('Lesson marked as complete');
      loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update progress', 'error');
    }
  };

  if (isLoading || !course) {
    return <LoadingSpinner fullPage label="Loading lessons…" />;
  }

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to={`/courses/${courseId}`} className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left" /> Back to course
        </Link>
        <h5 className="mb-0 ms-2">{course.title}</h5>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="ratio ratio-16x9 bg-dark rounded mb-3">
            {activeLesson?.videoUrl ? (
              getYouTubeEmbedUrl(activeLesson.videoUrl) ? (
                <iframe
                  key={activeLesson.id}
                  src={getYouTubeEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-100 h-100"
                  style={{ border: 0 }}
                />
              ) : (
                <video controls key={activeLesson.id} src={activeLesson.videoUrl} className="w-100 h-100" />
              )
            ) : (
              <div className="d-flex align-items-center justify-content-center text-white">
                No video available for this lesson
              </div>
            )}
          </div>
          {/*activeLesson && (
            <>
              <h4>{activeLesson.title}</h4>
              <p className="text-muted">{activeLesson.description}</p>
              {!activeLesson.isCompleted && (
                <button className="btn btn-primary" onClick={() => handleMarkComplete(activeLesson)}>
                  Mark as complete
                </button>
              )}
              {activeLesson.isCompleted && (
                <span className="text-success"><i className="bi bi-check-circle-fill me-1" />Completed</span>
              )}
            </>
          )*/}

          {activeLesson && (
  <>
    <h4>{activeLesson.title}</h4>

    <p className="text-muted">
      {activeLesson.description}
    </p>

    {!activeLesson.isCompleted ? (
      <button
        className="btn btn-primary"
        onClick={() => handleMarkComplete(activeLesson)}
      >
        Mark as Complete
      </button>
    ) : (
      <span className="text-success">
        <i className="bi bi-check-circle-fill me-1"></i>
        Completed
      </span>
    )}

    <hr />

    <h5>Quiz</h5>

    {quizzes
      .filter(q => q.lessonId === activeLesson.id)
      .map(q => (
        <div
          key={q.id}
          className="card mt-3 p-3"
        >
          <h6>{q.title}</h6>

          <small className="text-muted">
            Pass Percentage : {q.passPercentage}%
          </small>

          <br />

          {activeLesson.isCompleted ? (
            <Link
    to={`/quizzes/${q.id}/attempt`}
    className="btn btn-success mt-2"
>
    Take Quiz
</Link>
          ) : (
            <button
              className="btn btn-secondary mt-2"
              disabled
            >
              Complete lesson to unlock quiz
            </button>
          )}
        </div>
      ))}

    {quizzes.filter(q => q.lessonId === activeLesson.id).length === 0 && (
      <p className="text-muted mt-3">
        No quiz available for this lesson.
      </p>
    )}
  </>
)}
        </div>

        <div className="col-lg-4">
          <div className="card p-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <ProgressRing percentage={enrollment?.progressPercentage || 0} size={56} />
              <div>
                <div className="fw-semibold">Your progress</div>
                <div className="text-muted small">{enrollment?.status}</div>
              </div>
            </div>
            <hr />
            <div className="list-group list-group-flush">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeLesson?.id === lesson.id ? 'active' : ''}`}
                  style={activeLesson?.id === lesson.id ? { backgroundColor: 'var(--primary-tint)', color: 'var(--ink)', border: 'none' } : {}}
                  onClick={() => setActiveLesson(lesson)}
                >
                  <span><span className="text-muted me-2">{lesson.lessonOrder}.</span>{lesson.title}</span>
                  {lesson.isCompleted && <i className="bi bi-check-circle-fill text-success" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
