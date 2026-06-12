const schema = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "OBJECT",
      properties: {
        short: { type: "STRING" },
        detailed: { type: "STRING" },
        keyIdeas: { type: "ARRAY", items: { type: "STRING" } },
        importantTerms: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { term: { type: "STRING" }, definition: { type: "STRING" } },
            required: ["term", "definition"],
          },
        },
        examPoints: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["short", "detailed", "keyIdeas", "importantTerms", "examPoints"],
    },
    quiz: {
      type: "OBJECT",
      properties: {
        mcqs: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              options: { type: "ARRAY", items: { type: "STRING" } },
              answer: { type: "STRING" },
              explanation: { type: "STRING" },
            },
            required: ["question", "options", "answer", "explanation"],
          },
        },
        shortAnswers: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { question: { type: "STRING" }, answer: { type: "STRING" } },
            required: ["question", "answer"],
          },
        },
        trueFalse: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              statement: { type: "STRING" },
              answer: { type: "BOOLEAN" },
              explanation: { type: "STRING" },
            },
            required: ["statement", "answer", "explanation"],
          },
        },
      },
      required: ["mcqs", "shortAnswers", "trueFalse"],
    },
    flashcards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { front: { type: "STRING" }, back: { type: "STRING" } },
        required: ["front", "back"],
      },
    },
    revisionSheet: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        summary: { type: "STRING" },
        keyPoints: { type: "ARRAY", items: { type: "STRING" } },
        definitions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { term: { type: "STRING" }, definition: { type: "STRING" } },
            required: ["term", "definition"],
          },
        },
        examQuestions: { type: "ARRAY", items: { type: "STRING" } },
        memoryTips: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["title", "summary", "keyPoints", "definitions", "examQuestions", "memoryTips"],
    },
  },
  required: ["summary", "quiz", "flashcards", "revisionSheet"],
};

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return response.status(503).json({ error: "AI generation is unavailable right now. Try again later or use sample mode." });

  const { notes, subject = "Other", difficulty = "Medium", outputType = "all" } = request.body || {};
  if (!notes || typeof notes !== "string" || notes.trim().length < 30) {
    return response.status(400).json({ error: "Please provide at least 30 characters of notes." });
  }
  if (notes.length > 30000) return response.status(400).json({ error: "Notes must be under 30,000 characters." });

  const prompt = `You are LearnLens AI, an expert study coach. Convert the student's notes into accurate, concise study material.
Subject: ${subject}
Difficulty: ${difficulty}
Requested output: ${outputType}

Rules:
- Use only information supported by the notes.
- Make questions useful for a ${difficulty.toLowerCase()} assessment.
- Return 4 MCQs, 3 short-answer questions, 3 true/false questions, and 6 flashcards.
- Keep explanations clear and student-friendly.
- Important terms and definitions must be factual.

STUDENT NOTES:
${notes.trim()}`;

  try {
    const models = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];
    let geminiResponse;

    for (let attempt = 0; attempt < models.length; attempt += 1) {
      geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${models[attempt]}:generateContent`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: schema,
            temperature: 0.35,
          },
        }),
        },
      );

      if (geminiResponse.ok) break;
      const retryable = [429, 500, 502, 503, 504].includes(geminiResponse.status);
      const detail = await geminiResponse.text();
      console.error(`Gemini ${models[attempt]} error:`, geminiResponse.status, detail.slice(0, 500));
      if (!retryable) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }

    if (!geminiResponse.ok) {
      return response.status(502).json({ error: "AI generation is unavailable right now. Try again later or use sample mode." });
    }

    const payload = await geminiResponse.json();
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned no content.");
    return response.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("Generation failed:", error);
    return response.status(500).json({ error: "AI generation is unavailable right now. Try again later or use sample mode." });
  }
}
