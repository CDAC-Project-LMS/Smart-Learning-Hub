import React from 'react';

/**
 * The signature visual motif of Smart Learning Hub: a small ring that
 * fills clockwise to represent completion. Reused on course cards,
 * dashboard stat tiles, and the lesson player to keep "progress" visually
 * consistent everywhere a learner sees their own advancement.
 */
export default function ProgressRing({ percentage = 0, size = 48, strokeWidth = 5, showLabel = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span className="ring-label" style={{ fontSize: size * 0.26 }}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
