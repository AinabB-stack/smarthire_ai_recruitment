�
� SmartHire — AI-Powered
Recruitment Screening
Platform
Live App:
https://preeminent-torte-4a35d3.netlify.app
GitHub Repository:
https://github.com/AinabB
stack/smarthire_ai_recruitment
📌 What It Does & The Problem It
Solves
SmartHire is a recruitment screening web app that
uses AI to automatically evaluate job applicants
against a job's requirements — instead of a recruiter
manually reading through every single resume.
The real problem: When a company posts a single job
opening, it can receive hundreds or even thousands of
applications. Recruiters simply don't have the time to
manually read every CV and compare it against the
required skills — good candidates often get missed,
and the process takes days or weeks.
Who it's for: Recruiters and hiring teams (the
"Recruiter Portal") who need to quickly identify the
best-fit candidates, and job seekers/students (the
"Candidate Portal") who want instant, transparent
feedback on how well they match a role — instead of
waiting weeks for a reply that may never come.
SmartHire solves this by having an AI model instantly
score every applicant against the job's required skills
and description the moment they apply, sort
candidates by match score automatically, and even
draft the follow-up communication (interview invite,
rejection, or offer) for the recruiter — turning a
process that takes hours into one that takes seconds.
🔗 Live Deployed URL
👉 
https://preeminent-torte-4a35d3.netlify.app
Anyone can open this link and use the app directly —
no login required.
✨ Features List
Recruiter Portal
Post a new job with title, required skills, and job
description
View all posted jobs with applicant counts
Delete any job posting (removes it and its
applications permanently)
Click into any job to view its full applicant list
Applicants are automatically sorted by AI match
score (highest first)
Filter applicants by status: All / Applied /
Shortlisted for Interview / Selected / Rejected
Search applicants by name, email, or skill
Update each applicant's status with one click
Generate a personalized AI-drafted message
(interview invite, rejection, or congratulations) for
any applicant, with a one-click copy button
Candidate Portal
Browse all open job listings with required skills
and full descriptions
Search/filter jobs by title, skill, or location
Apply to any job with a simple form: Name, Email,
Skills, Experience/Background
Receive an instant AI-generated match score (0
100%) and a short reasoning explaining the score
Get confirmation that the application was
submitted successfully
General
Fully responsive, clean, professional UI
All data (jobs, applicants, scores, statuses)
persists in the browser using local storage
Graceful error handling if the AI service is
temporarily unavailable
🧠 The AI Feature
SmartHire's core AI feature runs two Gemini-powered
flows:
1. Applicant Scoring
When a candidate submits an application, their skills
and experience are sent to the Gemini API along with
the job's title, required skills, and description. The
model is instructed to:
"Compare the candidate's submitted skills and
experience against the job's required skills and
description. Return a match score from 0–100 and a
concise 1–2 sentence reasoning explaining the
score, based on how closely the candidate's
background aligns with what the role requires."
This score and reasoning are saved with the
application and used to automatically rank all
applicants for a job from best to worst fit — so
recruiters see the strongest candidates first without
reading a single resume manually.
2. AI Message Drafting
When a recruiter changes an applicant's status
(Shortlisted, Rejected, or Selected) and clicks
"Generate Message," the Gemini API is prompted with:
"Write a professional, personalized [interview
invitation / polite rejection / congratulations]
message for [Candidate Name] regarding their
application for [Job Title], referencing their AI match
score. Keep the tone warm, respectful, and
appropriate to the outcome."
The AI drafts a ready-to-send message (with subject
line and body) that the recruiter can copy directly into
an email or ATS — eliminating the need to write
repetitive candidate communications from scratch.
🛠 Tools, Services & Models Used
Tool / Service
Google AI
Studio (Build)
Purpose
Used to design, generate, and
iteratively refine the entire
application (frontend, backend,
Tool / Service
Purpose
and UI) from natural-language
prompts
Google Gemini
API (
gemini
2.0-flash 
)
Powers both AI features —
applicant match scoring and
personalized message drafting
React +
TypeScript
Tailwind CSS
Frontend framework
Node.js /
Express-style
server functions
GitHub
Styling and responsive design
Backend endpoints that securely
call the Gemini API without
exposing the API key to the
browser
Public version control and
source code hosting
Netlify
Live deployment hosting, with
the Gemini API key stored
securely as an environment
variable
🖼 Screenshots
Recruiter Portal — Job Listings with Delete &
Applicant Counts
(see 
screenshots/recruiter-portal.png 
)
Applicant Screening View — AI Match Scores, Filters
& Search
(see 
screenshots/applicant-screening.png 
)
AI-Drafted Candidate Communication
(see 
screenshots/ai-message-draft.png 
)
Candidate Portal — Job Search & Apply
(see 
screenshots/candidate-portal.png 
)
(Add your screenshot image files to a
screenshots/
 folder in this repo and they will
display here automatically on GitHub.)
▶ How to Run This Project
Option 1: Use the Live Version
(Recommended)
Simply visit 
https://preeminent-torte
4a35d3.netlify.app — no setup needed.
Option 2: Run Locally
1. Clone this repository:
git clone https://github.com/AinabB
stack/smarthire_ai_recruitment.git
cd smarthire_ai_recruitment
2. Install dependencies:
npm install
3. Create a 
.env
 file in the root directory and add
your own Gemini API key (get one for free at
aistudio.google.com/apikey):
GEMINI_API_KEY=your_api_key_here
4. Run the development server:
npm run dev
5. Open the local URL shown in your terminal in a
browser.
󰠁 Developer
Built by Ainab, BSCS student at Rawalpindi Women
University, as the final project for the AI/App
Development training program (Week 7 — "Ship Your
AI App").
