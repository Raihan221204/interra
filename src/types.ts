export enum AppState {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  PAYMENT = 'PAYMENT',
  DESIGNERS = 'DESIGNERS',
}

export interface FurnitureItem {
  id: string;
  productName: string;
  estimatedPrice: string;
  description: string;
  box_2d?: number[]; // [ymin, xmin, ymax, xmax] on 0-1000 scale
  thumbnail?: string; // base64
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DesignRequest {
  image: File | null;
  preferences: string;
  selectedStyles: string[];
}

export interface Designer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  hourlyRate: number;
  imageUrl: string;
}