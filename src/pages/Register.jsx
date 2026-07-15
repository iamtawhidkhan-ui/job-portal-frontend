import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Building2, Briefcase, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
    if (form.role === 'employer' && !form.companyName.trim()) {
      newErrors.companyName = 'Company name is required for employer accounts';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === 'employer' ? { companyName: form.companyName } : {}),
      };
      const res = await api.post('/auth/register', payload);
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
          <p className="text-ink-500 mt-1">Join CareerPath as a job seeker or employer</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8 space-y-5">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'jobseeker' })}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors ${
                  form.role === 'jobseeker' ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-ink-300'
                }`}
              >
                <User className={`w-5 h-5 ${form.role === 'jobseeker' ? 'text-brand-600' : 'text-ink-400'}`} />
                <span className={`text-sm font-medium ${form.role === 'jobseeker' ? 'text-brand-700' : 'text-ink-600'}`}>
                  Job Seeker
                </span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'employer' })}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors ${
                  form.role === 'employer' ? 'border-brand-600 bg-brand-50' : 'border-ink-200 hover:border-ink-300'
                }`}
              >
                <Briefcase className={`w-5 h-5 ${form.role === 'employer' ? 'text-brand-600' : 'text-ink-400'}`} />
                <span className={`text-sm font-medium ${form.role === 'employer' ? 'text-brand-700' : 'text-ink-600'}`}>
                  Employer
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.name ? 'border-red-400' : 'border-ink-200'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {form.role === 'employer' && (
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.companyName ? 'border-red-400' : 'border-ink-200'
                  }`}
                />
              </div>
              {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.email ? 'border-red-400' : 'border-ink-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.password ? 'border-red-400' : 'border-ink-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-ink-200'
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" /> {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
