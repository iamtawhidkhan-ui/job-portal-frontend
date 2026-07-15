import { FileText, Link2, Upload } from 'lucide-react';
import { fileBaseUrl } from '../api/axios';

const answerIcons = { link: Link2, file: Upload, text: FileText };

/**
 * Renders the list of custom answers (links/files/text) an applicant submitted
 * for a job's application requirements. Shared across the employer's per-job
 * and cross-job applicant views, and the jobseeker's own My Applications page.
 */
export default function ApplicationAnswers({ answers, label = 'Submitted with application:' }) {
  if (!answers || answers.length === 0) return null;

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-medium text-ink-500">{label}</p>}
      {answers.map((answer, i) => {
        const Icon = answerIcons[answer.type] || FileText;
        return (
          <div key={i} className="flex items-start gap-2 text-sm">
            <Icon className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-ink-500">{answer.label}: </span>
              {answer.type === 'link' && (
                <a href={answer.value} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline break-all">
                  {answer.value}
                </a>
              )}
              {answer.type === 'file' && (
                <a
                  href={`${fileBaseUrl}${answer.value}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  View / Download File
                </a>
              )}
              {answer.type === 'text' && <span className="text-ink-700">{answer.value}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
