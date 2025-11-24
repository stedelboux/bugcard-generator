import { GoogleGenAI, Type } from "@google/genai";
import { BugPersona } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBugPersona = async (words: string[]): Promise<BugPersona> => {
  const prompt = `
    Crie um personagem "Bug de Produto" baseado nestas 3 palavras de mood: "${words.join(', ')}".
    O tom deve ser humor estilo "Capricho" mas para Product Managers, Designers UX/UI e Devs.
    Seja irônico, use jargão da área (Figma, Jira, Deploy, CSS, API), mas mantenha leve.
    O resultado deve ser em Português do Brasil.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "Você é um gerador de testes de personalidade satíricos para o mundo de tecnologia e design.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nome: { type: Type.STRING, description: "Nome do Bug (engraçado, trocadilho)" },
          tipo: { type: Type.STRING, description: "Categoria (UI, UX, Lógica, Compliance, etc)" },
          comportamento: { type: Type.STRING, description: "O que ele faz (2 linhas, humor inteligente)" },
          causaRaiz: { type: Type.STRING, description: "Motivo técnico/produto realista e trágico" },
          impactoTime: { type: Type.STRING, description: "Como o time reage (engraçado)" },
          patchTemporario: { type: Type.STRING, description: "Solução gambiarra absurda ou realista" },
          severidade: { type: Type.INTEGER, description: "Nível de caos de 0 a 500" },
          logMessage: { type: Type.STRING, description: "Mensagem curta de erro estilo console log" },
          aparenciaDescricao: { type: Type.STRING, description: "Descrição visual detalhada para gerar um personagem em 3D Pixel Art. Inclua cores, acessórios e expressão facial." },
        },
        required: ["nome", "tipo", "comportamento", "causaRaiz", "impactoTime", "patchTemporario", "severidade", "logMessage", "aparenciaDescricao"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Falha ao gerar o bug.");
  
  return JSON.parse(text) as BugPersona;
};

export const generateBugImage = async (description: string): Promise<string> => {
  const prompt = `3D pixel art character, voxel style, isometric view, high quality, studio lighting, white background. Cute but glitchy. Description: ${description}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    }
  });

  // Iterate to find the image part
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Não foi possível gerar a imagem.");
};