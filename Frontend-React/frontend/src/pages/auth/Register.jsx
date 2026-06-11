import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'STUDENT' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await register(form);
      showToast(`Welcome to Smart Learning Hub, ${result.name.split(' ')[0]}!`);
      const redirectTo = result.role === 'INSTRUCTOR' ? '/instructor/dashboard' : '/student/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      } else {
        setErrors({ form: err.response?.data?.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h2 className="mb-1">Create your account</h2>
      <p className="text-muted mb-4">Join as a student to learn, or an instructor to teach.</p>

      {errors.form && <div className="alert alert-danger py-2">{errors.form}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            name="name" className="form-control" value={form.name} onChange={handleChange} required
          />
          {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required
          />
          {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Phone (optional)</label>
          <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password" name="password" className="form-control" value={form.password}
            onChange={handleChange} required minLength={6}
          />
          {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
        </div>
        <div className="mb-4">
          <label className="form-label d-block">I want to join as</label>
          <div className="btn-group w-100" role="group">
            {['STUDENT', 'INSTRUCTOR'].map((role) => (
              <React.Fragment key={role}>
                <input
                  type="radio"
                  className="btn-check"
                  name="role"
                  id={`role-${role}`}
                  checked={form.role === role}
                  onChange={() => setForm({ ...form, role })}
                />
                <label className="btn btn-outline-primary" htmlFor={`role-${role}`}>
                  {role === 'STUDENT' ? 'A student' : 'An instructor'}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-muted small mt-4">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
