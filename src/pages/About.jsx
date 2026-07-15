import { Target, Heart, Users, Rocket } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AuroraBackground from '../components/AuroraBackground';

const values = [
  { icon: Heart, title: 'People First', text: 'Every decision we make starts with what genuinely helps job seekers and employers, not what generates revenue.' },
  { icon: Target, title: 'Radical Simplicity', text: 'No dark patterns, no unnecessary steps. Post a job or apply for one in minutes.' },
  { icon: Users, title: 'Real Community', text: 'Every account belongs to a real person or company — no bots, no fake listings.' },
  { icon: Rocket, title: 'Built to Grow', text: "We're constantly improving based on feedback from the people who use CareerPath every day." },
];

export default function About() {
  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-ink-900">
        <AuroraBackground />
        <FadeIn className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">About CareerPath</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            We built CareerPath because job hunting shouldn't feel like navigating a maze of ads,
            paywalls, and outdated listings.
          </p>
        </FadeIn>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-ink-900 mb-4">Our Story</h2>
        <div className="space-y-4 text-ink-700 leading-relaxed">
          <p>
            CareerPath started as a simple idea: what if finding a job — or the right candidate —
            didn't require wading through clutter? Most job boards are built around ad revenue first
            and user experience second. We flipped that priority.
          </p>
          <p>
            Today, CareerPath connects job seekers directly with verified employers. Every job post
            comes from a real company account, every application goes straight to the people
            reviewing it, and every feature — from search to your dashboard — is free, with no catch.
          </p>
          <p>
            Whether you're hiring for your first role or searching for your next one, CareerPath is
            built to make that process faster, clearer, and a little less stressful.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink-50 border-y border-ink-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-ink-900 mb-10 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl border border-ink-200 p-6">
                  <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-ink-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
