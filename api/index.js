// api/index.js
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export default async function handler(req, res) {
  // Cek method harus POST
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { action, image, prompt } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY; // Ambil dari Vercel Environment

  if (!apiKey) return res.status(500).json({ error: "API Key belum disetting di Vercel" });

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    let resultData;

    // --- CASE 1: GENERATE / REDESIGN ---
    if (action === 'generate') {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" }); // Cek nama model terbaru
      const result = await model.generateContent([
        { inlineData: { data: image, mimeType: "image/jpeg" } },
        `Redesign this room interior. ${prompt}. Maintain structural perspective. High quality, photorealistic 4k.`,
      ]);
      resultData = result.response.text(); // Biasanya base64 atau URL
    }

    // --- CASE 2: ANALYZE FURNITURE ---
    else if (action === 'analyze') {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro", // Gunakan model yg kuat logic vision-nya
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.STRING },
                productName: { type: SchemaType.STRING },
                estimatedPrice: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                box_2d: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.INTEGER }, // [ymin, xmin, ymax, xmax]
                },
              },
              required: ["productName", "estimatedPrice", "box_2d"],
            },
          },
        },
      });

      const result = await model.generateContent([
        { inlineData: { data: image, mimeType: "image/jpeg" } },
        "Analyze this room. Detect 5 main furniture items. Return JSON with box_2d [ymin, xmin, ymax, xmax] (0-1000 scale).",
      ]);
      
      resultData = JSON.parse(result.response.text());
    } 

    return res.status(200).json({ success: true, data: resultData });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}