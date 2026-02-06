import { User } from "../types";

const STORAGE_KEY = 'interra_user_session';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    
    const user: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0], // Derive name from email for prototype
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, password: string): Promise<User> => {
    // For this prototype, signup and login perform the same action
    return authService.login(email, password);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};