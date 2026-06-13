import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { quizApi } from '../../api/quizApi';
import { lessonApi } from '../../api/lessonApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

const EMPTY_QUESTION = {
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A'
};

export default function ManageQuiz() {
  const { courseId } = useParams();
  const { showToast } = useToast();

  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newQuizForm, setNewQuizForm] = useState({
    title: '',
    lessonId: '',
    passPercentage: 60
  });

  const [questionForms, setQuestionForms] = useState({});

  const load = async () => {
    setIsLoading(true);

    try {
      const [quizRes, lessonRes] = await Promise.all([
        quizApi.getForCourseInstructor(courseId),
        lessonApi.getForCourse(courseId)
      ]);

      setQuizzes(quizRes.data);
      setLessons(lessonRes.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [courseId]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    try {
      await quizApi.create(courseId, {
        title: newQuizForm.title,
        lessonId: Number(newQuizForm.lessonId),
        passPercentage: Number(newQuizForm.passPercentage)
      });

      showToast('Quiz created');

      setNewQuizForm({
        title: '',
        lessonId: '',
        passPercentage: 60
      });

      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Could not create quiz',
        'error'
      );
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz and all its questions?')) return;

    try {
      await quizApi.removeQuiz(quizId);
      showToast('Quiz deleted');
      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Could not delete quiz',
        'error'
      );
    }
  };

  const getQuestionForm = (quizId) =>
    questionForms[quizId] || EMPTY_QUESTION;

  const updateQuestionForm = (quizId, updates) => {
    setQuestionForms((prev) => ({
      ...prev,
      [quizId]: {
        ...getQuestionForm(quizId),
        ...updates
      }
    }));
  };

  const handleAddQuestion = async (quizId, e) => {
    e.preventDefault();

    try {
      await quizApi.addQuestion(
        quizId,
        getQuestionForm(quizId)
      );

      showToast('Question added');

      setQuestionForms((prev) => ({
        ...prev,
        [quizId]: EMPTY_QUESTION
      }));

      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Could not add question',
        'error'
      );
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await quizApi.removeQuestion(questionId);
      showToast('Question deleted');
      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Could not delete question',
        'error'
      );
    }
  };

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <h3 className="mb-4">Manage Quizzes</h3>

      <div className="card p-3 mb-4">
        <h5>Create New Quiz</h5>

        <form
          onSubmit={handleCreateQuiz}
          className="d-flex flex-column gap-3"
        >
          <input
            className="form-control"
            placeholder="Quiz Title"
            value={newQuizForm.title}
            onChange={(e) =>
              setNewQuizForm({
                ...newQuizForm,
                title: e.target.value
              })
            }
            required
          />

          <select
            className="form-select"
            value={newQuizForm.lessonId}
            onChange={(e) =>
              setNewQuizForm({
                ...newQuizForm,
                lessonId: e.target.value
              })
            }
            required
          >
            <option value="">Select Lesson</option>

            {lessons.map((lesson) => (
              <option
                key={lesson.id}
                value={lesson.id}
              >
                {lesson.lessonOrder}. {lesson.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            placeholder="Pass Percentage"
            min="0"
            max="100"
            value={newQuizForm.passPercentage}
            onChange={(e) =>
              setNewQuizForm({
                ...newQuizForm,
                passPercentage: e.target.value
              })
            }
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
          >
            Create Quiz
          </button>
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id} className="card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5>{quiz.title}</h5>
                <small className="text-muted">
                  Pass Percentage : {quiz.passPercentage}%
                </small>
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDeleteQuiz(quiz.id)}
              >
                Delete Quiz
              </button>
            </div>

            <ul className="list-group mb-3">
              {quiz.questions.length === 0 ? (
                <li className="list-group-item text-muted">
                  No Questions Yet
                </li>
              ) : (
                quiz.questions.map((q, index) => (
                  <li
                    key={q.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {index + 1}. {q.question}
                      <br />
                      <small>
                        Correct Answer : {q.correctOption}
                      </small>
                    </span>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleDeleteQuestion(q.id)
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>

            <form
              onSubmit={(e) =>
                handleAddQuestion(quiz.id, e)
              }
              className="border rounded p-3"
            >
              <input
                className="form-control mb-2"
                placeholder="Question"
                value={getQuestionForm(quiz.id).question}
                onChange={(e) =>
                  updateQuestionForm(quiz.id, {
                    question: e.target.value
                  })
                }
                required
              />

              {['optionA', 'optionB', 'optionC', 'optionD'].map(
                (field, index) => (
                  <input
                    key={field}
                    className="form-control mb-2"
                    placeholder={`Option ${String.fromCharCode(
                      65 + index
                    )}`}
                    value={getQuestionForm(quiz.id)[field]}
                    onChange={(e) =>
                      updateQuestionForm(quiz.id, {
                        [field]: e.target.value
                      })
                    }
                    required
                  />
                )
              )}

              <div className="d-flex align-items-center gap-2">
                <label>Correct Option</label>

                <select
                  className="form-select w-auto"
                  value={getQuestionForm(quiz.id).correctOption}
                  onChange={(e) =>
                    updateQuestionForm(quiz.id, {
                      correctOption: e.target.value
                    })
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>

                <button
                  className="btn btn-primary ms-auto"
                  type="submit"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}