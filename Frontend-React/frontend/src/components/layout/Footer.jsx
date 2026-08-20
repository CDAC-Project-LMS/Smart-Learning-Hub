import React from 'react';

export default function Footer() {
  return (
    <footer className="border-top py-4 mt-auto bg-white">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span className="text-muted small">© {new Date().getFullYear()} Smart Learning Hub. All rights reserved.</span>
        <span className="text-muted small">Built for learners, by learners.</span>
      </div>
    </footer>
  );
}
