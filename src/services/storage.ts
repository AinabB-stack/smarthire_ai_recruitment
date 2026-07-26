import { Job, Applicant, CandidateStatus } from '../types';
import { INITIAL_JOBS, INITIAL_APPLICANTS } from '../data/initialData';

const STORAGE_KEYS = {
  JOBS: 'smarthire_jobs_v1',
  APPLICANTS: 'smarthire_applicants_v1',
};

export const StorageService = {
  getJobs(): Job[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!data) {
        this.saveJobs(INITIAL_JOBS);
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading jobs from storage', e);
      return INITIAL_JOBS;
    }
  },

  saveJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error('Error saving jobs to storage', e);
    }
  },

  addJob(job: Omit<Job, 'id' | 'createdAt'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newJob, ...jobs];
    this.saveJobs(updated);
    return newJob;
  },

  deleteJob(jobId: string): void {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this.saveJobs(jobs);
    
    // Also remove applicants for this job
    const applicants = this.getApplicants().filter(a => a.jobId !== jobId);
    this.saveApplicants(applicants);
  },

  getApplicants(): Applicant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
      if (!data) {
        this.saveApplicants(INITIAL_APPLICANTS);
        return INITIAL_APPLICANTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading applicants from storage', e);
      return INITIAL_APPLICANTS;
    }
  },

  saveApplicants(applicants: Applicant[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(applicants));
    } catch (e) {
      console.error('Error saving applicants to storage', e);
    }
  },

  addApplicant(applicant: Omit<Applicant, 'id' | 'status' | 'appliedAt'>): Applicant {
    const applicants = this.getApplicants();
    const newApplicant: Applicant = {
      ...applicant,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
    };
    const updated = [newApplicant, ...applicants];
    this.saveApplicants(updated);
    return newApplicant;
  },

  updateApplicantStatus(applicantId: string, status: CandidateStatus): Applicant | null {
    const applicants = this.getApplicants();
    let updatedApplicant: Applicant | null = null;
    const updated = applicants.map(a => {
      if (a.id === applicantId) {
        updatedApplicant = { ...a, status };
        return updatedApplicant;
      }
      return a;
    });
    this.saveApplicants(updated);
    return updatedApplicant;
  },

  resetToDefault(): { jobs: Job[]; applicants: Applicant[] } {
    this.saveJobs(INITIAL_JOBS);
    this.saveApplicants(INITIAL_APPLICANTS);
    return { jobs: INITIAL_JOBS, applicants: INITIAL_APPLICANTS };
  }
};
