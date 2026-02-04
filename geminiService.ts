
import { GoogleGenAI } from "@google/genai";

// Miljövariabeln process.env.API_KEY används direkt enligt säkerhetsföreskrifter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      VIKTIGT: Använd ALDRIG dollartecken ($) för att markera variabler eller matematik. Skriv bara bokstäverna som de är.
      Håll det kort och atmosfäriskt. Max 3 meningar.`,
    });
    return cleanAIOutput(response.text || "Du kliver in i ett nytt rum fyllt av digital rök...");
  } catch (error) {
    console.error("Gemini Error:", error);
    return context;
  }
}

export async function getHint(problem: string, level: number) {
  let levelInstruction = "";
  if (level === 1) {
    levelInstruction = "Ge en mycket subtil ledtråd. Fokusera bara på vilket övergripande matematiskt koncept som behövs (t.ex. 'Tänk på förändringsfaktorer'). Ge absolut ingen uträkning.";
  } else if (level === 2) {
    levelInstruction = "Ge en tydligare ledtråd. Förklara det första steget i uträkningen eller hur man ställer upp problemet, men ge inte slutresultatet.";
  } else {
    levelInstruction = "Ge en mycket tydlig ledtråd. Förklara nästan hela vägen till lösningen steg-för-steg, men låt eleven göra den sista beräkningen själv.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `En elev har fastnat på det här matematikproblemet: "${problem}". 
      ${levelInstruction}
      Prata till en 15-åring på svenska i en cyberpunk-ig 'Hacker-Runner' ton.
      VIKTIGT: Använd ALDRIG dollartecken ($) för matematik eller variabler.`,
    });
    return cleanAIOutput(response.text || "Försök använda förändringsfaktorer för att lösa detta.");
  } catch (error) {
    return "Ett fel uppstod vid hämtning av ledtråd. Kontrollera din uppkoppling.";
  }
}
