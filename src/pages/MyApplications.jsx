import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Star, CalendarCheck, CheckCircle2, XCircle, MapPin, Building2,
  AlertCircle, LayoutGrid, List, Trash2, Paperclip, ChevronDown, ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ApplicationAnswers from '../components/ApplicationAnswers';

const statusConfig = {
  pending: { label: 'Pending Review', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlisted', icon: Star, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  interview: { label: 'Called for Interview', icon: CalendarCheck, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  hired: { label: 'Hired', icon: CheckCircle2, className: 'bg-brand-50 text-brand-700 border-brand-200' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
};
const statusOrder = ['pending', 'shortlisted', 'interview', 'hired', 'rejected'];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'board'
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/mine');
        setApplications(res.data.applications || []);
        setError(null);
      } catch (err) {
        setError('Could not load your applications right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Withdraw this application? This cannot be undone.')) return;
    setWithdrawingId(applicationId);
    try {
      await api.delete(`/applications/${applicationId}`);
      setApplications((prev) => prev.filter((a) => a._id !== applicationId));
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not withdraw this application');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">My Applications</h1>
          <p className="text-ink-500">Track the status of every job you've applied to</p>
        </div>

        {!loading && !error && applications.length > 0 && (
          <div className="flex items-center gap-1 bg-ink-100 rounded-lg p-1 shrink-0 self-start">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === 'list' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === 'board' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner size="lg" />}

      {!loading && error && (
        <div className="flex items-center gap-2 justify-center py-16 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-16 bg-ink-50 rounded-2xl border border-ink-200">
          <p className="text-ink-500 mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="text-brand-600 font-medium hover:text-brand-700">
            Browse open jobs
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && view === 'list' && (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationListItem
              key={app._id}
              app={app}
              onWithdraw={handleWithdraw}
              withdrawing={withdrawingId === app._id}
            />
          ))}
        </div>
      )}

      {!loading && !error && applications.length > 0 && view === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statusOrder.map((statusKey) => {
            const config = statusConfig[statusKey];
            const Icon = config.icon;
            const columnApps = applications.filter((a) => a.status === statusKey);
            return (
              <div key={statusKey} className="bg-ink-50 rounded-2xl p-3 border border-ink-200">
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <Icon className="w-3.5 h-3.5 text-ink-500" />
                  <h3 className="text-xs font-semibold text-ink-700">{config.label}</h3>
                  <span className="ml-auto text-xs text-ink-400">{columnApps.length}</span>
                </div>
                <div className="space-y-2 min-h-[60px]">
                  {columnApps.length === 0 && (
                    <p className="text-xs text-ink-400 text-center py-4">None</p>
                  )}
                  {columnApps.map((app) => (
                    <ApplicationBoardCard
                      key={app._id}
                      app={app}
                      onWithdraw={handleWithdraw}
                      withdrawing={withdrawingId === app._id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ApplicationListItem({ app, onWithdraw, withdrawing }) {
  const [expanded, setExpanded] = useState(false);

  if (!app.job) {
    return (
      <div className="bg-white border border-ink-200 rounded-2xl p-5 text-sm text-ink-500">
        This job posting is no longer available.
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <Link to={`/jobs/${app.job._id}`} className="font-semibold text-ink-900 hover:text-brand-700 transition-colors">
            {app.job.title}
          </Link>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500 mt-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> {app.job.companyName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {app.job.location}
            </span>
          </div>
          <p className="text-xs text-ink-400 mt-2">
            Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          {app.answers?.length > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium mt-2"
            >
              <Paperclip className="w-3 h-3" /> {app.answers.length} submitted item{app.answers.length > 1 ? 's' : ''}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${status.className}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {status.label}
          </span>
          <button
            onClick={() => onWithdraw(app._id)}
            disabled={withdrawing}
            title="Withdraw application"
            className="p-2 rounded-lg border border-ink-200 text-ink-400 hover:text-red-600 hover:border-red-300 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && app.answers?.length > 0 && (
        <div className="border-t border-ink-100 mt-4 pt-4">
          <ApplicationAnswers answers={app.answers} label={null} />
        </div>
      )}
    </div>
  );
}

function ApplicationBoardCard({ app, onWithdraw, withdrawing }) {
  if (!app.job) {
    return (
      <div className="bg-white rounded-xl p-3 text-xs text-ink-400 border border-ink-200">
        Job no longer available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-3 border border-ink-200 group">
      <Link to={`/jobs/${app.job._id}`} className="text-sm font-medium text-ink-900 hover:text-brand-700 line-clamp-2">
        {app.job.title}
      </Link>
      <p className="text-xs text-ink-500 mt-1 truncate">{app.job.companyName}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-ink-400">
          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        <button
          onClick={() => onWithdraw(app._id)}
          disabled={withdrawing}
          title="Withdraw application"
          className="text-ink-300 hover:text-red-600 disabled:opacity-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
