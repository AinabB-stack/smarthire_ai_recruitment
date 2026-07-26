import { Job, Applicant } from '../types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco, CA',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'State Management', 'REST/GraphQL', 'Performance Optimization'],
    description: 'We are seeking an experienced Senior Frontend Engineer to build high-performance, responsive web applications. You will collaborate closely with product designers and backend engineers to craft fluid user interfaces, establish design systems, and ensure scalable frontend architecture.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    title: 'AI Solutions Architect',
    department: 'Product & AI',
    location: 'Hybrid / New York, NY',
    requiredSkills: ['Gemini API', 'Python', 'LLMs', 'Prompt Engineering', 'Node.js', 'System Architecture', 'Vector Databases'],
    description: 'Looking for a visionary AI Solutions Architect to lead the integration of generative AI models into customer-facing products. Responsible for prompt engineering strategy, fine-tuning workflows, API orchestration, and low-latency LLM serving pipeline design.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    location: 'Remote',
    requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility (WCAG)', 'Interaction Design'],
    description: 'Join our design team to create delightful, intuitive digital experiences. You will conduct user interviews, iterate on low/high-fidelity wireframes in Figma, build interactive prototypes, and maintain our cross-platform design system.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'GraphQL', 'Next.js', 'Jest'],
    experience: '6 years of experience building scalable enterprise web applications. Led frontend migration to React 18 and Tailwind CSS at TechCorp, reducing bundle size by 35% and improving Lighthouse performance score from 68 to 98.',
    matchScore: 94,
    reasoning: 'Exceptional skill overlap with 5 core required technologies (React, TS, Tailwind, GraphQL). Strong track record in web performance optimization and design system lead roles.',
    status: 'Shortlisted for Interview',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Vue.js', 'REST API'],
    experience: '3 years as a mid-level web developer. Built responsive customer portals and dashboard components using React and Vue. Strong eye for UI polish and cross-browser support.',
    matchScore: 76,
    reasoning: 'Good foundation in React and web standards. Lacks deep TypeScript and Tailwind CSS experience specified in job requirements, but shows solid web development fundamentals.',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-3',
    jobId: 'job-1',
    name: 'David Miller',
    email: 'david.miller@example.com',
    skills: ['Python', 'Django', 'SQL', 'Docker', 'Basic HTML/CSS'],
    experience: 'Backend developer with 4 years in Django and SQL optimization. Looking to pivot toward fullstack development.',
    matchScore: 42,
    reasoning: 'Primary experience is in backend Python/Django infrastructure with minimal frontend React and TypeScript expertise required for this senior position.',
    status: 'Rejected',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-4',
    jobId: 'job-2',
    name: 'Aria Patel',
    email: 'aria.patel@example.com',
    skills: ['Python', 'Gemini API', 'LLMs', 'Prompt Engineering', 'Node.js', 'LangChain', 'Pinecone', 'System Architecture'],
    experience: '4 years in AI/ML engineering. Built multi-agent LLM pipelines using Gemini API and vector stores at SynthAI. Co-authored papers on structured output constraints and latency optimization.',
    matchScore: 98,
    reasoning: 'Direct alignment with all requested AI technologies including Gemini API, Prompt Engineering, Node.js, and Vector Databases. Highly qualified candidate.',
    status: 'Selected',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'app-5',
    jobId: 'job-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    skills: ['Python', 'FastAPI', 'PyTorch', 'Data Analysis', 'Docker'],
    experience: 'Data Scientist specializing in computer vision models and predictive analytics. 2 years experience running ML experiments in Python.',
    matchScore: 68,
    reasoning: 'Strong Python background and ML fundamentals, but lacks direct experience with LLM orchestration, prompt engineering, and Gemini API integration.',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
