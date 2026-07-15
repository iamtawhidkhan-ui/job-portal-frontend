import { useState } from 'react';
import { X, Upload, Link2, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const typeIcons = { link: Link2, file: Upload, text: FileText };

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [values, setValues] = useState({}); // label -> string value or File object
  const [submitting, setSubmitting] = useState(false);

  const handleTextChange = (label, value) => {
    setValues({ ...values, [label]: value });
  };

  const handleFileChange = (label, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }
    setValues({ ...values, [label]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = job.applicationRequirements.filter((req) => {
      if (!req.required) return false;
      const val = values[req.label];
      return !val || (typeof val === 'string' && !val.trim());
    });

    if (missing.length > 0) {
      toast.error(`Please provide: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      const nonFileAnswers = [];

      job.applicationRequirements.forEach((req) => {
        const val = values[req.label];
        if (!val) return;

        if (req.type === 'file') {
          formData.append(req.label, val); // File object, keyed by requirement label
        } else {
          nonFileAnswers.push({ label: req.label, type: req.type, value: val });
        }
      });

      formData.append('answers', JSON.stringify(nonFileAnswers));

      await api.post(`/applications/${job._id}`, formData);
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You have already applied to this job');
        onClose();
      } else {
        toast.error(err.response?.data?.message || 'Could not submit your application');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-ink-900">Complete Your Application</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-ink-500 mb-6">
          {job.companyName} has asked for a few extra details for <strong>{job.title}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {job.applicationRequirements.map((req) => {
            const Icon = typeIcons[req.type];
            return (
              <div key={req.label}>
                <label className="flex items-center gap-1.5 text-sm font-medium text-ink-700 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-brand-600" />
                  {req.label} {req.required && <span className="text-red-500">*</span>}
                </label>

                {req.type === 'link' && (
                  <input
                    type="url"
                    value={values[req.label] || ''}
                    onChange={(e) => handleTextChange(req.label, e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                )}

                {req.type === 'text' && (
                  <textarea
                    value={values[req.label] || ''}
                    onChange={(e) => handleTextChange(req.label, e.target.value)}
                    rows={3}
                    className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                )}

                {req.type === 'file' && (
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(req.label, e.target.files[0])}
                      className="w-full text-sm text-ink-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    <p className="text-xs text-ink-400 mt-1">PDF, DOC, or DOCX, up to 5MB</p>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
