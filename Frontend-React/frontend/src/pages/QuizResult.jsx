import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import ProgressRing from '../components/common/ProgressRing';

export default function QuizResult() {
  const location = useLocation();
  const { quizId } = useParams();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">No result to show. Please attempt the quiz first.</p>
        <Link className="btn btn-outline-primary" to="/student/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
      <ProgressRing percentage={result.score} size={140} strokeWidth={10} />
      <h2 className="mt-4 mb-1">{result.passed ? 'Nicely done!' : 'Not quite there yet'}</h2>
      <p className="text-muted mb-4">
        You scored {result.correctAnswers} out of {result.totalQuestions} on "{result.quizTitle}".
      </p>

      <div className={`alert ${result.passed ? 'alert-success' : 'alert-danger'}`}>
        {result.passed
          ? 'You passed! This attempt counts toward your certificate eligibility.'
          : 'You did not reach the pass mark this time. You can try again anytime.'}
      </div>

      <div className="d-flex gap-2 justify-content-center mt-4">
        <Link className="btn btn-outline-primary" to={`/quizzes/${quizId}/attempt`}>Retake quiz</Link>
        <Link className="btn btn-primary" to="/student/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
