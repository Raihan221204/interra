// src/services/geminiService.ts
import { FurnitureItem } from "../types"; // Pastikan path types.ts benar

// --- HELPER FUNCTIONS (Jalan di Browser) ---

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Hapus prefix data url biar bersih saat dikirim
      resolve(base64String.split(',')[1] || base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fungsi Crop dipindah ke sini biar gak error di server
const cropImage = async (base64Image: string, box: number[]): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.width;
      const height = img.height;
      
      // box is [ymin, xmin, ymax, xmax] on 0-1000 scale
      const [ymin, xmin, ymax, xmax] = box;
      
      const y = (ymin / 1000) * height;
      const x = (xmin / 1000) * width;
      const h = ((ymax - ymin) / 1000) * height;
      const w = ((xmax - xmin) / 1000) * width;
      
      canvas.width = w;
      canvas.height = h;
      
      const ctx = canvas.getContext('2d');
      if(ctx) {
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg').split(',')[1]);
      } else {
        resolve("");
      }
    };
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
};

// --- MAIN FUNCTIONS (Panggil API /api/index) ---

export const generateRoomDesign = async (base64Image: string, prompt: string): Promise<string> => {
  // Panggil Backend kita sendiri, bukan Google langsung
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'generate', 
      image: base64Image, 
      prompt 
    }),
  });

  const json = await response.json();
  if (!json.success) throw new Error(json.error);
  return json.data; 
};

export const analyzeRoomFurniture = async (base64Image: string): Promise<FurnitureItem[]> => {
  // 1. Minta data koordinat ke Backend
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'analyze', 
      image: base64Image 
    }),
  });

  const json = await response.json();
  if (!json.success) throw new Error(json.error);

  const items: FurnitureItem[] = json.data;

  // 2. Lakukan Cropping Thumbnail di Sini (Browser)
  const processedItems = await Promise.all(items.map(async (item, index) => {
    const itemWithId = { ...item, id: item.id || `item-${index}` };
    
    // Kalau ada koordinat box, kita crop gambarnya sekarang
    if (item.box_2d && item.box_2d.length === 4) {
       const thumbnail = await cropImage(base64Image, item.box_2d);
       return { ...itemWithId, thumbnail };
    }
    return itemWithId;
  }));

  return processedItems;
};