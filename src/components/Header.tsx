import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onLogoClick }) => {
  return (
    <header className="w-full py-6 px-8 flex justify-between items-center border-b border-gray-100 bg-white sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={onLogoClick}
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Interra</h1>
      </div>
      
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <span className="hover:text-primary cursor-pointer">Portfolio</span>
          <span className="hover:text-primary cursor-pointer">Designers</span>
        </nav>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Hi, <span className="font-semibold">{user.name}</span>
            </div>
            <button 
              onClick={onLogoutClick}
              className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};