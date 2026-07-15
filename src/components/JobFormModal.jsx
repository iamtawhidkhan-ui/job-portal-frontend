import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const typeOptions = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const categoryOptions = ['Software Development', 'Marketing', 'Finance', 'Design', 'Customer Support', 'Engineering'];

// Common presets to speed up building the requirements list — employers can still add custom ones
const requirementPresets = [
  { label: 'Portfolio Link', type: 'link' },
  { label: 'LinkedIn Profile', type: 'link' },
  { label: 'GitHub Profile', type: 'link' },
  { label: 'Updated CV / Resume', type: 'file' },
  { label: 'Cover Letter', type: 'text' },
  { label: 'Custom...', type: 'text' },
];

// Formats a date (or ISO string) into yyyy-mm-dd for an <input type="date">
function toDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export default function JobFormModal({ job, onClose, onSuccess }) {
  const isEdit = Boolean(job);
  const [form, setForm] = useState({
    title: job?.title || '',
    companyName: job?.companyName || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    category: job?.category || categoryOptions[0],
    salary: job?.salary || '',
    description: job?.description || '',
    requirements: job?.requirements?.join('\n') || '',
    deadline: toDateInputValue(job?.deadline),
  });
  const [appRequirements, setAppRequirements] = useState(job?.applicationRequirements || []);
  const [submitting, setSubmitting] = useState(false);

  const addRequirement = () => {
    setAppRequirements([...appRequirements, { label: 'Portfolio Link', type: 'link', required: true }]);
  };

  const updateRequirement = (index, field, value) => {
    const next = [...appRequirements];
    next[index] = { ...next[index], [field]: value };
    setAppRequirements(next);
  };

  const applyPreset = (index, presetLabel) => {
    const preset = requirementPresets.find((p) => p.label === presetLabel);
    if (!preset) return;
    const next = [...appRequirements];
    next[index] = {
      ...next[index],
      label: preset.label === 'Custom...' ? '' : preset.label,
      type: preset.type,
    };
    setAppRequirements(next);
  };

  const removeRequirement = (index) => {
    setAppRequirements(appRequirements.filter((_, i) => i !== index));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.companyName || !form.location || !form.category || !form.description || !form.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const incompleteRequirement = appRequirements.find((r) => !r.label.trim());
    if (incompleteRequirement) {
      toast.error('Please give every application requirement a label, or remove the empty one');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        applicationRequirements: appRequirements,
      };

      if (isEdit) {
        await api.put(`/jobs/${job._id}`, payload);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ink-900">{isEdit ? 'Edit Job Post' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Job Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Company Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Salary (optional)</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 50,000 - 70,000 BDT"
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Job Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">
              Requirements (one per line)
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={3}
              placeholder={'2+ years React experience\nTailwind CSS knowledge'}
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Application Requirements builder */}
          <div className="border-t border-ink-200 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-ink-900">
                What should applicants submit?
              </label>
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add item
              </button>
            </div>
            <p className="text-xs text-ink-500 mb-3">
              Optional. Leave empty and applicants can apply with a single click. Add items like a
              portfolio link or CV upload if you need more from candidates.
            </p>

            {appRequirements.length === 0 && (
              <p className="text-xs text-ink-400 italic bg-ink-50 rounded-lg px-3 py-2">
                No extra requirements — applicants will apply instantly.
              </p>
            )}

            <div className="space-y-3">
              {appRequirements.map((req, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-ink-50 rounded-lg p-3">
                  <select
                    value={requirementPresets.find((p) => p.label === req.label)?.label || 'Custom...'}
                    onChange={(e) => applyPreset(index, e.target.value)}
                    className="w-full sm:w-44 shrink-0 border border-ink-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {requirementPresets.map((p) => (
                      <option key={p.label} value={p.label}>{p.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={req.label}
                    onChange={(e) => updateRequirement(index, 'label', e.target.value)}
                    placeholder="Label shown to applicant"
                    className="flex-1 w-full border border-ink-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <select
                    value={req.type}
                    onChange={(e) => updateRequirement(index, 'type', e.target.value)}
                    className="w-full sm:w-28 shrink-0 border border-ink-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="link">Link</option>
                    <option value="file">File</option>
                    <option value="text">Text</option>
                  </select>

                  <label className="flex items-center gap-1.5 text-xs text-ink-600 shrink-0 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={req.required}
                      onChange={(e) => updateRequirement(index, 'required', e.target.checked)}
                      className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-ink-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-ink-200 text-ink-700 font-medium px-5 py-2.5 rounded-lg text-sm hover:border-ink-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
