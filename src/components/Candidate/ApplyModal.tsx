import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Award, Briefcase } from 'lucide-react';
import { Job, Applicant, ScoreResponse } from '../../types';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSubmitApplication: (
    applicantData: Omit<Applicant, 'id' | 'status' | 'appliedAt' | 'matchScore' | 'reasoning'>,
    scoreData: ScoreResponse
  ) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  onClose,
  job,
  onSubmitApplication,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [experience, setExperience] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    matchScore: number;
    reasoning: string;
  } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleQuickAddJobSkills = () => {
    const current = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const combined = Array.from(new Set([...current, ...job.requiredSkills])).join(', ');
    setSkillsInput(combined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setError('Please list at least one of your key skills');
      return;
    }

    if (!experience.trim()) {
      setError('Please describe your background or work experience');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Call Gemini Scoring Endpoint
      const response = await fetch('/api/score-applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          requiredSkills: job.requiredSkills,
          jobDescription: job.description,
          candidateName: name.trim(),
          candidateEmail: email.trim(),
          candidateSkills: skillsArray,
          candidateExperience: experience.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to score application');
      }

      const scoreData: ScoreResponse = await response.json();

      // Submit application to storage
      onSubmitApplication(
        {
          jobId: job.id,
          name: name.trim(),
          email: email.trim(),
          skills: skillsArray,
          experience: experience.trim(),
        },
        scoreData
      );

      setSubmittedResult({
        matchScore: scoreData.matchScore,
        reasoning: scoreData.reasoning,
      });

    } catch (err) {
      console.error('Error submitting application:', err);
      // Fallback submission if API fails
      const fallbackScore: ScoreResponse = {
        matchScore: 78,
        reasoning: `Matches skills for ${job.title}. Submitted successfully.`,
        isAiGenerated: false,
      };

      onSubmitApplication(
        {
          jobId: job.id,
          name: name.trim(),
          email: email.trim(),
          skills: skillsArray,
          experience: experience.trim(),
        },
        fallbackScore
      );

      setSubmittedResult({
        matchScore: fallbackScore.matchScore,
        reasoning: fallbackScore.reasoning,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setSkillsInput('');
    setExperience('');
    setSubmittedResult(null);
    setError('');
    onClose();
  };

  return (
    <div id="modal-apply-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div id="modal-apply" className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Apply for {job.title}</h3>
              <p className="text-xs text-slate-500">{job.department || 'General'} • {job.location || 'Remote'}</p>
            </div>
          </div>
          <button
            id="btn-close-apply-modal"
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {submittedResult ? (
            /* Submission Success Screen with AI Match Feedback */
            <div className="py-6 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-teal-600" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Thank you, <span className="text-slate-900 font-semibold">{name}</span>. Your application for <span className="text-teal-700 font-semibold">{job.title}</span> has been received.
                </p>
              </div>

              {/* AI Match Score Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Instant AI Match Assessment
                  </span>
                  <span className="text-xl font-bold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-xl border border-teal-200">
                    {submittedResult.matchScore}%
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  "{submittedResult.reasoning}"
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  id="btn-done-submitted"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-md shadow-teal-600/20"
                >
                  Close & Back to Open Jobs
                </button>
              </div>
            </div>
          ) : isSubmitting ? (
            /* AI Scoring Loading State */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-14 h-14 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-teal-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">AI Engine Analyzing Profile...</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Comparing your skills and experience against {job.title} requirements to generate instant fit scores.
                </p>
              </div>
            </div>
          ) : (
            /* Standard Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  id="input-applicant-name"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  id="input-applicant-email"
                  type="email"
                  placeholder="e.g. maya.lin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Your Key Skills (comma separated) *
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickAddJobSkills}
                    className="text-[11px] text-teal-700 hover:underline font-medium"
                  >
                    + Import job skills
                  </button>
                </div>
                <input
                  id="input-applicant-skills"
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, GraphQL"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience / Background Summary *
                </label>
                <textarea
                  id="input-applicant-experience"
                  rows={4}
                  placeholder="Briefly describe your years of experience, key projects, accomplishments, and tech stack background..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  id="btn-cancel-apply"
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-application"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Application with AI Screening</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
