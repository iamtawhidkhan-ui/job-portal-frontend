import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin, Calendar, AlertCircle, Users, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import JobFormModal from '../components/JobFormModal';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/mine/list');
      setJobs(res.data.jobs || []);
      setError(null);
    } catch (err) {
      setError('Could not load your job posts right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchMyJobs();
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job post? This cannot be undone.')) {
      return;
    }
    setDeletingId(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete this job');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (jobId) => {
    setDuplicatingId(jobId);
    try {
      const res = await api.post(`/jobs/${jobId}/duplicate`);
      toast.success('Job duplicated — update the deadline and details as needed');
      setJobs((prev) => [res.data.job, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not duplicate this job');
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">My Job Posts</h1>
          <p className="text-ink-500 mt-1">Manage the jobs your company has listed</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/dashboard/applicants"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-ink-700 border border-ink-200 hover:border-brand-400 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Users className="w-4 h-4" /> All Applicants
          </Link>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </button>
        </div>
      </div>

      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 bg-ink-50 rounded-2xl border border-ink-200">
          <p className="text-ink-500 mb-4">You haven't posted any jobs yet.</p>
          <button onClick={openCreateModal} className="text-brand-600 font-medium hover:text-brand-700">
            Post your first job
          </button>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-ink-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-ink-900">{job.title}</h3>
                  <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/dashboard/my-jobs/${job._id}/applicants`}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-600 border border-brand-200 hover:border-brand-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> Applicants
                </Link>
                <button
                  onClick={() => openEditModal(job)}
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-700 border border-ink-200 hover:border-brand-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDuplicate(job._id)}
                  disabled={duplicatingId === job._id}
                  className="flex items-center gap-1.5 text-sm font-medium text-ink-700 border border-ink-200 hover:border-brand-400 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> {duplicatingId === job._id ? 'Duplicating...' : 'Duplicate'}
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 hover:border-red-400 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {deletingId === job._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <JobFormModal
          job={editingJob}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
