import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from "../types";

const parseDataPrompt = `
You are a senior construction data analyst. 
Analyze the provided text, which is likely a workforce roster or allocation table (OCR data).
The data typically contains columns like "Title" (Location/Project), "Position" (Role), and "Quantity" (Count).
There might be sections for "ИТР" (Engineers/Technicians) and "Рабочие" (Workers).

Your task:
1. Extract the data into a structured JSON format.
2. If a row specifies a Quantity > 1 (e.g., "Electrician - 6"), generate 6 individual worker entries. Give them generic names like "Electrician 1", "Electrician 2", or if names are available, use them.
3. Classify each worker as 'ITR' (Management, Engineers, Foremen) or 'WORKER' (Manual labor) or 'MACHINERY' (if it's equipment like Excavator, Crane).
4. Map "Title" or "Титул" to 'location'.
5. Map "Position" or "Должность" to 'role'.
6. Standardize status to: "На смене" (default), "Больничный", "Отпуск", "Отсутствует".

Also, provide a brief executive summary (in Russian) of the workforce situation, identify any critical alerts (e.g., shortages, high number of ITR vs Workers), and give recommendations.
`;

export const parseAndAnalyzeData = async (inputText: string): Promise<DashboardData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `DATA TO PARSE:\n${inputText}\n\n${parseDataPrompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['ITR', 'WORKER', 'MACHINERY'] },
                  location: { type: Type.STRING },
                  status: { type: Type.STRING },
                  efficiency: { type: Type.NUMBER, description: "Estimated efficiency 0-100" }
                }
              }
            },
            summary: { type: Type.STRING },
            alerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");
    
    return JSON.parse(text) as DashboardData;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};