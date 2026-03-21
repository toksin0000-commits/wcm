import OpenAI from "openai";

// Kontrola, zda je klíč dostupný
const apiKey = process.env.GROQ_API_KEY;
const client = apiKey ? new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1" }) : null;

interface Conflict {
  id: string;
  name: string;
  region: string;
  summary_short: string;
  summary_long: string;
  flag: string;
  humanitarian: {
    refugees: number;
    idps: number;
    civilian_casualties: number;
  };
  timeline: any[];
}

export async function askAI(conflict: Conflict, question: string) {
  // Pokud není klíč, vrátíme chybovou zprávu
  if (!client) {
    return "AI není dostupná – chybí API klíč. Přidej GROQ_API_KEY do environment variables.";
  }

  const response = await client.chat.completions.create({
    model: "mixtral-8x7b-32768", // Groq model místo GPT
    messages: [
      {
        role: "system",
        content: `
Jsi neutrální AI, která vysvětluje konflikty bez taktických detailů,
bez predikcí a bez vojenských návodů. Drž se faktů a kontextu.
        `
      },
      {
        role: "user",
        content: `
Konflikt: ${conflict.name}
Otázka: ${question}
        `
      }
    ]
  });

  return response.choices[0].message.content;
}