import { X, Mail, Phone, FileText, ExternalLink } from 'lucide-react';
import { fileBaseUrl } from '../api/axios';

export default function ApplicantProfileModal({ applicant, onClose }) {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-400 hover:text-ink-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center overflow-hidden shrink-0">
            {applicant.profilePhoto ? (
              <img
                src={`${fileBaseUrl}${applicant.profilePhoto}`}
                alt={applicant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-brand-600">
                {applicant.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink-900">{applicant.name}</h2>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-5">
          {applicant.email && (
            <div className="flex items-center gap-2 text-ink-700">
              <Mail className="w-4 h-4 text-brand-600 shrink-0" /> {applicant.email}
            </div>
          )}
          {applicant.phone && (
            <div className="flex items-center gap-2 text-ink-700">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" /> {applicant.phone}
            </div>
          )}
        </div>

        {applicant.bio && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5">Bio</h3>
            <p className="text-sm text-ink-700 leading-relaxed">{applicant.bio}</p>
          </div>
        )}

        {applicant.skills?.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {applicant.skills.map((skill, i) => (
                <span key={i} className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {applicant.resumeLink && (
          <a
            href={applicant.resumeLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            <FileText className="w-4 h-4" /> View Resume <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
