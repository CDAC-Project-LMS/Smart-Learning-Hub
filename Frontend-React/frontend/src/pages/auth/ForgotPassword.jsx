import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [resetLink, setResetLink] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await authApi.forgotPassword({ email });

      setMessage(data.message);

      // Save reset link returned by backend
      setResetLink(data.data);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-1">Forgot password</h2>
      <p className="text-muted mb-4">
        Generate a password reset link.
      </p>

      {!message ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Reset Link'}
          </button>
        </form>
      ) : (
        <>
          <div className="alert alert-success">
            {message}
          </div>

          {resetLink && (
            <div className="alert alert-info">
              <strong>Reset Password Link</strong>

              <br />
              <br />

              <a
                href={resetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resetLink}
              </a>
            </div>
          )}
        </>
      )}

      <p className="text-center text-muted small mt-4">
        <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}