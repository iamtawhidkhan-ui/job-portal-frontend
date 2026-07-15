import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareQuote, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

const MAX_LENGTH = 300;

export default function ShareTestimonial() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState({ quote: '', displayRole: '' });

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await api.get('/testimonials/mine');
        if (res.data.testimonial) {
          setExisting(res.data.testimonial);
          setForm({
            quote: res.data.testimonial.quote,
            displayRole: res.data.testimonial.displayRole,
          });
        } else {
          // Sensible default suggestion based on role, fully editable
          setForm((f) => ({
            ...f,
            displayRole: user?.role === 'employer' ? (user?.companyName || '') : '',
          }));
        }
      } catch (err) {
        toast.error('Could not load your testimonial');
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.quote.trim().length < 10) {
      toast.error('Please share a bit more detail (at least 10 characters)');
      return;
    }
    if (!form.displayRole.trim()) {
      toast.error('Please provide a role or title to display');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/testimonials', form);
      setExisting(res.data.testimonial);
      toast.success(existing ? 'Testimonial updated!' : 'Thank you for sharing your experience!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit your testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove your testimonial from the homepage?')) return;
    try {
      await api.delete('/testimonials/mine');
      setExisting(null);
      setForm({ quote: '', displayRole: '' });
      toast.success('Testimonial removed');
    } catch (err) {
      toast.error('Could not remove your testimonial');
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
          <MessageSquareQuote className="w-5 h-5 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900">Share Your Experience</h1>
      </div>
      <p className="text-ink-500 mb-8">
        {existing
          ? "You've already shared a testimonial — feel free to update it any time."
          : "Your feedback may be featured on the CareerPath homepage to help others."}
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">Your role or title</label>
          <input
            name="displayRole"
            value={form.displayRole}
            onChange={handleChange}
            placeholder={user?.role === 'employer' ? 'e.g. HR Manager, Acme Corp' : 'e.g. Frontend Developer'}
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-ink-400 mt-1">This is shown alongside your name on the testimonial.</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-ink-700">Your testimonial</label>
            <span className={`text-xs ${form.quote.length > MAX_LENGTH ? 'text-red-500' : 'text-ink-400'}`}>
              {form.quote.length}/{MAX_LENGTH}
            </span>
          </div>
          <textarea
            name="quote"
            value={form.quote}
            onChange={handleChange}
            rows={5}
            maxLength={MAX_LENGTH}
            placeholder="Share what your experience with CareerPath has been like..."
            className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Saving...' : existing ? 'Update Testimonial' : 'Submit Testimonial'}
          </button>
          {existing && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 border border-red-200 text-red-600 hover:border-red-400 font-medium px-4 py-3 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
