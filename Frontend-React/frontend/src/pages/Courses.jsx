import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const CATEGORIES = ['Programming', 'Web Development', 'Database', 'Data Science', 'Design', 'Business'];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const page = parseInt(searchParams.get('page') || '0', 10);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (keyword) {
        response = await courseApi.search(keyword, { page, size: 9 });
      } else if (category) {
        response = await courseApi.getByCategory(category, { page, size: 9 });
      } else {
        response = await courseApi.getAll({ page, size: 9, sortBy: 'id', direction: 'desc' });
      }
      setPageData(response.data);
    } catch (err) {
      setPageData({ content: [], totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [keyword, category, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateParams = (updates, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) next.set(k, v); else next.delete(k);
    });
    if (resetPage) next.set('page', '0');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ q: keyword, category: '' });
    setCategory('');
  };

  const handleCategoryClick = (cat) => {
    const newCategory = category === cat ? '' : cat;
    setCategory(newCategory);
    setKeyword('');
    updateParams({ category: newCategory, q: '' });
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <div className="eyebrow mb-1">Catalog</div>
        <h2>Find your next course</h2>
      </div>

      <form className="row g-2 mb-3" onSubmit={handleSearchSubmit}>
        <div className="col-sm-8">
          <input
            className="form-control"
            placeholder="Search courses by title…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-sm-4">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading courses…" />
      ) : (
        <>
          {pageData?.content?.length === 0 && (
            <div className="text-center py-5 text-muted">
              No courses matched your search. Try a different keyword or category.
            </div>
          )}
          <div className="row g-4">
            {pageData?.content?.map((course) => (
              <div className="col-md-4" key={course.id}>
                <Link to={`/courses/${course.id}`} className="text-decoration-none text-reset">
                  <div className="card h-100">
                    <div className="course-card-image">
  {course.image ? (
    <img
      src={course.image}
      alt={course.title}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement.innerHTML =
          '<i class="bi bi-book"></i>';
      }}
    />
  ) : (
    <i className="bi bi-book" />
  )}
</div>
                    <div className="card-body">
                      <span className="badge-category">{course.category || 'General'}</span>
                      <h5 className="mt-2 mb-1">{course.title}</h5>
                      <p className="text-muted small mb-2">by {course.instructorName}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold" style={{ color: 'var(--primary)' }}>
                          &#8377;{course.price}
                        </span>
                        {course.averageRating > 0 && (
                          <span className="small text-muted">
                            <i className="bi bi-star-fill" style={{ color: 'var(--accent-dark)' }} /> {course.averageRating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <Pagination
            pageNumber={pageData?.pageNumber || 0}
            totalPages={pageData?.totalPages || 0}
            onPageChange={(p) => updateParams({ page: p }, false)}
          />
        </>
      )}
    </div>
  );
}
