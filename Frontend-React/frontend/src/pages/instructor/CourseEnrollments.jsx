import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { enrollmentApi } from '../../api/enrollmentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressRing from '../../components/common/ProgressRing';

const NAV_ITEMS = [
  { to: '/instructor/dashboard', label: 'Overview', icon: 'bi-grid', end: true },
  { to: '/instructor/courses', label: 'My Courses', icon: 'bi-easel' },
  { to: '/profile', label: 'Profile', icon: 'bi-person' }
];

export default function CourseEnrollments() {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    enrollmentApi.getForCourse(courseId)
      .then(({ data }) => setEnrollments(data))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  return (
    <DashboardLayout title="Instructor" navItems={NAV_ITEMS}>
      <h3 className="mb-4">Enrolled students</h3>

      {isLoading ? <LoadingSpinner /> : (
        enrollments.length === 0 ? (
          <p className="text-muted">No students enrolled yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Enrolled on</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id}>
                    <td>{e.studentName}</td>
                    <td><span className="badge-category">{e.status}</span></td>
                    <td><ProgressRing percentage={e.progressPercentage} size={36} strokeWidth={4} /></td>
                    <td className="text-muted small">{new Date(e.enrollmentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </DashboardLayout>
  );
}
