import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  Send,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Job, Applicant, ScoreResponse } from '../../types';
import { ApplyModal } from './ApplyModal';

interface CandidateViewProps {
  jobs: Job[];
  applicants: Applicant[];
  onSubmitApplication: (
    applicantData: Omit<Applicant, 'id' | 'status' | 'appliedAt' | 'matchScore' | 'reasoning'>,
    scoreData: ScoreResponse
  ) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const CandidateView: React.FC<CandidateViewProps> = ({
  jobs,
  applicants,
  onSubmitApplication,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Filter jobs based on search
  const filteredJobs = jobs.filter(j => {
    const term = searchTerm.toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      (j.department && j.department.toLowerCase().includes(term)) ||
      (j.location && j.location.toLowerCase().includes(term)) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(term)) ||
      j.description.toLowerCase().includes(term)
    );
  });

  const handleOpenApply = (job: Job) => {
    setSelectedJobForApply(job);
    setApplyModalOpen(true);
  };

  const handleSubmittedSuccess = (
    applicantData: Omit<Applicant, 'id' | 'status' | 'appliedAt' | 'matchScore' | 'reasoning'>,
    scoreData: ScoreResponse
  ) => {
    onSubmitApplication(applicantData, scoreData);
    onShowToast(
      'Application Submitted!',
      `AI match score: ${scoreData.matchScore}%`,
      'success'
    );
  };

  return (
    <div id="candidate-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md text-white">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>AI-Accelerated Job Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Open Positions & Apply Instantly
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Submit your background to receive an instant AI match evaluation. Recruiters review AI-ranked profiles to shortlist candidates faster.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Search Bar & Quick Filter Tags */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-open-jobs"
            type="text"
            placeholder="Search open positions by job title, skill (e.g. React, Gemini API), department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1E293B] border border-slate-700/80 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 shadow-md transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm font-bold bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Search Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">Popular Filters:</span>
          {['React', 'Python', 'TypeScript', 'Remote', 'Engineering', 'Full Stack', 'Gemini API'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(searchTerm === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition-all shrink-0 ${
                searchTerm.toLowerCase() === tag.toLowerCase()
                  ? 'bg-teal-400 text-slate-950 border-teal-300 font-bold shadow-xs'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-teal-700 font-bold hover:underline shrink-0 ml-1"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Jobs List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
          <span>Available Job Openings ({filteredJobs.length} of {jobs.length})</span>
          <span>Instant AI Screening Enabled</span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-[#1E293B] border border-slate-700/80 rounded-2xl space-y-3 text-white shadow-md">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No matching jobs found</h3>
            <p className="text-xs text-slate-300">Try searching for different keywords or clear your search query.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs font-bold text-teal-400 hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.id;
              const appliedCount = applicants.filter(a => a.jobId === job.id).length;

              return (
                <div
                  key={job.id}
                  id={`open-job-card-${job.id}`}
                  className="bg-[#1E293B] border border-slate-700/80 hover:border-slate-500 rounded-2xl p-6 shadow-md transition-all space-y-4 text-white"
                >
                  {/* Job Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white hover:text-teal-300 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.department || 'General'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location || 'Remote'}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      id={`btn-apply-job-${job.id}`}
                      onClick={() => handleOpenApply(job)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Now</span>
                    </button>
                  </div>

                  {/* Required Skills Chips - LIGHT BACKGROUND WITH DARK TEXT */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-teal-100 text-teal-950 border border-teal-300 font-bold font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description Preview & Expand */}
                  <div className="pt-2 border-t border-slate-700/80">
                    <p className={`text-xs text-slate-200 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {job.description}
                    </p>

                    <button
                      id={`btn-toggle-job-desc-${job.id}`}
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="mt-2 text-xs text-teal-300 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Read Full Description'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        job={selectedJobForApply}
        onSubmitApplication={handleSubmittedSuccess}
      />

    </div>
  );
};
