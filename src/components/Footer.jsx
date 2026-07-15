import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const socialLinks = [
  { label: 'Facebook', short: 'f' },
  { label: 'X (Twitter)', short: 'X' },
  { label: 'LinkedIn', short: 'in' },
  { label: 'Instagram', short: 'IG' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Career<span className="text-brand-500">Path</span>
              </span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">
              Connecting talented professionals with the companies building tomorrow.
              Free to use, built for everyone.
            </p>
          </div>

          {/* Quick Links / Contact / Follow Us — one horizontal row with gaps even on
              mobile (via this nested 3-col grid), collapsing back into the parent's
              4-col grid at md+ via `md:contents` */}
          <div className="grid grid-cols-3 gap-4 md:contents">
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm sm:text-base sm:mb-4">Quick Links</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link to="/" className="hover:text-brand-500 transition-colors">Home</Link></li>
                <li><Link to="/jobs" className="hover:text-brand-500 transition-colors">Browse Jobs</Link></li>
                <li><Link to="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm sm:text-base sm:mb-4">Contact</h3>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 text-brand-500" />
                  <span className="break-all">support@careerpath.com</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 text-brand-500" />
                  <span>+880 1234-567890</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 text-brand-500" />
                  <span>House 12, Road 5, Dhanmondi, Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm sm:text-base sm:mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    title={social.label}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-ink-700/40 flex items-center justify-center text-xs font-semibold hover:bg-brand-600 transition-colors"
                  >
                    {social.short}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-700/50 mt-10 pt-6 text-center text-sm text-ink-500">
          © {year} CareerPath. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
