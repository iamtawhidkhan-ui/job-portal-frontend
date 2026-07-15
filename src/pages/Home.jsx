import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Code2, Megaphone, LineChart, Palette,
  HeadphonesIcon, Wrench, ShieldCheck, Zap, Ban, Users2, Building2, CheckCircle2, Quote, X,
} from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import FadeIn from '../components/FadeIn';
import AuroraBackground from '../components/AuroraBackground';
import CountUpStat from '../components/CountUpStat';
import TestimonialCard from '../components/TestimonialCard';
import { useSavedJobs } from '../hooks/useSavedJobs';

const categories = [
  { name: 'Software Development', icon: Code2, count: '120+' },
  { name: 'Marketing', icon: Megaphone, count: '85+' },
  { name: 'Finance', icon: LineChart, count: '60+' },
  { name: 'Design', icon: Palette, count: '45+' },
  { name: 'Customer Support', icon: HeadphonesIcon, count: '70+' },
  { name: 'Engineering', icon: Wrench, count: '55+' },
];

const whyChooseUs = [
  { icon: Ban, title: '100% Free, Always', text: 'No hidden fees, no premium tiers, no ads. Every feature is free for job seekers and employers alike.' },
  { icon: ShieldCheck, title: 'Privacy First', text: 'Local-only authentication keeps your credentials on your device — we never store what we don\'t need to.' },
  { icon: Zap, title: 'Fast Applications', text: 'Apply to jobs in a single click once your profile is set up. No repetitive forms.' },
  { icon: CheckCircle2, title: 'Verified Listings', text: 'Every job post is tied to a real employer account, keeping listings accountable and current.' },
];

const stats = [
  { label: 'Active Job Listings', value: '400+', icon: Building2 },
  { label: 'Registered Companies', value: '150+', icon: Users2 },
  { label: 'Successful Placements', value: '1,200+', icon: CheckCircle2 },
];

export default function Home() {
  const { savedIds, toggleSave, isJobseeker } = useSavedJobs();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs?limit=6');
        setJobs(res.data.jobs || []);
        setError(null);
      } catch (err) {
        setError('Could not load the latest jobs right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        const res = await api.get('/testimonials?limit=6');
        // Map displayRole -> role so <TestimonialCard> doesn't need to know about the API shape
        setTestimonials((res.data.testimonials || []).map((t) => ({
          name: t.name,
          role: t.displayRole,
          quote: t.quote,
        })));
      } catch (err) {
        // Silent — the section just won't render if this fails, not critical enough for a toast
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.set('search', searchTitle);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ink-900 to-slate-800">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 text-center"
        >
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-white bg-brand-600 rounded-full px-3 py-1 mb-6">
            Free forever &middot; No ads &middot; No noise
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Find work that actually{' '}
            <span className="text-brand-400">fits your path</span>
          </h1>
          <p className="mt-5 text-lg text-ink-200 max-w-2xl mx-auto">
            CareerPath connects job seekers with real, verified employers — with none of the clutter
            you'll find on bigger platforms.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl"
          >
            <div className="flex items-center flex-1 px-3 gap-2">
              <Search className="w-4 h-4 text-ink-500 shrink-0" />
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Job title, e.g. Frontend Developer"
                className="w-full py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
              />
            </div>
            <div className="hidden sm:block w-px bg-ink-200" />
            <div className="flex items-center flex-1 px-3 gap-2">
              <MapPin className="w-4 h-4 text-ink-500 shrink-0" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Location"
                className="w-full py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shrink-0"
            >
              Search Jobs
            </button>
          </form>
        </motion.div>
      </section>

      {/* 2. Latest Job Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-900">Latest Job Listings</h2>
              <p className="text-ink-500 mt-1">Freshly posted opportunities from verified employers</p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="hidden sm:flex items-center gap-1 text-brand-600 font-medium hover:text-brand-700"
            >
              View all jobs <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeIn>

        {loading && <Spinner size="lg" />}

        {!loading && error && (
          <div className="text-center py-10 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-10 text-ink-500 bg-ink-50 rounded-2xl border border-ink-200">
            No jobs posted yet — check back soon.
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
              >
                <JobCard job={job} isSaved={savedIds.has(job._id)} onToggleSave={isJobseeker ? toggleSave : undefined} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Popular Job Categories */}
      <section className="bg-ink-50 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Popular Job Categories</h2>
            <p className="text-ink-500 mb-8">Browse jobs by the fields hiring the most right now</p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.name}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                  className="text-center sm:text-left flex flex-col items-center sm:items-start bg-white rounded-2xl border border-ink-200 p-5 hover:border-brand-400 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-ink-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-ink-500 mt-1">{cat.count} open roles</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-2 text-center">Why Choose CareerPath</h2>
          <p className="text-ink-500 mb-10 text-center max-w-xl mx-auto">
            Built to be simple, honest, and genuinely useful — for job seekers and employers alike.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Statistics + Testimonials */}
      <section className="bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-brand-400 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    <CountUpStat value={stat.value} />
                  </div>
                  <div className="text-sm text-ink-400 mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
              What people are saying
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {testimonialsLoading && (
              <div className="col-span-full flex justify-center py-6">
                <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            )}

            {!testimonialsLoading && testimonials.length === 0 && (
              <div className="col-span-full text-center py-6">
                <p className="text-ink-300 mb-4">No testimonials yet — be the first to share your experience!</p>
                <button
                  onClick={() => navigate('/dashboard/testimonial')}
                  className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                >
                  Share Your Experience
                </button>
              </div>
            )}

            {!testimonialsLoading && testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                testimonial={t}
                delay={i * 0.1}
                onSeeMore={setActiveTestimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {activeTestimonial && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
          onClick={() => setActiveTestimonial(null)}
        >
          <div
            className="bg-ink-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveTestimonial(null)}
              className="absolute top-4 right-4 text-ink-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center mb-4">
              <Quote className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-ink-200 text-base leading-relaxed mb-6">"{activeTestimonial.quote}"</p>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-white leading-tight">{activeTestimonial.name}</span>
              <span className="text-xs text-brand-400 leading-tight">{activeTestimonial.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
