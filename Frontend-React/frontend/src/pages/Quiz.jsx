import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    quizApi.getForAttempt(quizId)
      .then(({ data }) => setQuiz(data))
      .finally(() => setIsLoading(false));
  }, [quizId]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      showToast('Please answer every question before submitting', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId: Number(questionId),
          selectedOption
        }))
      };
      const { data } = await quizApi.submit(quizId, payload);
      navigate(`/quizzes/${quizId}/result`, { state: { result: data } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit quiz', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !quiz) {
    return <LoadingSpinner fullPage label="Loading quiz…" />;
  }

  const options = ['A', 'B', 'C', 'D'];
  const optionLabels = { A: 'optionA', B: 'optionB', C: 'optionC', D: 'optionD' };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <div className="eyebrow mb-1">Quiz</div>
      <h2 className="mb-1">{quiz.title}</h2>
      <p className="text-muted mb-4">Pass mark: {quiz.passPercentage}% · {quiz.questions.length} questions</p>

      {quiz.questions.map((question, index) => (
        <div key={question.id} className="card p-3 mb-3">
          <p className="fw-semibold mb-3">{index + 1}. {question.question}</p>
          {options.map((opt) => (
            <div className="form-check mb-2" key={opt}>
              <input
                className="form-check-input"
                type="radio"
                name={`question-${question.id}`}
                id={`q${question.id}-${opt}`}
                checked={answers[question.id] === opt}
                onChange={() => handleSelect(question.id, opt)}
              />
              <label className="form-check-label" htmlFor={`q${question.id}-${opt}`}>
                {question[optionLabels[opt]]}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button className="btn btn-primary w-100" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit quiz'}
      </button>
    </div>
  );
}
