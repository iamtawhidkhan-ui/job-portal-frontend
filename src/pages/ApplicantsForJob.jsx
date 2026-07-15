import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ExternalLink, AlertCircle, Users } from 'lucide-react';
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

export default function ApplicantsForJob() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const [applicantsRes, jobRes] = await Promise.all([
        api.get(`/applications/job/${jobId}`),
        api.get(`/jobs/${jobId}`),
      ]);
      setApplications(applicantsRes.data.applications || []);
      setJobTitle(jobRes.data.job?.title || '');
      setError(null);
    } catch (err) {
      setError('Could not load applicants right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard/my-jobs" className="flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600 mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to My Job Posts
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">
        Applicants {jobTitle && <span className="text-ink-500 font-normal">for {jobTitle}</span>}
      </h1>
      <p className="text-ink-500 mb-8">Review candidates and update their status</p>

      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 bg-ink-50 rounded-2xl border border-ink-200">
          <Users className="w-8 h-8 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500">No one has applied to this job yet.</p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white border border-ink-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <h3
                    className="font-semibold text-ink-900 hover:text-brand-600 hover:underline cursor-pointer w-fit"
                    onClick={() => app.applicant && setSelectedApplicant(app.applicant)}
                  >
                    {app.applicant?.name || 'Unknown applicant'}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500 mt-1">
                    {app.applicant?.email && (
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.applicant.email}</span>
                    )}
                    {app.applicant?.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {app.applicant.phone}</span>
                    )}
                  </div>
                  {app.applicant?.skills?.length > 0 && (
                    <p className="text-xs text-ink-400 mt-1.5">Skills: {app.applicant.skills.join(', ')}</p>
                  )}
                  {app.applicant?.resumeLink && (
                    <a
                      href={app.applicant.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Profile resume link
                    </a>
                  )}
                </div>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  disabled={updatingId === app._id}
                  className={`shrink-0 text-xs font-medium border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 ${statusColors[app.status] || statusColors.pending}`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {app.answers?.length > 0 && (
                <div className="border-t border-ink-100 pt-3 mt-3">
                  <ApplicationAnswers answers={app.answers} />
                </div>
              )}

              <p className="text-xs text-ink-400 mt-3">
                Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedApplicant && (
        <ApplicantProfileModal applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
      )}
    </div>
  );
}
