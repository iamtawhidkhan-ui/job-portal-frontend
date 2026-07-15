import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { useSavedJobs } from '../hooks/useSavedJobs';

const categoryOptions = [
  'Software Development', 'Marketing', 'Finance', 'Design', 'Customer Support', 'Engineering',
];
const typeOptions = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

export default function Jobs() {
  const { savedIds, toggleSave, isJobseeker } = useSavedJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Local input state, synced from/to URL search params
  const [titleInput, setTitleInput] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchParams.get('search')) params.set('search', searchParams.get('search'));
      if (category) params.set('category', category);
      if (type) params.set('type', type);
      if (location) params.set('location', location);
      params.set('page', page);
      params.set('limit', '9');

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError('Could not load jobs right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1'); // reset to page 1 on any filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', titleInput);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setTitleInput('');
    setSearchParams({});
  };

  const hasActiveFilters = category || type || location || searchParams.get('search');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Browse Jobs</h1>
        <p className="text-ink-500 mt-1">
          {loading ? 'Searching...' : `${total} job${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center flex-1 bg-white border border-ink-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-brand-500">
          <Search className="w-4 h-4 text-ink-500 shrink-0" />
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Search by job title..."
            className="w-full py-3 px-2 text-sm text-ink-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center justify-center gap-2 border border-ink-200 hover:border-brand-400 px-5 py-3 rounded-xl text-sm font-medium text-ink-700 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-ink-200 rounded-xl p-5 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Job Type</label>
            <select
              value={type}
              onChange={(e) => updateParam('type', e.target.value)}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Location</label>
            <input
              type="text"
              defaultValue={location}
              onBlur={(e) => updateParam('location', e.target.value)}
              placeholder="e.g. Dhaka"
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium mb-6">
          Clear all filters
        </button>
      )}

      {/* Results */}
      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          No jobs match your search. Try adjusting your filters.
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} isSaved={savedIds.has(job._id)} onToggleSave={isJobseeker ? toggleSave : undefined} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-ink-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-ink-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-ink-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
