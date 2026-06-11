import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await login(form);
      showToast(`Welcome back, ${result.name.split(' ')[0]}!`);
      const redirectTo = location.state?.from?.pathname
        || (result.role === 'ADMIN' ? '/admin/dashboard'
          : result.role === 'INSTRUCTOR' ? '/instructor/dashboard'
            : '/student/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <h2 className="mb-1">Log in</h2>
      <p className="text-muted mb-4">Pick up right where you left off.</p>

      {errors.form && <div className="alert alert-danger py-2">{errors.form}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-end mb-3">
          <Link to="/forgot-password" className="small">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-muted small mt-4">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
