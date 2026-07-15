import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { useSavedJobs } from '../hooks/useSavedJobs';

export default function SavedJobs() {
  const { savedIds, toggleSave } = useSavedJobs();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/saved-jobs');
      setJobs((res.data.savedJobs || []).map((s) => s.job));
      setError(null);
    } catch (err) {
      setError('Could not load your saved jobs right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // When a job gets unsaved from this page, drop it from the visible list immediately
  const handleToggle = async (jobId) => {
    await toggleSave(jobId);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">Saved Jobs</h1>
      <p className="text-ink-500 mb-8">Jobs you've bookmarked to review or apply to later</p>

      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 bg-ink-50 rounded-2xl border border-ink-200">
          <Bookmark className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">You haven't saved any jobs yet.</p>
          <Link to="/jobs" className="text-brand-600 font-medium hover:text-brand-700">
            Browse open jobs
          </Link>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isSaved={savedIds.has(job._id)} onToggleSave={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
