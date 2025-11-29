import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: Ideally this runs on a backend to protect the key, but for this demo/prototype
// we are calling it from the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!productName) return "";

  try {
    const prompt = `
      Eres un experto joyero para la marca de lujo "Accesorios El Duende".
      Escribe una descripción corta, elegante y técnica (máximo 30 palabras) para un producto llamado: "${productName}".
      Incluye posibles materiales (oro, plata, piedras preciosas) de forma creativa pero realista.
      Tono: Sofisticado, mágico, exclusivo.
      Idioma: Español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("No se pudo generar la descripción con IA.");
  }
};
