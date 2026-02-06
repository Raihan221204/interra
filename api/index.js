import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const { action, image, prompt } = req.body;
  
  // Pastikan API Key terbaca
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server Error: API Key missing" });

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    let resultData;

    // --- 1. GENERATE ---
    if (action === 'generate') {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
      const result = await model.generateContent([
        { inlineData: { data: image, mimeType: "image/jpeg" } },
        `Redesign this room interior. ${prompt}. Maintain structural perspective. High quality, photorealistic 4k.`,
      ]);
      resultData = result.response.text(); 
    }

    // --- 2. ANALYZE ---
    else if (action === 'analyze') {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro", 
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
                  items: { type: SchemaType.INTEGER }, 
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

    // --- 3. EDIT (BARU) ---
    else if (action === 'edit') {
       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
       const result = await model.generateContent([
        { inlineData: { data: image, mimeType: "image/jpeg" } },
        `Edit this image: ${prompt}. Keep the rest exactly the same.`,
      ]);
      resultData = result.response.text(); 
    }

    return res.status(200).json({ success: true, data: resultData });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}