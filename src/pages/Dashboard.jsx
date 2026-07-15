import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil, Save, X, Briefcase, ClipboardList, Mail, User, Bookmark,
  TrendingUp, CalendarCheck, Trophy, Building2, Clock, MessageSquareQuote, Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { fileBaseUrl as photoBaseUrl } from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

// Fields that count toward a jobseeker's profile completeness meter
const jobseekerCompletenessFields = ['phone', 'bio', 'skills', 'resumeLink'];

function calculateCompleteness(profile) {
  if (!profile) return 0;
  let filled = 0;
  if (profile.phone) filled += 1;
  if (profile.bio) filled += 1;
  if (profile.skills?.length > 0) filled += 1;
  if (profile.resumeLink) filled += 1;
  return Math.round((filled / jobseekerCompletenessFields.length) * 100);
}

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [stats, setStats] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await api.get('/users/profile');
        setProfile(profileRes.data.user);
        setForm({
          name: profileRes.data.user.name || '',
          phone: profileRes.data.user.phone || '',
          bio: profileRes.data.user.bio || '',
          companyName: profileRes.data.user.companyName || '',
          resumeLink: profileRes.data.user.resumeLink || '',
          skills: (profileRes.data.user.skills || []).join(', '),
        });

        // Stats endpoint differs by role
        const statsUrl = profileRes.data.user.role === 'employer'
          ? '/applications/employer/stats'
          : '/applications/stats';
        const statsRes = await api.get(statsUrl);
        setStats(statsRes.data.stats);
      } catch (err) {
        toast.error('Could not load your dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await api.post('/users/photo', formData);
      setProfile(res.data.user);
      updateUser(res.data.user);
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        ...(profile.role === 'employer' ? { companyName: form.companyName } : {}),
        ...(profile.role === 'jobseeker'
          ? {
              resumeLink: form.resumeLink,
              skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : {}),
      };
      const res = await api.put('/users/profile', payload);
      setProfile(res.data.user);
      updateUser(res.data.user); // keep header/store in sync (e.g. name)
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update your profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const completeness = profile?.role === 'jobseeker' ? calculateCompleteness(profile) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">
        Welcome, {profile?.name?.split(' ')[0]}
      </h1>
      <p className="text-ink-500 mb-8 capitalize">{profile?.role} account</p>

      {/* Stats overview */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          {profile.role === 'jobseeker' ? (
            <>
              <StatCard icon={ClipboardList} label="Applications Sent" value={stats.total} />
              <StatCard icon={CalendarCheck} label="In Interview" value={stats.interview} accent />
              <StatCard icon={Trophy} label="Hired" value={stats.hired} accent />
            </>
          ) : (
            <>
              <StatCard icon={Briefcase} label="Active Jobs" value={stats.activeJobs} />
              <StatCard icon={TrendingUp} label="Total Applicants" value={stats.totalApplicants} />
              <StatCard icon={Clock} label="Pending Review" value={stats.pendingReview} accent />
            </>
          )}
        </div>
      )}

      {/* Profile completeness meter (jobseeker only) */}
      {completeness !== null && completeness < 100 && (
        <div className="bg-white border border-ink-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-ink-900">Profile Completeness</p>
            <span className="text-sm font-semibold text-brand-600">{completeness}%</span>
          </div>
          <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-xs text-ink-500 mt-2">
            Add a phone number, bio, skills, and resume link to improve your chances with employers.
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {profile?.role === 'employer' ? (
          <Link
            to="/dashboard/my-jobs"
            className="flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900 text-sm">Manage Job Posts</h3>
              <p className="text-xs text-ink-500">Create, edit, and remove your listings</p>
            </div>
          </Link>
        ) : (
          <Link
            to="/dashboard/applications"
            className="flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900 text-sm">My Applications</h3>
              <p className="text-xs text-ink-500">Track the jobs you've applied to</p>
            </div>
          </Link>
        )}
        {profile?.role === 'jobseeker' ? (
          <Link
            to="/dashboard/saved-jobs"
            className="flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900 text-sm">Saved Jobs</h3>
              <p className="text-xs text-ink-500">Jobs you've bookmarked for later</p>
            </div>
          </Link>
        ) : (
          <Link
            to="/dashboard/company-profile"
            className="flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900 text-sm">Company Profile</h3>
              <p className="text-xs text-ink-500">Edit what jobseekers see about you</p>
            </div>
          </Link>
        )}
        <Link
          to="/dashboard/testimonial"
          className="flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-5 hover:border-brand-400 hover:shadow-md transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
            <MessageSquareQuote className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900 text-sm">Share Your Experience</h3>
            <p className="text-xs text-ink-500">Your feedback may feature on our homepage</p>
          </div>
        </Link>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-ink-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink-100">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center overflow-hidden shrink-0">
            {profile?.profilePhoto ? (
              <img
                src={`${photoBaseUrl}${profile.profilePhoto}`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-brand-600">
                {profile?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 cursor-pointer w-fit">
              <Camera className="w-4 h-4" /> {photoUploading ? 'Uploading...' : 'Change photo'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={photoUploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-ink-400 mt-1">JPG, PNG, or WEBP, up to 3MB</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-ink-900 text-lg">Profile Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-ink-700">
              <Mail className="w-4 h-4 text-ink-400" /> {profile.email}
            </div>
            <div>
              <span className="text-ink-500">Phone: </span>
              <span className="text-ink-900">{profile.phone || 'Not set'}</span>
            </div>
            <div>
              <span className="text-ink-500">Bio: </span>
              <span className="text-ink-900">{profile.bio || 'Not set'}</span>
            </div>
            {profile.role === 'employer' && (
              <div>
                <span className="text-ink-500">Company: </span>
                <span className="text-ink-900">{profile.companyName || 'Not set'}</span>
              </div>
            )}
            {profile.role === 'jobseeker' && (
              <>
                <div>
                  <span className="text-ink-500">Skills: </span>
                  <span className="text-ink-900">
                    {profile.skills?.length ? profile.skills.join(', ') : 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-ink-500">Resume Link: </span>
                  {profile.resumeLink ? (
                    <a href={profile.resumeLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                      {profile.resumeLink}
                    </a>
                  ) : (
                    <span className="text-ink-900">Not set</span>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            {profile.role === 'employer' && (
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">Company Name</label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            {profile.role === 'jobseeker' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-ink-500 mb-1.5">Skills (comma separated)</label>
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-500 mb-1.5">Resume Link</label>
                  <input
                    name="resumeLink"
                    value={form.resumeLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 border border-ink-200 text-ink-700 font-medium px-5 py-2.5 rounded-lg text-sm hover:border-ink-300 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-3 sm:p-5 flex flex-col items-center text-center">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${accent ? 'bg-brand-600' : 'bg-brand-50'}`}>
        <Icon className={`w-4 h-4 ${accent ? 'text-white' : 'text-brand-600'}`} />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-ink-900">{value ?? 0}</p>
      <p className="text-xs text-ink-500 mt-0.5">{label}</p>
    </div>
  );
}
