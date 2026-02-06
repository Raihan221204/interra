import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 2 seconds approx total

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-4">
      <div className="w-full max-w-xs relative h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Reimagining your space...
      </h2>
      <p className="text-gray-500 text-center animate-pulse">
        Applying style preferences and optimizing layout.
      </p>
    </div>
  );
};