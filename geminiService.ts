
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisRecord, AgentResult, Verdict, MediaType } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function performDeepfakeAnalysis(
  file: File,
  fileType: MediaType,
  base64Data: string
): Promise<AnalysisRecord> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are the MAYAVIHIN Deepfake Detection System. 
    Analyze the provided ${fileType} for authenticity.
    
    You must return a JSON object containing:
    1. overallVerdict: "Real", "Fake", or "Uncertain"
    2. overallConfidence: Number (0-100)
    3. agents: An array of 5 agents:
       - Visual Forensics: Check for facial artifacts, warping, unnatural lighting.
       - Audio Analysis: If audio/video, check for robotic tones, cloning artifacts. If image, mark as "Uncertain".
       - Metadata: Simulated check for missing EXIF, suspicious compression.
       - Consistency: Logic of the content.
       - Explainability: Human-readable summary.
    4. explanation: A brief summary paragraph.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: `Analyze this ${fileType} file named "${file.name}".` },
          { inlineData: { data: base64Data.split(',')[1], mimeType: file.type } }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallVerdict: { type: Type.STRING },
          overallConfidence: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          agents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                verdict: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              },
              required: ["name", "verdict", "confidence", "reasoning"]
            }
          }
        },
        required: ["overallVerdict", "overallConfidence", "explanation", "agents"]
      }
    }
  });

  const rawJson = JSON.parse(response.text || '{}');

  const agents: AgentResult[] = rawJson.agents.map((a: any, index: number) => ({
    id: `agent-${index}`,
    name: a.name,
    verdict: a.verdict as Verdict,
    confidence: a.confidence,
    reasoning: a.reasoning
  }));

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    fileName: file.name,
    fileSize: file.size,
    fileType,
    thumbnail: fileType === 'image' ? base64Data : undefined,
    verdict: rawJson.overallVerdict as Verdict,
    overallConfidence: rawJson.overallConfidence,
    agents,
    explanation: rawJson.explanation
  };
}
