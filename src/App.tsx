import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecruiterView } from './components/Recruiter/RecruiterView';
import { CandidateView } from './components/Candidate/CandidateView';
import { PostJobModal } from './components/Recruiter/PostJobModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { StorageService } from './services/storage';
import { Job, Applicant, CandidateStatus, ScoreResponse } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'candidate'>('recruiter');
  
  // Data state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Modals & UI State
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from Storage on mount
  useEffect(() => {
    const loadedJobs = StorageService.getJobs();
    const loadedApplicants = StorageService.getApplicants();
    setJobs(loadedJobs);
    setApplicants(loadedApplicants);
    if (loadedJobs.length > 0) {
      setSelectedJobId(loadedJobs[0].id);
    }
  }, []);

  // Toast handler
  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
    };
    setToasts(prev => [...prev.slice(-3), newToast]); // keep max 4 toasts

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Job Actions
  const handlePostJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob = StorageService.addJob(jobData);
    const updatedJobs = StorageService.getJobs();
    setJobs(updatedJobs);
    setSelectedJobId(newJob.id);
    showToast('Job Published!', `"${newJob.title}" is now open for applicants.`, 'success');
  };

  const handleDeleteJob = (jobId: string) => {
    StorageService.deleteJob(jobId);
    const updatedJobs = StorageService.getJobs();
    const updatedApplicants = StorageService.getApplicants();
    setJobs(updatedJobs);
    setApplicants(updatedApplicants);

    if (selectedJobId === jobId) {
      setSelectedJobId(updatedJobs[0]?.id || null);
    }
    showToast('Job Deleted', 'The job and its applications were removed.', 'info');
  };

  // Applicant Actions
  const handleUpdateApplicantStatus = (applicantId: string, status: CandidateStatus) => {
    StorageService.updateApplicantStatus(applicantId, status);
    setApplicants(StorageService.getApplicants());
  };

  const handleApplyJob = (
    applicantData: Omit<Applicant, 'id' | 'status' | 'appliedAt' | 'matchScore' | 'reasoning'>,
    scoreData: ScoreResponse
  ) => {
    const newApplicant = StorageService.addApplicant({
      ...applicantData,
      matchScore: scoreData.matchScore,
      reasoning: scoreData.reasoning,
    });
    setApplicants(StorageService.getApplicants());
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (confirm('Reset to initial sample jobs and candidates? Any custom entries will be restored.')) {
      const { jobs: resetJobs, applicants: resetApplicants } = StorageService.resetToDefault();
      setJobs(resetJobs);
      setApplicants(resetApplicants);
      setSelectedJobId(resetJobs[0]?.id || null);
      showToast('Demo Data Reset', 'Restored sample jobs and candidates.', 'info');
    }
  };

  return (
    <div id="smart-hire-root" className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans antialiased selection:bg-teal-600 selection:text-white flex flex-col">
      
      {/* Header with Tab Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalJobs={jobs.length}
        totalApplicants={applicants.length}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'recruiter' ? (
          <RecruiterView
            jobs={jobs}
            applicants={applicants}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
            onDeleteJob={handleDeleteJob}
            onUpdateStatus={handleUpdateApplicantStatus}
            onShowToast={showToast}
          />
        ) : (
          <CandidateView
            jobs={jobs}
            applicants={applicants}
            onSubmitApplication={handleApplyJob}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-800">SmartHire</span> • AI Recruitment & Candidate Screening Platform
          </div>
          <div>
            Powered by Google Gemini 3.6 Flash & React
          </div>
        </div>
      </footer>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSubmit={handlePostJob}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
