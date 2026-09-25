// src/pages/Education.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { educationApi } from '../api/education';
import { formatDate } from '../utils/formatters';

const CATEGORY_ICONS = {
  'Baby Development': 'child_friendly',
  'Nutrition': 'restaurant',
  'Warning Signs': 'medical_services',
};

const CATEGORY_DESCRIPTIONS = {
  'Baby Development': 'Milestones, play & cognitive leaps',
  'Nutrition': 'Feeding guides, solid foods & meal plans',
  'Warning Signs': 'When to call the doctor & symptom checker',
};

export default function Education() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, cats] = await Promise.all([
        educationApi.list(),
        educationApi.categories(),
      ]);
      setArticles(list || []);
      setCategories(cats || []);
    } catch (err) {
      setError(err.message || 'Could not load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // Client-side filtering (category + search)
  const filtered = useMemo(() => {
    let list = articles;
    if (activeCategory) {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.body || '').toLowerCase().includes(q) ||
          (a.author || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, activeCategory, searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="education" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">

          {/* Header + search */}
          <div className="mb-8">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">
              Learn & Grow
            </h2>
            <p className="text-body-md text-on-surface-variant mb-5">
              Trusted health articles and guidance from the World Health Organization.
            </p>

            <div className="relative max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, tips, and milestones..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none font-body-md text-on-surface placeholder:text-outline-variant soft-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-surface-container-high flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Explore by Category */}
          <section className="mb-10">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
              Explore by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(active ? '' : cat)}
                    className={`rounded-[1.5rem] p-5 flex flex-col items-center text-center transition-all duration-200 soft-shadow ${
                      active
                        ? 'bg-primary-fixed border-2 border-primary'
                        : 'bg-surface-container-lowest border-2 border-transparent hover:border-primary-fixed'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                      active ? 'bg-primary text-on-primary' : 'bg-primary-fixed text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[26px]">
                        {CATEGORY_ICONS[cat] || 'article'}
                      </span>
                    </div>
                    <span className="text-headline-sm font-headline-sm text-on-surface mb-1">
                      {cat}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      {CATEGORY_DESCRIPTIONS[cat] || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active filter chip */}
          {(activeCategory || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-body-sm text-on-surface-variant">Showing</span>
              {activeCategory && (
                <span className="inline-flex items-center gap-1 bg-primary text-on-primary px-3 py-1 rounded-full text-label-md font-label-md">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('')} aria-label="Clear category">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-3 py-1 rounded-full text-label-md font-label-md">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              <span className="text-body-sm text-on-surface-variant">
                — {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner label="Loading articles…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="menu_book"
              title="No articles found"
              message={
                searchQuery || activeCategory
                  ? 'Try a different search or category.'
                  : 'Check back soon for new content.'
              }
            />
          ) : (
            <>
              {/* Featured article (first result) */}
              {featured && (
                <section className="mb-10">
                  <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
                    {activeCategory || searchQuery ? 'Top Result' : 'Recommended for You'}
                  </h3>
                  <button
                    onClick={() => navigate(`/education/${featured.id}`)}
                    className="w-full bg-surface-container-lowest rounded-[2rem] soft-shadow overflow-hidden text-left group hover:shadow-[0_8px_30px_rgba(118,182,227,0.12)] transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-2/5 h-56 md:h-auto md:min-h-[280px] bg-surface-container-high overflow-hidden shrink-0 relative">
                        {featured.imageUrl ? (
                          <img
                            src={featured.imageUrl}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-fixed">
                            <span className="material-symbols-outlined text-primary text-6xl">
                              {CATEGORY_ICONS[featured.category] || 'article'}
                            </span>
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-primary-container/30 backdrop-blur-sm text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
                          {featured.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            verified
                          </span>
                          <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                            {featured.author}
                          </span>
                        </div>
                        <h3 className="text-headline-md font-headline-md text-on-surface mb-3 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h3>
                        <p className="text-body-md text-on-surface-variant flex-1 mb-5 line-clamp-3">
                          {featured.body?.slice(0, 200)}
                          {featured.body?.length > 200 ? '…' : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-label-md text-on-surface-variant">
                            {formatDate(featured.publishedDate)}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-primary text-on-primary px-5 py-2 rounded-full font-label-md text-label-md group-hover:gap-2 transition-all">
                            Read Article
                            <span className="material-symbols-outlined text-[16px]">
                              arrow_forward
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </section>
              )}

              {/* Remaining articles grid */}
              {rest.length > 0 && (
                <section>
                  <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
                    {activeCategory || searchQuery ? 'More Results' : 'All Articles'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => navigate(`/education/${a.id}`)}
                        className="bg-surface-container-lowest rounded-[2rem] soft-shadow text-left hover:-translate-y-1 hover:shadow-lg transition-all group flex flex-col h-full overflow-hidden"
                      >
                        {/* Card image */}
                        <div className="h-44 bg-surface-container-high overflow-hidden relative shrink-0">
                          {a.imageUrl ? (
                            <img
                              src={a.imageUrl}
                              alt={a.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-fixed">
                              <span className="material-symbols-outlined text-primary text-5xl">
                                {CATEGORY_ICONS[a.category] || 'article'}
                              </span>
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-primary-container/30 backdrop-blur-sm text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
                            {a.category}
                          </span>
                        </div>

                        {/* Card body */}
                        <div className="p-5 flex flex-col flex-1">
                          <h4 className="text-headline-sm font-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {a.title}
                          </h4>
                          <p className="text-body-sm text-on-surface-variant line-clamp-3 flex-grow">
                            {a.body?.slice(0, 140)}
                            {a.body?.length > 140 ? '…' : ''}
                          </p>

                          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-label-md text-on-surface-variant">
                            <span>{formatDate(a.publishedDate)}</span>
                            <span className="flex items-center gap-1 text-primary font-bold">
                              Read
                              <span className="material-symbols-outlined text-[16px]">
                                arrow_forward
                              </span>
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}