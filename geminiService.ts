
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Hjälpfunktion för att tvätta bort oönskade tecken som AI:n ofta lägger till för matematik
function cleanAIOutput(text: string): string {
  return text.replace(/\$/g, '');
}

export async function getNarrative(roomName: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Du är en Game Master för ett textäventyr kallat "Procent-Paradoxen". Spelet är riktat till en 15-åring i Sverige. 
      Använd ett språk som känns modernt (lite slang är ok, som "bror", "cap", "bestie", "W", men håll det begripligt). 
      Beskriv rummet "${roomName}" och situationen: "${context}". 
      VIKTIGT: Använd ALDRIG dollartecken ($) för att markera variabler eller matematik. Skriv bara bokstäverna som de är (t.ex. a istället för $a$).
      Håll det kort och atmosfäriskt. Max 3 meningar.`,
    });
    return cleanAIOutput(response.text || "Du kliver in i ett nytt rum fyllt av digital rök...");
  } catch (error) {
    console.error("Gemini Error:", error);
    return context;
  }
}

export async function getHint(problem: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `En elev har fastnat på det här matematikproblemet: "${problem}". 
      Ge en kort ledtråd utan att avslöja svaret. Fokusera på begreppet 'förändringsfaktor' eller hur man ska tänka. 
      Prata till en 15-åring på svenska.
      VIKTIGT: Använd ALDRIG dollartecken ($) för matematik eller variabler. Skriv t.ex. x istället för $x$.`,
    });
    return cleanAIOutput(response.text || "Tänk på att använda förändringsfaktorer!");
  } catch (error) {
    return "Försök rita upp problemet eller använd förändringsfaktorer.";
  }
}
