import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Calendar, DollarSign, ArrowLeft, Building2, ListChecks, AlertCircle, CheckCircle2, Bookmark,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ApplyModal from '../components/ApplyModal';
import CompanyProfileModal from '../components/CompanyProfileModal';
import { useAuthStore } from '../store/authStore';
import { useSavedJobs } from '../hooks/useSavedJobs';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { savedIds, toggleSave, isJobseeker } = useSavedJobs();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('This job posting could not be found. It may have been removed.');
        } else {
          setError('Could not load this job right now. Please try again shortly.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in as a job seeker to apply');
      navigate('/login');
      return;
    }
    if (user?.role !== 'jobseeker') {
      toast.error('Only job seeker accounts can apply for jobs');
      return;
    }

    // If the employer set up custom requirements, collect them via a modal first.
    if (job.applicationRequirements?.length > 0) {
      setShowApplyModal(true);
      return;
    }

    // Otherwise, apply instantly — backend already supports this fully (Phase 3):
    // duplicate applications are blocked server-side and returned as 409.
    setApplying(true);
    try {
      await api.post(`/applications/${id}`);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You have already applied to this job');
        setHasApplied(true);
      } else {
        toast.error(err.response?.data?.message || 'Could not submit your application');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-10 h-10 text-ink-400 mx-auto mb-4" />
        <p className="text-ink-500 mb-6">{error}</p>
        <Link to="/jobs" className="text-brand-600 font-medium hover:text-brand-700">
          &larr; Back to all jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;

  const deadlinePassed = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">{job.title}</h1>
            {job.postedBy?._id ? (
              <button
                onClick={() => setShowCompanyModal(true)}
                className="text-ink-500 mt-1 flex items-center gap-1.5 hover:text-brand-600 hover:underline"
              >
                <Building2 className="w-4 h-4" /> {job.companyName}
              </button>
            ) : (
              <p className="text-ink-500 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> {job.companyName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start">
            <span className="text-sm font-medium bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full">
              {job.type}
            </span>
            {isJobseeker && (
              <button
                onClick={() => toggleSave(job._id)}
                aria-label={savedIds.has(job._id) ? 'Remove from saved jobs' : 'Save job'}
                className="p-2 rounded-full border border-ink-200 hover:border-brand-400 text-ink-400 hover:text-brand-600 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${savedIds.has(job._id) ? 'fill-brand-600 text-brand-600' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
          <div className="flex items-center gap-2 text-ink-700">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" /> {job.location}
          </div>
          <div className="flex items-center gap-2 text-ink-700">
            <Briefcase className="w-4 h-4 text-brand-600 shrink-0" /> {job.category}
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-ink-700">
              <DollarSign className="w-4 h-4 text-brand-600 shrink-0" /> {job.salary}
            </div>
          )}
          <div className={`flex items-center gap-2 ${deadlinePassed ? 'text-red-600' : 'text-ink-700'}`}>
            <Calendar className="w-4 h-4 shrink-0" />
            {deadlinePassed ? 'Deadline passed' : `Apply by ${new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-ink-900 mb-2">Job Description</h2>
          <p className="text-ink-700 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-brand-600" /> Requirements
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={applying || deadlinePassed || hasApplied}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          {hasApplied && <CheckCircle2 className="w-4 h-4" />}
          {deadlinePassed
            ? 'Applications Closed'
            : hasApplied
            ? 'Applied'
            : applying
            ? 'Submitting...'
            : job.applicationRequirements?.length > 0
            ? 'Apply Now (Additional Info Required)'
            : 'Apply Now'}
        </button>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setHasApplied(true);
          }}
        />
      )}

      {showCompanyModal && job.postedBy?._id && (
        <CompanyProfileModal employerId={job.postedBy._id} onClose={() => setShowCompanyModal(false)} />
      )}
    </div>
  );
}
