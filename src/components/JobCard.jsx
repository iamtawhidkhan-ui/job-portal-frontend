import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, Bookmark } from 'lucide-react';
import CompanyProfileModal from './CompanyProfileModal';

function formatDeadline(deadline) {
  if (!deadline) return null;
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: 'Deadline passed', urgent: true };
  if (diffDays === 0) return { text: 'Deadline today', urgent: true };
  if (diffDays <= 3) return { text: `${diffDays} day${diffDays > 1 ? 's' : ''} left`, urgent: true };
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), urgent: false };
}

// isSaved/onToggleSave are optional — pages that don't track bookmark state
// (or show it to non-jobseekers) simply omit onToggleSave and the button won't render.
export default function JobCard({ job, isSaved = false, onToggleSave }) {
  const deadlineInfo = formatDeadline(job.deadline);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const handleBookmarkClick = (e) => {
    e.preventDefault(); // don't navigate to the job details page
    e.stopPropagation();
    onToggleSave?.(job._id);
  };

  const handleCompanyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCompanyModal(true);
  };

  return (
    <>
    <Link
      to={`/jobs/${job._id}`}
      className="group relative block bg-white rounded-2xl border border-ink-200 p-5 hover:border-brand-400 hover:shadow-lg hover:shadow-brand-500/5 transition-all"
    >
      {onToggleSave && (
        <button
          onClick={handleBookmarkClick}
          aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
          className="absolute top-4 right-4 text-ink-300 hover:text-brand-600 transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-600 text-brand-600' : ''}`} />
        </button>
      )}

      <div className="flex items-start justify-between gap-3 mb-3 pr-6">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-900 truncate group-hover:text-brand-700 transition-colors">
            {job.title}
          </h3>
          {job.postedBy?._id ? (
            <button
              onClick={handleCompanyClick}
              className="text-sm text-ink-500 hover:text-brand-600 hover:underline truncate block"
            >
              {job.companyName}
            </button>
          ) : (
            <p className="text-sm text-ink-500 truncate">{job.companyName}</p>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5" /> {job.category}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> {job.salary}
          </span>
        )}
      </div>

      {deadlineInfo && (
        <div className={`flex items-center gap-1 text-xs font-medium ${deadlineInfo.urgent ? 'text-amber-600' : 'text-ink-500'}`}>
          <Clock className="w-3.5 h-3.5" />
          {deadlineInfo.urgent ? deadlineInfo.text : `Apply by ${deadlineInfo.text}`}
        </div>
      )}
    </Link>

    {showCompanyModal && job.postedBy?._id && (
      <CompanyProfileModal employerId={job.postedBy._id} onClose={() => setShowCompanyModal(false)} />
    )}
    </>
  );
}
