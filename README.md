Table of Contents

🤖 SmartHire — AI-Powered Recruitment Screening Platform<br>
An AI-powered recruitment screening app that instantly scores job applicants against a role’s requirements and drafts candidate communications automatically.<br>
🔗 Live App: https://preeminent-torte-4a35d3.netlify.app<br>
📂 GitHub Repository: https://github.com/AinabB-stack/smarthire_ai_recruitment<br>
________________________________________
📋 Table of Contents<br>

•	What It Does & The Problem It Solves<br>
•	Live Deployed URL<br>
•	Features List<br>
•	The AI Feature<br>
•	Tools, Services & Models Used<br>
•	Screenshots<br>
•	How to Run This Project<br>
•	Developer<br>
________________________________________
📌 What It Does & The Problem It Solves<br>

SmartHire is a recruitment screening web app that uses AI to automatically evaluate job applicants against a job’s requirements — instead of a recruiter manually reading through every single resume.<br>
The real problem: When a company posts a single job opening, it can receive hundreds or even thousands of applications. Recruiters simply don’t have the time to manually read every CV and compare it against the required skills — good candidates often get missed, and the process takes days or weeks.<br>
Who it’s for: Recruiters and hiring teams (the “Recruiter Portal”) who need to quickly identify the best-fit candidates, and job seekers/students (the “Candidate Portal”) who want instant, transparent feedback on how well they match a role — instead of waiting weeks for a reply that may never come.<br>
SmartHire solves this by having an AI model instantly score every applicant against the job’s required skills and description the moment they apply, sort candidates by match score automatically, and even draft the follow-up communication (interview invite, rejection, or offer) for the recruiter — turning a process that takes hours into one that takes seconds.<br>
________________________________________
🔗 Live Deployed URL<br>

👉 https://preeminent-torte-4a35d3.netlify.app<br>
Anyone can open this link and use the app directly — no login required.<br>
________________________________________
✨ Features List<br>
Recruiter Portal<br>
•	Post a new job with title, required skills, and job description<br>
•	View all posted jobs with applicant counts<br>
•	Delete any job posting (removes it and its applications permanently)<br>
•	Click into any job to view its full applicant list<br>
•	Applicants are automatically sorted by AI match score (highest first)<br>
•	Filter applicants by status: All / Applied / Shortlisted for Interview / Selected / Rejected<br>
•	Search applicants by name, email, or skill<br>
•	Update each applicant’s status with one click<br>
•	Generate a personalized AI-drafted message (interview invite, rejection, or congratulations) for any applicant, with a one-click copy button
Candidate Portal<br>
•	Browse all open job listings with required skills and full descriptions<br>
•	Search/filter jobs by title, skill, or location<br>
•	Apply to any job with a simple form: Name, Email, Skills, Experience/Background<br>
•	Receive an instant AI-generated match score (0–100%) and a short reasoning explaining the score<br>
•	Get confirmation that the application was submitted successfully
General<br>
•	Fully responsive, clean, professional UI<br>
•	All data (jobs, applicants, scores, statuses) persists in the browser using local storage<br>
•	Graceful error handling if the AI service is temporarily unavailable<br>
________________________________________
🧠 The AI Feature<br>
SmartHire’s core AI feature runs two Gemini-powered flows:<br>
1. Applicant Scoring<br>
When a candidate submits an application, their skills and experience are sent to the Gemini API along with the job’s title, required skills, and description. The model is instructed to:<br>
“Compare the candidate’s submitted skills and experience against the job’s required skills and description. Return a match score from 0–100 and a concise 1–2 sentence reasoning explaining the score, based on how closely the candidate’s background aligns with what the role requires.”<br>
This score and reasoning are saved with the application and used to automatically rank all applicants for a job from best to worst fit — so recruiters see the strongest candidates first without reading a single resume manually.<br>
2. AI Message Drafting<br>
When a recruiter changes an applicant’s status (Shortlisted, Rejected, or Selected) and clicks “Generate Message,” the Gemini API is prompted with:<br>
“Write a professional, personalized [interview invitation / polite rejection / congratulations] message for [Candidate Name] regarding their application for [Job Title], referencing their AI match score. Keep the tone warm, respectful, and appropriate to the outcome.”<br>
The AI drafts a ready-to-send message (with subject line and body) that the recruiter can copy directly into an email or ATS — eliminating the need to write repetitive candidate communications from scratch.<br>
________________________________________
🛠️ Tools, Services & Models Used<br>
Tool / Service	Purpose<br>
Google AI Studio (Build)	Used to design, generate, and iteratively refine the entire application (frontend, backend, and UI) from natural-language prompts<br>
Google Gemini API (gemini-2.0-flash)	Powers both AI features — applicant match scoring and personalized message drafting<br>
React + TypeScript	Frontend framework<br>
Tailwind CSS	Styling and responsive design<br>
Node.js / Express-style server functions	Backend endpoints that securely call the Gemini API without exposing the API key to the browser<br>
GitHub	Public version control and source code hosting<br>
Netlify	Live deployment hosting, with the Gemini API key stored securely as an environment variable<br>
________________________________________

▶️ How to Run This Project<br>
Option 1: Use the Live Version (Recommended)<br>
Simply visit https://preeminent-torte-4a35d3.netlify.app — no setup needed.<br>
Option 2: Run Locally<br>
1.	Clone this repository:<br>
 	git clone https://github.com/AinabB-stack/smarthire_ai_recruitment.git<br>
cd smarthire_ai_recruitment<br>
2.	Install dependencies:<br>
 	npm install<br>
3.	Create a .env file in the root directory and add your own Gemini API key (get one for free at aistudio.google.com/apikey):<br>
 	GEMINI_API_KEY=your_api_key_here<br>
4.	Run the development server:<br>
 	npm run dev<br>
5.	Open the local URL shown in your terminal in a browser.<br>
________________________________________
👩💻 Developer<br>
Built by Ainab, BSCS student at Rawalpindi Women University, as the final project for the AI/App Development training program (Week 7 — “Ship Your AI App”).<br>
