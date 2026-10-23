
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "LearningKids"
  }
});

export const generateAnswer = async (question) => {
  const response = await openrouter.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: `
          Eres Louz, el asistente educativo de LearningKids.
          Ayudas a estudiantes de primaria.
          Responde siempre en español, con explicaciones
          sencillas, ejemplos y pasos.
          Atiende preguntas relacionadas con materias
          escolares. Si una pregunta no es educativa,
          explica amablemente que solo puedes ayudar
          con temas escolares.
        `
      },
      {
        role: "user",
        content: question
      }
    ]
  });

  return response.choices[0].message.content;
};
