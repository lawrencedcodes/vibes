import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is missing!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const models = {
  flash: "gemini-2.5-flash",
  pro: "gemini-3.1-pro-preview", // Good for complex reasoning
};

export async function analyzeAndGenerate(content: string, type: "url" | "text") {
  // We'll do a two-step or one-step prompt. One-step is faster.
  // We need structured JSON output.
  
  const prompt = `
    You are a DevRel expert and technical content strategist. 
    Your goal is to take a raw technical artifact and repurpose it into a multi-channel distribution kit.
    
    INPUT CONTEXT:
    Type: ${type}
    Content:
    """
    ${content.slice(0, 30000)} 
    """
    (Content truncated if too long)

    TASK:
    1. Analyze the content for:
       - Key Value Propositions (3 bullet points)
       - Target Audience Pain Points (3 bullet points)
       - Technical Complexity Score (1-10)
       - "Soul" Assessment (What makes this technically interesting?)
       - Primary Programming Language (e.g., Rust, TypeScript, Python, etc.)
       - Key Improvements/Benefits (Select up to 5 from: Boilerplate Reduction, Performance Gains, Type Safety, Developer Experience, Scalability, Security, Maintainability, Cost Efficiency, Observability)
    
    2. Generate the following assets:
       - **LinkedIn Series**: 3 distinct posts (Hook, Body, Call to Action). Post 1: Problem/Solution. Post 2: Deep Dive/How it works. Post 3: Case Study/Future.
       - **Discord/Slack TL;DR**: A concise, emoji-friendly summary for a developer community.
       - **Tweet**: A punchy, high-engagement tweet (max 280 chars).
       - **Conference Talk**: Title, Abstract (300 words), and Outline.
       - **Video Script**: A "Getting Started" video script (Intro, Setup, Demo, Outro).

    OUTPUT FORMAT:
    Return ONLY valid JSON with this structure:
    {
      "analysis": {
        "valueProps": ["..."],
        "painPoints": ["..."],
        "complexity": 5,
        "soul": "...",
        "language": "...",
        "improvements": ["..."]
      },
      "assets": {
        "linkedin": [
          { "title": "Post 1", "content": "..." },
          { "title": "Post 2", "content": "..." },
          { "title": "Post 3", "content": "..." }
        ],
        "discord": "...",
        "tweet": "...",
        "conference": {
          "title": "...",
          "abstract": "...",
          "outline": ["..."]
        },
        "videoScript": "..."
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: models.flash,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  // Clean the response text to handle potential markdown blocks or extra characters
  let cleanedText = text.trim();
  
  // Remove markdown code blocks if present
  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Find the JSON object boundaries
  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    console.error("Raw text:", text);
    throw new Error("Failed to parse AI response as JSON");
  }
}
