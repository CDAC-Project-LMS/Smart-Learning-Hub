import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center flex-grow-1">
      <div className="eyebrow mb-2">Error 404</div>
      <h1 className="display-4 mb-3">This page took a wrong turn.</h1>
      <p className="text-muted mb-4">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn btn-primary px-4">Back to home</Link>
    </div>
  );
}
