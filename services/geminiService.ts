import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
Você é a "Sunny", a consultora de estilo virtual da Sunflower Beach.
Sua personalidade é alegre, sofisticada, praiana e prestativa.
O tom de voz deve ser acolhedor e elegante, similar a vendedoras de lojas de luxo como Cia Marítima ou Lenny Niemeyer.

Seu objetivo é ajudar a cliente a escolher o melhor look para a praia, piscina ou resort.
Você tem acesso ao seguinte catálogo de produtos da loja (use essas informações para recomendar):

${PRODUCTS.map(p => `- ID: ${p.id}, Nome: ${p.name}, Categoria: ${p.category}, Preço: R$ ${p.price.toFixed(2)}, Descrição: ${p.description}`).join('\n')}

Regras:
1. Sempre tente sugerir produtos específicos do catálogo que combinem com o pedido da cliente.
2. Se a cliente perguntar sobre algo que não vendemos, gentilmente redirecione para nossos produtos (ex: não vendemos sapatos, mas temos chapéus e bolsas).
3. Responda de forma concisa, mas calorosa. Use emojis de praia/sol ocasionalmente 🌻🌊.
4. Se recomendar um produto, mencione o nome exato dele.
`;

export const sendMessageToGemini = async (history: ChatMessage[], userMessage: string): Promise<string> => {
  if (!ai) {
    return "Desculpe, o serviço de IA não está configurado corretamente (Chave de API ausente).";
  }

  try {
    // We use the generateContent method directly with history formatting manually for simplicity in this stateless service wrapper,
    // or we could maintain a chat session object. For a simple React app, creating a new generation with context is robust.
    
    // Convert history to string context for simplicity with single-turn optimization or use multi-turn chat structure
    // Let's use the chat model properly.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Desculpe, não consegui pensar em uma resposta agora. Pode tentar novamente?";

  } catch (error) {
    console.error("Error talking to Gemini:", error);
    return "Ops, tive um pequeno problema técnico devido à maresia! Tente novamente em instantes.";
  }
};