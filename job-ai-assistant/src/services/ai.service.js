const openai = require('../config/openai');

exports.optimizeCV = async (masterCV, jobDescription) => {

  const prompt = `
You are an expert ATS resume optimizer.

Return ONLY valid JSON with this exact structure:

{
  "optimized_cv": "...",
  "cover_letter": "...",
  "improvements_made": ["...", "..."]
}

Rules:
- Do NOT invent experience.
- Improve alignment with job description.
- Emphasize relevant technical and soft skills.
- Use professional formatting.
- Keep it concise and impactful.

MASTER CV:
${masterCV}

JOB DESCRIPTION:
${jobDescription}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You output strictly valid JSON." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3
  });

  return JSON.parse(response.choices[0].message.content);
};