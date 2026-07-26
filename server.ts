import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Route 1: Score Applicant against Job Requirements
app.post("/api/score-applicant", async (req, res) => {
  try {
    const {
      jobTitle,
      requiredSkills = [],
      jobDescription = "",
      candidateName,
      candidateSkills = [],
      candidateExperience = "",
    } = req.body;

    if (!jobTitle || !candidateName) {
      return res.status(400).json({ error: "Missing required job or candidate information" });
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are an expert HR Recruitment Screening AI.
Compare the following Candidate Application against the Job Posting requirements and evaluate their fit.

JOB POSTING:
- Title: ${jobTitle}
- Required Skills: ${Array.isArray(requiredSkills) ? requiredSkills.join(", ") : requiredSkills}
- Job Description: ${jobDescription}

CANDIDATE APPLICATION:
- Name: ${candidateName}
- Submitted Skills: ${Array.isArray(candidateSkills) ? candidateSkills.join(", ") : candidateSkills}
- Experience / Background: ${candidateExperience}

INSTRUCTIONS:
1. Provide a realistic match score integer between 0 and 100 based on technical skill alignment, relevant work background, and overall qualification fit.
2. Provide a concise 1-2 sentence justification highlight key matches or skill gaps.
      `.trim();

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matchScore: {
                  type: Type.INTEGER,
                  description: "Percentage score between 0 and 100",
                },
                reasoning: {
                  type: Type.STRING,
                  description: "1-2 sentence concise evaluation text",
                },
              },
              required: ["matchScore", "reasoning"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          const score = Math.min(100, Math.max(0, Math.round(Number(parsed.matchScore) || 70)));
          return res.json({
            matchScore: score,
            reasoning: parsed.reasoning || "Evaluated by SmartHire AI screening engine.",
            isAiGenerated: true,
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call error during scoring, falling back to heuristic scoring:", geminiErr);
      }
    }

    // Smart Fallback Scoring Engine (when Gemini API is unconfigured or unavailable)
    const reqSkillsArr: string[] = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills).split(",").map((s) => s.trim()).filter(Boolean);
    const candSkillsArr: string[] = Array.isArray(candidateSkills)
      ? candidateSkills
      : String(candidateSkills).split(",").map((s) => s.trim()).filter(Boolean);

    let matchCount = 0;
    const matchedSkillsList: string[] = [];
    const missingSkillsList: string[] = [];

    reqSkillsArr.forEach((reqSkill) => {
      const lowerReq = reqSkill.toLowerCase().trim();
      const hasSkill = candSkillsArr.some((cSkill) => {
        const lowerCand = cSkill.toLowerCase().trim();
        return lowerCand.includes(lowerReq) || lowerReq.includes(lowerCand);
      });
      if (hasSkill) {
        matchCount++;
        matchedSkillsList.push(reqSkill);
      } else {
        missingSkillsList.push(reqSkill);
      }
    });

    const expText = String(candidateExperience).toLowerCase();
    let keywordBonus = 0;
    reqSkillsArr.forEach((reqSkill) => {
      if (expText.includes(reqSkill.toLowerCase().trim())) {
        keywordBonus += 5;
      }
    });

    const skillRatio = reqSkillsArr.length > 0 ? matchCount / reqSkillsArr.length : 0.7;
    let baseScore = Math.round(skillRatio * 75 + Math.min(25, keywordBonus + (candidateExperience.length > 100 ? 15 : 5)));
    baseScore = Math.min(98, Math.max(35, baseScore));

    let fallbackReasoning = "";
    if (matchedSkillsList.length > 0) {
      fallbackReasoning = `Matches core skills (${matchedSkillsList.slice(0, 3).join(", ")}) for ${jobTitle}.`;
      if (missingSkillsList.length > 0) {
        fallbackReasoning += ` Could strengthen experience in ${missingSkillsList.slice(0, 2).join(", ")}.`;
      }
    } else {
      fallbackReasoning = `Shows general experience, but lacks direct match with primary required skills (${reqSkillsArr.slice(0, 3).join(", ")}).`;
    }

    return res.json({
      matchScore: baseScore,
      reasoning: fallbackReasoning,
      isAiGenerated: false,
    });
  } catch (error) {
    console.error("Error in /api/score-applicant:", error);
    res.status(500).json({ error: "Failed to score candidate application" });
  }
});

// Route 2: Generate Draft Recruiter Message
app.post("/api/generate-message", async (req, res) => {
  try {
    const {
      candidateName,
      jobTitle,
      status, // 'Shortlisted for Interview' | 'Rejected' | 'Selected' | 'Applied'
      matchScore,
      reasoning,
    } = req.body;

    if (!candidateName || !jobTitle || !status) {
      return res.status(400).json({ error: "Missing candidate name, job title, or status" });
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are an executive HR talent acquisition specialist at SmartHire.
Write a personalized, professional email message to a job candidate regarding their application status.

DETAILS:
- Candidate Name: ${candidateName}
- Job Title: ${jobTitle}
- Decision Status: ${status}
- AI Match Score: ${matchScore}%
- Key Screening Insight: ${reasoning}

INSTRUCTIONS:
- If Status is 'Shortlisted for Interview': Invite them enthusiastically to an initial 30-minute interview, asking for their availability over the next week.
- If Status is 'Selected': Congratulate them on being chosen for the role offer and outline next steps for onboarding.
- If Status is 'Rejected': Write a warm, encouraging, polite rejection thanking them for their time and encouraging them to keep in touch for future opportunities.
- Keep tone professional, respectful, empathetic, and polished.
- Do NOT include placeholder tokens like [Your Name] or [Company Name] — sign off smoothly as "The SmartHire Talent Team".
      `.trim();

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subject: {
                  type: Type.STRING,
                  description: "Professional email subject line",
                },
                body: {
                  type: Type.STRING,
                  description: "Complete email message body text",
                },
              },
              required: ["subject", "body"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({
            subject: parsed.subject,
            body: parsed.body,
            isAiGenerated: true,
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call error during message generation, using fallback template:", geminiErr);
      }
    }

    // Fallback Template Message Generation
    let subject = "";
    let body = "";

    if (status === "Shortlisted for Interview") {
      subject = `Interview Invitation: ${jobTitle} Role at SmartHire`;
      body = `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} position at SmartHire. We were very impressed by your qualifications and match score (${matchScore}%).\n\nWe would love to schedule a 30-minute interview to learn more about your background and discuss how your skills align with our team's goals.\n\nPlease let us know a few dates and times that work best for you over the upcoming week.\n\nBest regards,\nThe SmartHire Talent Team`;
    } else if (status === "Selected") {
      subject = `Congratulations! Offer for ${jobTitle} Position`;
      body = `Dear ${candidateName},\n\nWe are thrilled to inform you that you have been selected for the ${jobTitle} role at SmartHire!\n\nOur evaluation highlighted your strong background and excellent candidate fit (${matchScore}% match). We believe your experience will make a fantastic addition to our team.\n\nOur team will follow up shortly with formal offer documents and details regarding your start date.\n\nCongratulations again!\n\nWarm regards,\nThe SmartHire Talent Team`;
    } else if (status === "Rejected") {
      subject = `Update regarding your application for ${jobTitle}`;
      body = `Hi ${candidateName},\n\nThank you for taking the time to apply for the ${jobTitle} position and sharing your background with us.\n\nAfter reviewing your application alongside our current requirements, we have decided to move forward with other candidates whose experience more closely matches our immediate technical needs.\n\nWe genuinely appreciate your interest in SmartHire and wish you every success in your career journey.\n\nBest regards,\nThe SmartHire Talent Team`;
    } else {
      subject = `Application Received: ${jobTitle}`;
      body = `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} role at SmartHire. We have safely received your profile and will review it shortly.\n\nBest regards,\nThe SmartHire Talent Team`;
    }

    return res.json({
      subject,
      body,
      isAiGenerated: false,
    });
  } catch (error) {
    console.error("Error in /api/generate-message:", error);
    res.status(500).json({ error: "Failed to generate candidate message" });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartHire server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
