import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useToast } from '../../context/ToastContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.resetPassword({ token, newPassword });
      showToast('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h2 className="mb-1">Reset password</h2>
      <p className="text-muted mb-4">Choose a new password for your account.</p>

      {!token && <div className="alert alert-warning">No reset token found in the link. Please use the link from your email.</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">New password</label>
          <input
            type="password" className="form-control" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || !token}>
          {isSubmitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>

      <p className="text-center text-muted small mt-4">
        <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}
