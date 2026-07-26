import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Trash2,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Filter,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { Job, Applicant, CandidateStatus } from '../../types';
import { MessageModal } from './MessageModal';

interface RecruiterViewProps {
  jobs: Job[];
  applicants: Applicant[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onOpenPostJobModal: () => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateStatus: (applicantId: string, status: CandidateStatus) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  jobs,
  applicants,
  selectedJobId,
  onSelectJob,
  onOpenPostJobModal,
  onDeleteJob,
  onUpdateStatus,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedApplicantId, setExpandedApplicantId] = useState<string | null>(null);

  // Message Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessageApplicant, setActiveMessageApplicant] = useState<Applicant | null>(null);
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  // Currently active job
  const activeJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  // Handle selecting job card
  const handleSelectJobCard = (jobId: string) => {
    onSelectJob(jobId);
    setStatusFilter('ALL');
    setSearchTerm('');
  };

  // Applicants for currently active job, sorted by match score (highest first)
  const jobApplicants = useMemo(() => {
    if (!activeJob) return [];
    return applicants
      .filter(a => a.jobId === activeJob.id)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [applicants, activeJob]);

  // Counts for filter tabs
  const statusCounts = useMemo(() => {
    return {
      ALL: jobApplicants.length,
      Applied: jobApplicants.filter(a => a.status === 'Applied').length,
      'Shortlisted for Interview': jobApplicants.filter(a => a.status === 'Shortlisted for Interview').length,
      Selected: jobApplicants.filter(a => a.status === 'Selected').length,
      Rejected: jobApplicants.filter(a => a.status === 'Rejected').length,
    };
  }, [jobApplicants]);

  // Filtered applicants by search and status
  const filteredApplicants = useMemo(() => {
    return jobApplicants.filter(app => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        app.name.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.skills.some(s => s.toLowerCase().includes(term)) ||
        (app.experience && app.experience.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === 'ALL' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobApplicants, searchTerm, statusFilter]);

  // Summary statistics for active job
  const stats = useMemo(() => {
    if (jobApplicants.length === 0) {
      return { total: 0, avgScore: 0, shortlisted: 0, selected: 0, rejected: 0 };
    }
    const sum = jobApplicants.reduce((acc, curr) => acc + curr.matchScore, 0);
    const avgScore = Math.round(sum / jobApplicants.length);
    const shortlisted = jobApplicants.filter(a => a.status === 'Shortlisted for Interview').length;
    const selected = jobApplicants.filter(a => a.status === 'Selected').length;
    const rejected = jobApplicants.filter(a => a.status === 'Rejected').length;

    return { total: jobApplicants.length, avgScore, shortlisted, selected, rejected };
  }, [jobApplicants]);

  // Handle Generate Message call to API
  const handleGenerateMessage = async (applicant: Applicant) => {
    if (!activeJob) return;
    setActiveMessageApplicant(applicant);
    setMessageModalOpen(true);
    setIsGeneratingMessage(true);
    setGeneratedSubject('');
    setGeneratedBody('');

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: applicant.name,
          jobTitle: activeJob.title,
          status: applicant.status,
          matchScore: applicant.matchScore,
          reasoning: applicant.reasoning,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error generating message');
      }

      const data = await response.json();
      setGeneratedSubject(data.subject);
      setGeneratedBody(data.body);
    } catch (err) {
      console.error('Error generating message:', err);
      onShowToast('Notice', 'Used smart message template due to network error', 'info');
      
      // Fallback
      setGeneratedSubject(`Regarding your application for ${activeJob.title}`);
      setGeneratedBody(
        `Dear ${applicant.name},\n\nThank you for applying for the ${activeJob.title} position. Your application details have been reviewed (${applicant.matchScore}% match).\n\nBest regards,\nThe SmartHire Talent Team`
      );
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 85) return 'bg-teal-500/20 text-teal-300 border-teal-500/40 ring-teal-500/20';
    if (score >= 65) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ring-cyan-500/20';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-amber-500/20';
  };

  const getStatusBadgeStyle = (status: CandidateStatus) => {
    switch (status) {
      case 'Shortlisted for Interview':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700/80 text-slate-200 border-slate-600';
    }
  };

  return (
    <div id="recruiter-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner & Job Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-teal-600" />
            Recruiter Screening Hub
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review AI-ranked applicants, update decision statuses, and draft personalized communications.
          </p>
        </div>

        <button
          id="btn-post-new-job"
          onClick={onOpenPostJobModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md shadow-teal-600/20 transition-all shrink-0 text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Main Grid: Jobs Sidebar & Applicants Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job Openings List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" />
              Posted Job Openings ({jobs.length})
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center bg-[#1E293B] border border-slate-700/80 rounded-2xl shadow-md text-white">
              <p className="text-sm text-slate-300 mb-3">No jobs posted yet.</p>
              <button
                onClick={onOpenPostJobModal}
                className="text-xs font-semibold text-teal-400 hover:underline"
              >
                + Post your first job opening
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const isSelected = activeJob?.id === job.id;
                const count = applicants.filter(a => a.jobId === job.id).length;

                return (
                  <div
                    key={job.id}
                    id={`job-card-${job.id}`}
                    onClick={() => handleSelectJobCard(job.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group bg-[#1E293B] ${
                      isSelected
                        ? 'border-teal-400 ring-2 ring-teal-400/30 shadow-xl'
                        : 'border-slate-700/80 hover:border-slate-500 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-bold text-sm transition-colors ${isSelected ? 'text-teal-300' : 'text-white group-hover:text-teal-300'}`}>
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {job.department || 'General'} • {job.location || 'Remote'}
                        </p>
                      </div>

                      {/* Delete Job button */}
                      <button
                        id={`btn-delete-job-${job.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (window.confirm(`Are you sure you want to delete "${job.title}" and all its applicants?`)) {
                            onDeleteJob(job.id);
                          }
                        }}
                        title="Delete job permanently"
                        className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/20 transition-all shrink-0 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Skills snippet - LIGHT BACKGROUND WITH DARK TEXT */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 text-teal-950 font-bold border border-teal-300">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{job.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer count */}
                    <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-teal-400" />
                        {count} {count === 1 ? 'Applicant' : 'Applicants'}
                      </span>
                      <button
                        id={`btn-chevron-job-${job.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectJobCard(job.id);
                        }}
                        title="View applicant details for this job"
                        className="p-1 rounded-lg text-slate-400 hover:text-teal-300 transition-colors focus:outline-none flex items-center justify-center"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-teal-400 translate-x-1' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Candidates / Applicants for Selected Job */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeJob ? (
            <>
              {/* Active Job Header Card - DARK BACKGROUND */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 shadow-md text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/80">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 uppercase tracking-wider">
                      Active Job Screening
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-2">{activeJob.title}</h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {activeJob.department} • {activeJob.location} • Posted {new Date(activeJob.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#0F172A] p-2 rounded-xl border border-slate-700/80 text-xs">
                    <div className="px-3 py-1 text-center">
                      <div className="text-lg font-bold text-teal-400">{stats.total}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Applicants</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700/80"></div>
                    <div className="px-3 py-1 text-center">
                      <div className="text-lg font-bold text-cyan-400">{stats.avgScore}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Avg Match</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700/80"></div>
                    <div className="px-3 py-1 text-center">
                      <div className="text-lg font-bold text-emerald-400">{stats.shortlisted + stats.selected}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Advancing</div>
                    </div>
                  </div>
                </div>

                {/* Job Description & Required Skills */}
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed">{activeJob.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-medium text-slate-400 mr-1">Required Skills:</span>
                    {activeJob.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-teal-100 text-teal-950 border border-teal-300 font-bold font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtering & Sorting Toolbar - DARK NAVY CONTAINER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E293B] p-3 rounded-2xl border border-slate-700/80 shadow-md">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-search-applicants"
                    type="text"
                    placeholder="Search applicants by name, email, skill, or background..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { label: 'All Applicants', key: 'ALL', count: statusCounts.ALL },
                    { label: 'Applied', key: 'Applied', count: statusCounts.Applied },
                    { label: 'Shortlisted for Interview', key: 'Shortlisted for Interview', count: statusCounts['Shortlisted for Interview'] },
                    { label: 'Selected', key: 'Selected', count: statusCounts.Selected },
                    { label: 'Rejected', key: 'Rejected', count: statusCounts.Rejected },
                  ].map((st) => {
                    const isActive = statusFilter === st.key;
                    return (
                      <button
                        key={st.key}
                        id={`filter-status-${st.key.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setStatusFilter(st.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-teal-400 text-slate-950 shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>{st.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {st.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applicant Cards List (Sorted by Match Score) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Candidates sorted by AI match score (highest first)
                  </span>
                  <span className="text-slate-600">Showing {filteredApplicants.length} of {jobApplicants.length}</span>
                </div>

                {filteredApplicants.length === 0 ? (
                  <div className="p-12 text-center bg-[#1E293B] border border-slate-700/80 rounded-2xl space-y-3 text-white">
                    <Users className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="text-sm font-semibold text-white">No applicants found</h4>
                    <p className="text-xs text-slate-300">
                      {jobApplicants.length === 0
                        ? 'No applications submitted for this role yet. Switch to Candidate Portal to test applying!'
                        : `No applicants match the current status filter ("${statusFilter}") or search criteria.`}
                    </p>
                    {statusFilter !== 'ALL' && (
                      <button
                        onClick={() => { setStatusFilter('ALL'); setSearchTerm(''); }}
                        className="mt-2 text-xs font-semibold text-teal-400 hover:underline"
                      >
                        Show All Applicants ({jobApplicants.length})
                      </button>
                    )}
                  </div>
                ) : (
                  filteredApplicants.map((app) => {
                    const isExpanded = expandedApplicantId === app.id;

                    return (
                      <div
                        key={app.id}
                        id={`applicant-card-${app.id}`}
                        className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-5 shadow-md hover:border-slate-600 transition-all space-y-4 text-white"
                      >
                        {/* Top Card Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                              {app.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-white text-base">{app.name}</h3>
                                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(app.status)}`}>
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">{app.email}</p>
                              <p className="text-[10px] text-slate-400 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* AI Match Score Badge */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ring-1 ${getScoreBadgeStyle(app.matchScore)} min-w-[85px]`}>
                              <div className="text-xl font-extrabold tracking-tight flex items-center gap-0.5">
                                <span>{app.matchScore}</span>
                                <span className="text-xs font-semibold">%</span>
                              </div>
                              <span className="text-[9px] font-semibold uppercase tracking-wider opacity-90">
                                AI Match
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Reasoning Box - DARK CHARCOAL */}
                        <div className="bg-[#0F172A] p-3.5 rounded-xl border border-slate-700/80 text-xs">
                          <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Evaluation Reasoning:</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed italic">
                            "{app.reasoning}"
                          </p>
                        </div>

                        {/* Submitted Skills Chips - LIGHT BACKGROUND WITH DARK TEXT */}
                        <div>
                          <span className="text-[11px] text-slate-300 block mb-1.5 font-semibold">
                            Submitted Candidate Skills:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {app.skills.map((skill, sIdx) => {
                              const isRequired = activeJob.requiredSkills.some(
                                req => req.toLowerCase() === skill.toLowerCase()
                              );
                              return (
                                <span
                                  key={sIdx}
                                  className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono font-semibold ${
                                    isRequired
                                      ? 'bg-teal-100 text-teal-950 border-teal-300'
                                      : 'bg-slate-100 text-slate-900 border-slate-300'
                                  }`}
                                >
                                  {skill} {isRequired && '✓'}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Expandable Experience Preview */}
                        {app.experience && (
                          <div className="pt-2 border-t border-slate-700/80">
                            <button
                              id={`btn-toggle-exp-${app.id}`}
                              onClick={() => setExpandedApplicantId(isExpanded ? null : app.id)}
                              className="text-xs text-slate-300 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
                            >
                              <span>{isExpanded ? 'Hide Full Background' : 'View Submitted Background / Experience'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-2.5 p-3 rounded-xl bg-[#0F172A] text-xs text-slate-200 leading-relaxed border border-slate-700 whitespace-pre-wrap">
                                {app.experience}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bottom Actions Row: Status Buttons & Generate Message */}
                        <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Status Action Buttons for All 4 Statuses */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-slate-300 mr-1 font-semibold">Set Status:</span>
                            
                            <button
                              id={`btn-status-applied-${app.id}`}
                              onClick={() => {
                                onUpdateStatus(app.id, 'Applied');
                                onShowToast('Status Updated', `${app.name} set back to Applied`, 'info');
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-colors flex items-center gap-1 ${
                                app.status === 'Applied'
                                  ? 'bg-slate-200 text-slate-900 border-white shadow-xs'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </button>

                            <button
                              id={`btn-status-shortlist-${app.id}`}
                              onClick={() => {
                                onUpdateStatus(app.id, 'Shortlisted for Interview');
                                onShowToast('Status Updated', `${app.name} shortlisted for interview`, 'success');
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-colors flex items-center gap-1 ${
                                app.status === 'Shortlisted for Interview'
                                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-xs'
                                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/40'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Shortlist</span>
                            </button>

                            <button
                              id={`btn-status-select-${app.id}`}
                              onClick={() => {
                                onUpdateStatus(app.id, 'Selected');
                                onShowToast('Status Updated', `${app.name} marked as Selected`, 'success');
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-colors flex items-center gap-1 ${
                                app.status === 'Selected'
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-xs'
                                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Select</span>
                            </button>

                            <button
                              id={`btn-status-reject-${app.id}`}
                              onClick={() => {
                                onUpdateStatus(app.id, 'Rejected');
                                onShowToast('Status Updated', `${app.name} set to Rejected`, 'info');
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-colors flex items-center gap-1 ${
                                app.status === 'Rejected'
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-xs'
                                  : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>

                          {/* Generate Message Button */}
                          <button
                            id={`btn-generate-msg-${app.id}`}
                            onClick={() => handleGenerateMessage(app)}
                            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span>Generate Message</span>
                          </button>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-[#1E293B] border border-slate-700/80 rounded-2xl space-y-3 text-white">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Select a job opening</h3>
              <p className="text-xs text-slate-300">Choose a job from the left panel or click "Post New Job".</p>
            </div>
          )}

        </div>

      </div>

      {/* Draft Communication Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        applicant={activeMessageApplicant}
        jobTitle={activeJob?.title || ''}
        subject={generatedSubject}
        body={generatedBody}
        isLoading={isGeneratingMessage}
      />

    </div>
  );
};
