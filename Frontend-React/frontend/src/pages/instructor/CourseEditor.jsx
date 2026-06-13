import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { courseApi } from '../../api/courseApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

const CATEGORIES = ['Programming', 'Web Development', 'Database', 'Data Science', 'Design', 'Business'];

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = !!courseId;

  const [form, setForm] = useState({ title: '', description: '', price: '', image: '', category: CATEGORIES[0] });
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      courseApi.getById(courseId)
        .then(({ data }) => setForm({
          title: data.title,
          description: data.description || '',
          price: data.price,
          image: data.image || '',
          category: data.category || CATEGORIES[0]
        }))
        .finally(() => setIsLoading(false));
    }
  }, [courseId, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        await courseApi.update(courseId, form);
        showToast('Course updated');
      } else {
        const { data } = await courseApi.create(form);
        showToast('Course created! Now add some lessons.');
        navigate(`/instructor/courses/${data.id}/lessons`);
        return;
      }
      navigate('/instructor/courses');
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save course', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <h3 className="mb-4">{isEditing ? 'Edit course' : 'Create a new course'}</h3>

      {isLoading ? <LoadingSpinner /> : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label">Price (₹)</label>
              <input
                type="number" name="price" className="form-control" min="0" step="0.01"
                value={form.price} onChange={handleChange} required
              />
            </div>
            <div className="col-6">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Cover image URL (optional)</label>
            <input name="image" className="form-control" value={form.image} onChange={handleChange} placeholder="https://…" />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Create course'}
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
