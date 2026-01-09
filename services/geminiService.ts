
import { GoogleGenAI, Type } from "@google/genai";
import { UserState, MarketData } from "../types";

export const getGeminiResponse = async (
  prompt: string,
  userState: UserState,
  marketData: MarketData[]
) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const systemInstruction = `
    You are the CoinWise AI Assistant, a specialized financial agent for a paper trading platform.
    Help users learn about crypto trading, explain market concepts, and answer questions about their account.
    
    Current User Data:
    - Name: ${userState.name}
    - Account ID: ${userState.accountId}
    - Cash Balance: $${userState.balance.toFixed(2)}
    - Assets: ${userState.assets.map(a => `${a.amount} ${a.symbol}`).join(', ') || 'No assets yet'}
    
    Current Market Prices:
    ${marketData.map(m => `- ${m.symbol}: $${m.price.toLocaleString()} (${m.change24h}% 24h)`).join('\n')}

    Rules:
    - Keep answers professional yet encouraging for beginners.
    - If asked about their balance or holdings, use the "Current User Data" provided above.
    - Explain technical terms (like "long/short", "volatility", "OHLC") simply.
    - Do not give actual financial advice; remind them this is a simulation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later!";
  }
};
