import React, { useEffect, useState } from 'react';
import { certificateApi } from '../api/certificateApi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    certificateApi.getMine()
      .then(({ data }) => setCertificates(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner fullPage label="Loading your certificates…" />;

  return (
    <div className="container py-5">
      <div className="eyebrow mb-1">Achievements</div>
      <h2 className="mb-4">Your certificates</h2>

      {certificates.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-award fs-1 d-block mb-3" />
          No certificates yet. Complete a course and pass all its quizzes to earn one.
        </div>
      ) : (
        <div className="row g-4">
          {certificates.map((cert) => (
            <div className="col-md-6" key={cert.id}>
              <div className="card p-4 d-flex flex-row align-items-center gap-3">
                <i className="bi bi-award-fill fs-1" style={{ color: 'var(--accent-dark)' }} />
                <div className="flex-grow-1">
                  <h6 className="mb-1">{cert.courseTitle}</h6>
                  <p className="text-muted small mb-2">
                    Certificate No: {cert.certificateNumber}<br />
                    Issued {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                  <a className="btn btn-sm btn-outline-primary" href={cert.downloadUrl} target="_blank" rel="noreferrer">
                    <i className="bi bi-download me-1" /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
