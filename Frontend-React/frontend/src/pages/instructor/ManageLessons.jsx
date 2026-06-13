import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { lessonApi } from '../../api/lessonApi';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

const EMPTY_FORM = { title: '', description: '', videoUrl: '', lessonOrder: 1 };

export default function ManageLessons() {
  const { courseId } = useParams();
  const { showToast } = useToast();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setIsLoading(true);
    lessonApi.getForCourse(courseId)
      .then(({ data }) => setLessons(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [courseId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (lesson) => {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title,
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      lessonOrder: lesson.lessonOrder
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...form, lessonOrder: Number(form.lessonOrder) };
    try {
      if (editingId) {
        await lessonApi.update(editingId, payload);
        showToast('Lesson updated');
      } else {
        await lessonApi.add(courseId, payload);
        showToast('Lesson added');
      }
      handleCancelEdit();
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save lesson', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await lessonApi.remove(lessonId);
      showToast('Lesson deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete lesson', 'error');
    }
  };

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <h3 className="mb-4">Manage lessons</h3>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card p-3">
            <h6 className="mb-3">{editingId ? 'Edit lesson' : 'Add a lesson'}</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Title</label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Description</label>
                <textarea name="description" className="form-control" rows={2} value={form.description} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label small">Video URL</label>
                <input name="videoUrl" className="form-control" value={form.videoUrl} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label small">Order</label>
                <input type="number" name="lessonOrder" className="form-control" min="1" value={form.lessonOrder} onChange={handleChange} required />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving…' : editingId ? 'Save changes' : 'Add lesson'}
                </button>
                {editingId && (
                  <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {isLoading ? <LoadingSpinner /> : (
            <div className="list-group">
              {lessons.length === 0 && <p className="text-muted">No lessons yet - add your first one.</p>}
              {lessons.map((lesson) => (
                <div key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span><span className="text-muted me-2">{lesson.lessonOrder}.</span>{lesson.title}</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(lesson)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(lesson.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
