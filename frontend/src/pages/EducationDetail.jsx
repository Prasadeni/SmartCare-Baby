// src/pages/EducationDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { educationApi } from '../api/education';
import { formatDate } from '../utils/formatters';

const CATEGORY_ICONS = {
  'Baby Development': 'child_friendly',
  'Nutrition': 'restaurant',
  'Warning Signs': 'medical_services',
};

export default function EducationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [article, setArticle] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await educationApi.get(id);
      setArticle(data);
    } catch (err) {
      setError(err.message || 'Could not load article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="education" />

        <main className="max-w-[800px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <button
            onClick={() => navigate('/education')}
            className="flex items-center gap-2 text-primary font-label-md mb-6 hover:opacity-80"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            All Articles
          </button>

          {loading ? (
            <LoadingSpinner label="Loading article…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !article ? (
            <ErrorState title="Article not found" />
          ) : (
            <article className="bg-surface-container-lowest rounded-[2rem] soft-shadow overflow-hidden">

              {/* Hero image */}
              <div className="h-56 md:h-72 bg-surface-container-high overflow-hidden relative">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-fixed">
                    <span className="material-symbols-outlined text-primary text-7xl">
                      {CATEGORY_ICONS[article.category] || 'article'}
                    </span>
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-primary-container/30 backdrop-blur-sm text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 md:p-10">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-md font-label-md">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    {article.author}
                  </span>
                  <span className="text-label-md text-on-surface-variant">
                    • {article.contentType}
                  </span>
                  <span className="text-label-md text-on-surface-variant">
                    • {formatDate(article.publishedDate)}
                  </span>
                </div>

                <h1 className="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-on-surface mb-6">
                  {article.title}
                </h1>

                {/* Content — preserve line breaks */}
                <div className="text-body-lg text-on-surface leading-relaxed space-y-4">
                  {article.body.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
                  ))}
                </div>

                {/* WHO badge */}
                {article.author?.includes('World Health Organization') && (
                  <div className="mt-8 bg-primary-fixed rounded-2xl p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      health_and_safety
                    </span>
                    <div>
                      <p className="text-body-sm font-bold text-on-primary-fixed">
                        Source: World Health Organization
                      </p>
                      <p className="text-label-md text-on-primary-fixed-variant">
                        Content adapted from WHO official guidance.
                      </p>
                    </div>
                  </div>
                )}

                                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-outline-variant/30">
                  <Link
                    to="/education"
                    className="inline-flex items-center gap-2 text-primary font-label-md hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back to articles
                  </Link>
                </div>
                
              </div>
            </article>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}