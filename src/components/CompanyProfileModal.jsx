import { useEffect, useState } from 'react';
import { X, Award, Globe2, MapPinned, Mail, Phone, Link2, Building2 } from 'lucide-react';
import api, { fileBaseUrl } from '../api/axios';
import Spinner from './Spinner';

export default function CompanyProfileModal({ employerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/companies/${employerId}`);
        setData(res.data);
        setError(null);
      } catch (err) {
        setError('Could not load this company\'s profile right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [employerId]);

  const profile = data?.profile;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="p-10">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && error && (
          <div className="p-10 text-center text-ink-500">{error}</div>
        )}

        {!loading && !error && data && (
          <>
            {/* Cover / hero banner */}
            <div
              className="relative h-40 sm:h-52 rounded-t-2xl bg-gradient-to-br from-ink-900 to-brand-800 bg-cover bg-center"
              style={profile?.coverImage ? { backgroundImage: `url(${fileBaseUrl}${profile.coverImage})` } : {}}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white drop-shadow">{data.companyName}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Badges */}
              {data.badges?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.badges.map((b) => (
                    <span
                      key={b.key}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full"
                    >
                      <Award className="w-3.5 h-3.5" /> {b.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-ink-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-ink-900">{data.stats.jobsPosted}</p>
                  <p className="text-xs text-ink-500">Jobs Posted</p>
                </div>
                <div className="bg-ink-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-ink-900">{data.stats.fillRate}%</p>
                  <p className="text-xs text-ink-500">Fill Rate</p>
                </div>
                <div className="bg-ink-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-ink-900">{data.stats.tenureMonths}mo</p>
                  <p className="text-xs text-ink-500">On CareerPath</p>
                </div>
              </div>

              {profile?.history ? (
                <div className="mb-6">
                  <h3 className="font-semibold text-ink-900 mb-2">About</h3>
                  <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">{profile.history}</p>
                </div>
              ) : (
                <p className="text-sm text-ink-400 italic mb-6">
                  This employer hasn't added company details yet.
                </p>
              )}

              {profile && (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {profile.operatingCountries?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Globe2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-ink-700">{profile.operatingCountries.join(', ')}</span>
                    </div>
                  )}
                  {profile.hqAddress && (
                    <div className="flex items-start gap-2">
                      <MapPinned className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-ink-700">{profile.hqAddress}</span>
                    </div>
                  )}
                  {profile.contactEmail && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-ink-700 break-all">{profile.contactEmail}</span>
                    </div>
                  )}
                  {profile.contactPhone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <span className="text-ink-700">{profile.contactPhone}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-start gap-2">
                      <Link2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline break-all"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
