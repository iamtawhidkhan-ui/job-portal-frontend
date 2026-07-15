import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import FadeIn from '../components/FadeIn';
import AuroraBackground from '../components/AuroraBackground';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    // No dedicated backend endpoint for contact messages in this project scope —
    // this simulates submission. Wire this to a real /api/contact route if needed later.
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 700);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900">
        <AuroraBackground />
        <FadeIn className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-white/90 text-lg">
            Questions, feedback, or partnership ideas — we'd love to hear from you.
          </p>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-900 text-sm">Email</h3>
                <p className="text-sm text-ink-500">support@careerpath.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-900 text-sm">Phone</h3>
                <p className="text-sm text-ink-500">+880 1234-567890</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-900 text-sm">Office</h3>
                <p className="text-sm text-ink-500">House 12, Road 5, Dhanmondi, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-2xl border border-ink-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="How can we help?"
                className="w-full px-4 py-2.5 rounded-lg border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
