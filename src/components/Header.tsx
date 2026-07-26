import React from 'react';
import { Briefcase, UserCheck, Sparkles, RefreshCw, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recruiter' | 'candidate';
  onTabChange: (tab: 'recruiter' | 'candidate') => void;
  totalJobs: number;
  totalApplicants: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  totalJobs,
  totalApplicants,
  onResetData,
}) => {
  return (
    <header id="app-header" className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-600/20">
              <Sparkles className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Smart<span className="text-teal-600">Hire</span></span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                  AI Screening
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Intelligent Recruitment & Candidate Matching</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="tab-recruiter-view"
              onClick={() => onTabChange('recruiter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Briefcase className={`w-4 h-4 ${activeTab === 'recruiter' ? 'text-teal-600' : 'text-slate-500'}`} />
              <span>Recruiter Portal</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                activeTab === 'recruiter' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalApplicants}
              </span>
            </button>

            <button
              id="tab-candidate-view"
              onClick={() => onTabChange('candidate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'candidate'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === 'candidate' ? 'text-teal-600' : 'text-slate-500'}`} />
              <span>Candidate Portal</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                activeTab === 'candidate' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalJobs} jobs
              </span>
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="btn-reset-sample-data"
              onClick={onResetData}
              title="Reset to default demo jobs and candidates"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo Data</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
