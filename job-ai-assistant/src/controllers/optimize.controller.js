const db = require('../config/db');
const { extractKeywords } = require('../services/keyword.service');
const { calculateMatchScore } = require('../services/matchScore.service');
const { generatePDF } = require('../services/pdf.service');
const model = require ('../config/gemini');

const optimize = async (req, res) => {
  console.log("🔥 optimize route triggered");

  try {
    const jobId = req.params.jobId;
    console.log("JOB ID:", jobId);

    const [[job]] = await db.query(
      "SELECT * FROM job_posts WHERE id = ?",
      [jobId]
    );

    console.log("JOB RESULT:", job);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const [[masterCV]] = await db.query(
      "SELECT * FROM master_cv WHERE user_id = ? AND role_category = ?",
      [job.user_id, job.role_category]
    );

    console.log("MASTER CV RESULT:", masterCV);

    if (!masterCV) {
      return res.status(404).json({ message: "Master CV not found for role" });
    }

    console.log("Calling OpenAI...");

    const prompt = `
    You are a professional career assistant.

    Rewrite the CV to better match the job description and generate a cover letter.

    Return ONLY valid JSON with no explanation.

   {
    "optimized_cv": "string",
    "cover_letter": "string",
    "improvements_made": ["string"]
  }

  CV:
  ${masterCV.cv_text}

  Job Description:
  ${job.description}
 `;

    const result = await model.generateContent(prompt)
    
   const text = result.response.text();

   console.log("🔥 GEMINI RESPONSE:");
   console.log(text);

   let aiResult;

   try {
      // Extract JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
 }

    aiResult = JSON.parse(jsonMatch[0]);

  } catch (err) {

  console.log("⚠️ JSON parsing failed:", err.message);

  aiResult = {
    optimized_cv: text,
    cover_letter: "",
    improvements_made: []
  };
 }

  res.json({
     optimized: aiResult.optimized_cv,
     cover_letter: aiResult.cover_letter,
     improvements_made: aiResult.improvements_made
   });

   } catch (error) {
  console.error("🔥 OPTIMIZATION ERROR:", error);

  res.status(500).json({
    message: "Optimization failed",
    error: error.message,
    stack: error.stack
  });
}
};

const downloadCV = async (req, res) => {
  const jobId = req.params.jobId;

  const [rows] = await db.query(
    `SELECT optimized_cv 
     FROM tailored_versions 
     WHERE job_id = ? 
     ORDER BY created_at DESC LIMIT 1`,
    [jobId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "No optimized CV found" });
  }

  generatePDF(rows[0].optimized_cv, res, 'Optimized_CV.pdf');
};

const downloadCoverLetter = async (req, res) => {
  const jobId = req.params.jobId;

  const [rows] = await db.query(
    `SELECT cover_letter 
     FROM tailored_versions 
     WHERE job_id = ? 
     ORDER BY created_at DESC LIMIT 1`,
    [jobId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "No cover letter found" });
  }

  generatePDF(rows[0].cover_letter, res, 'Cover_Letter.pdf');
};

const optimizeCV = async (req, res) => {
  console.log("🔥 optimizeCV endpoint reached");

  try {
    const { cv_text, job_text } = req.body;

    if (!cv_text || !job_text) {
      return res.status(400).json({ message: "cv_text and job_text required" });
    }

    const prompt = `
      Rewrite the following CV to match the job description.

      CV:
      ${cv_text}

      Job:
      ${job_text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional CV writer." },
        { role: "user", content: prompt }
      ]
    });

    res.json({
      optimized_text: response.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ Optimization crash:", error);

    res.status(500).json({
      message: "Optimization failed",
      error: error.message
    });
  }
};

module.exports = {
  optimize,
  downloadCV,
  downloadCoverLetter,
  optimizeCV,
};