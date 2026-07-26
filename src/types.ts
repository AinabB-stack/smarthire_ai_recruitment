export type CandidateStatus = 
  | 'Applied'
  | 'Shortlisted for Interview'
  | 'Rejected'
  | 'Selected';

export interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  requiredSkills: string[];
  description: string;
  createdAt: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  matchScore: number; // 0 to 100
  reasoning: string;
  status: CandidateStatus;
  appliedAt: string;
}

export interface ScoreResponse {
  matchScore: number;
  reasoning: string;
  isAiGenerated?: boolean;
}

export interface MessageResponse {
  subject: string;
  body: string;
  isAiGenerated?: boolean;
}
