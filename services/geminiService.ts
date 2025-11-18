import { GoogleGenAI } from "@google/genai";
import { StudyPlace } from '../types';

// Initialize the Gemini AI client
// process.env.API_KEY is guaranteed to be available by the runtime environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePlaceDescription = async (name: string, tags: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a short, engaging description (max 2 sentences) for a university study spot named "${name}".
      Key features/tags provided: ${tags.join(', ')}.
      The tone should be helpful for students looking for a place to study.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "A great place to study on campus.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "A great place to study on campus.";
  }
};

export const getSmartRecommendations = async (query: string, places: StudyPlace[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Create a lightweight context of the available places
    const placesContext = places.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Type: ${p.type}, Noise: ${p.noiseLevel}, Outlets: ${p.hasOutlets}, OpenLate: ${p.isOpenLate}, Desc: ${p.description}`
    ).join('\n');

    const prompt = `
      You are a helpful campus guide. A student asks: "${query}"
      
      Here is a list of available study places on campus:
      ${placesContext}
      
      Based strictly on the list above, recommend the top 1-3 places that best fit their request.
      Explain why you chose them briefly. If nothing matches well, say so politely and suggest the closest alternative.
      Format the output as a friendly chat response. Do not use Markdown lists, just conversational text.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I'm having trouble accessing the campus database right now. Please try browsing the list!";
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return "Sorry, I couldn't process your request at the moment.";
  }
};