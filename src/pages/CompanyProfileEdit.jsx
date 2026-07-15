import { useEffect, useState } from 'react';
import { Building2, ImagePlus, Save, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { fileBaseUrl } from '../api/axios';
import Spinner from '../components/Spinner';

export default function CompanyProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [form, setForm] = useState({
    history: '',
    operatingCountries: '',
    hqAddress: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, meRes] = await Promise.all([
          api.get('/companies/mine'),
          api.get('/users/profile'),
        ]);

        const profile = profileRes.data.profile;
        if (profile) {
          setForm({
            history: profile.history || '',
            operatingCountries: (profile.operatingCountries || []).join(', '),
            hqAddress: profile.hqAddress || '',
            contactEmail: profile.contactEmail || '',
            contactPhone: profile.contactPhone || '',
            website: profile.website || '',
          });
          if (profile.coverImage) setCoverPreview(`${fileBaseUrl}${profile.coverImage}`);
        }

        // Badges/stats come from the public endpoint, keyed by this employer's own ID
        const badgeRes = await api.get(`/companies/${meRes.data.user._id}`);
        setBadges(badgeRes.data.badges || []);
        setStats(badgeRes.data.stats || null);
      } catch (err) {
        toast.error('Could not load your company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('history', form.history);
      formData.append('hqAddress', form.hqAddress);
      formData.append('contactEmail', form.contactEmail);
      formData.append('contactPhone', form.contactPhone);
      formData.append('website', form.website);
      formData.append(
        'operatingCountries',
        JSON.stringify(form.operatingCountries.split(',').map((c) => c.trim()).filter(Boolean))
      );
      if (coverFile) formData.append('coverImage', coverFile);

      await api.post('/companies', formData);
      toast.success('Company profile saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900">Company Profile</h1>
      </div>
      <p className="text-ink-500 mb-6">
        Shown to jobseekers when they click your company name on a job listing.
      </p>

      {/* Badges preview (read-only, computed automatically) */}
      {badges.length > 0 && (
        <div className="bg-white border border-ink-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-1.5 text-sm font-medium text-ink-700 mb-3">
            <Award className="w-4 h-4 text-brand-600" /> Your Badges (earned automatically)
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((b) => (
              <span key={b.key} className="text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full">
                {b.label}
              </span>
            ))}
          </div>
          {stats && (
            <p className="text-xs text-ink-400">
              {stats.jobsPosted} jobs posted &middot; {stats.fillRate}% fill rate &middot; {stats.tenureMonths} months on CareerPath
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-ink-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Cover Image</label>
          <div className="relative h-32 rounded-xl bg-ink-100 overflow-hidden mb-2">
            {coverPreview && (
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 cursor-pointer w-fit">
            <ImagePlus className="w-4 h-4" /> {coverPreview ? 'Change image' : 'Upload cover image'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Company History / About</label>
          <textarea
            name="history"
            value={form.history}
            onChange={handleChange}
            rows={4}
            maxLength={2000}
            placeholder="Tell jobseekers about your company's story..."
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Operating Countries (comma separated)</label>
          <input
            name="operatingCountries"
            value={form.operatingCountries}
            onChange={handleChange}
            placeholder="Bangladesh, India, Singapore"
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">HQ Address</label>
          <input
            name="hqAddress"
            value={form.hqAddress}
            onChange={handleChange}
            placeholder="House 12, Road 5, Dhanmondi, Dhaka, Bangladesh"
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Contact Email</label>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Contact Phone</label>
            <input
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Website</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Company Profile'}
        </button>
      </form>
    </div>
  );
}
