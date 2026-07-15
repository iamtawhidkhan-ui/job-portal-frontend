import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, AlertCircle, Users, CheckSquare, Square, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ApplicationAnswers from '../components/ApplicationAnswers';
import ApplicantProfileModal from '../components/ApplicantProfileModal';

const statusOptions = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Called for Interview' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const statusColors = {
  pending: 'border-amber-300 text-amber-700 bg-amber-50',
  shortlisted: 'border-blue-300 text-blue-700 bg-blue-50',
  interview: 'border-purple-300 text-purple-700 bg-purple-50',
  hired: 'border-brand-300 text-brand-700 bg-brand-50',
  rejected: 'border-red-300 text-red-700 bg-red-50',
};

export default function AllApplicants() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('shortlisted');
  const [applyingBulk, setApplyingBulk] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (jobFilter) params.set('jobId', jobFilter);
      if (statusFilter) params.set('status', statusFilter);

      const [appsRes, jobsRes] = await Promise.all([
        api.get(`/applications/employer/all?${params.toString()}`),
        api.get('/jobs/mine/list'),
      ]);
      setApplications(appsRes.data.applications || []);
      setJobs(jobsRes.data.jobs || []);
      setError(null);
    } catch (err) {
      setError('Could not load applicants right now.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map((a) => a._id)));
    }
  };

  const handleSingleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    setApplyingBulk(true);
    try {
      await api.put('/applications/bulk-status', {
        applicationIds: Array.from(selectedIds),
        status: bulkStatus,
      });
      setApplications((prev) =>
        prev.map((a) => (selectedIds.has(a._id) ? { ...a, status: bulkStatus } : a))
      );
      toast.success(`${selectedIds.size} application(s) updated`);
      setSelectedIds(new Set());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update selected applications');
    } finally {
      setApplyingBulk(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">All Applicants</h1>
      <p className="text-ink-500 mb-6">Review candidates across every job you've posted</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>{j.title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 bg-ink-50 rounded-2xl border border-ink-200">
          <Users className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500">No applicants match these filters yet.</p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <>
          {/* Bulk action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 bg-white border border-ink-200 rounded-xl p-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-600 hover:text-brand-600 shrink-0"
            >
              {selectedIds.size === applications.length ? (
                <CheckSquare className="w-4 h-4 text-brand-600" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
            </button>

            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 sm:ml-auto">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="border border-ink-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkUpdate}
                  disabled={applyingBulk}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  {applyingBulk ? 'Applying...' : 'Apply to Selected'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="bg-white border border-ink-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleSelect(app._id)} className="mt-1 shrink-0 text-ink-400 hover:text-brand-600">
                    {selectedIds.has(app._id) ? (
                      <CheckSquare className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="font-semibold text-ink-900 text-sm hover:text-brand-600 hover:underline cursor-pointer w-fit"
                        onClick={() => app.applicant && setSelectedApplicant(app.applicant)}
                      >
                        {app.applicant?.name || 'Unknown applicant'}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.applicant?.email}</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          <Link to={`/dashboard/my-jobs/${app.job?._id}/applicants`} className="hover:text-brand-600">
                            {app.job?.title || 'Unknown job'}
                          </Link>
                        </span>
                        {app.answers?.length > 0 && (
                          <button
                            onClick={() => toggleExpanded(app._id)}
                            className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium"
                          >
                            <Paperclip className="w-3 h-3" /> {app.answers.length} attachment{app.answers.length > 1 ? 's' : ''}
                            {expandedIds.has(app._id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <select
                      value={app.status}
                      onChange={(e) => handleSingleStatusChange(app._id, e.target.value)}
                      className={`shrink-0 text-xs font-medium border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 ${statusColors[app.status] || statusColors.pending}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {expandedIds.has(app._id) && app.answers?.length > 0 && (
                  <div className="border-t border-ink-100 mt-3 pt-3 pl-7">
                    <ApplicationAnswers answers={app.answers} label={null} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {selectedApplicant && (
        <ApplicantProfileModal applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
      )}
    </div>
  );
}
