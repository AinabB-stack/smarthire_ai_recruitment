import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Send, Mail, Edit3 } from 'lucide-react';
import { Applicant, CandidateStatus } from '../../types';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Applicant | null;
  jobTitle: string;
  subject: string;
  body: string;
  isAiGenerated?: boolean;
  isLoading?: boolean;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  applicant,
  jobTitle,
  subject: initialSubject,
  body: initialBody,
  isAiGenerated = true,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [editableSubject, setEditableSubject] = useState(initialSubject);
  const [editableBody, setEditableBody] = useState(initialBody);

  // Sync state if props change
  React.useEffect(() => {
    setEditableSubject(initialSubject);
    setEditableBody(initialBody);
  }, [initialSubject, initialBody]);

  if (!isOpen || !applicant) return null;

  const handleCopy = () => {
    const fullText = `Subject: ${editableSubject}\n\n${editableBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'Shortlisted for Interview':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Selected':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'Rejected':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <div id="modal-message-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div id="modal-message" className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Draft Candidate Communication</h3>
                {isAiGenerated && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Gemini AI Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Personalized response for {applicant.name} ({jobTitle})</p>
            </div>
          </div>
          <button
            id="btn-close-message-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Candidate Context Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{applicant.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-800">Drafting personalized communication with Gemini AI...</p>
              <p className="text-xs text-slate-500">Adapting tone based on evaluation score ({applicant.matchScore}%) and decision status.</p>
            </div>
          ) : (
            <>
              {/* Subject Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Subject Line</span>
                  <span className="text-[10px] text-slate-400 font-normal">Editable</span>
                </label>
                <input
                  type="text"
                  value={editableSubject}
                  onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-medium"
                />
              </div>

              {/* Message Body Input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Message Text</span>
                  <span className="text-[10px] text-slate-400 font-normal">Editable</span>
                </label>
                <textarea
                  rows={8}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white resize-none font-sans leading-relaxed"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            You can copy or adjust this draft before sending to your ATS or email client.
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              id="btn-close-message-draft"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            <button
              id="btn-copy-generated-message"
              onClick={handleCopy}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
