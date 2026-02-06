import React, { useState } from 'react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [mode, setMode] = useState<'slider' | 'side-by-side'>('slider');

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setMode('slider')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'slider' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Slider View
          </button>
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'side-by-side' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {mode === 'slider' ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden select-none group border border-gray-200">
          {/* Background Image (Before - Your Room) */}
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-10">
            Your Room
          </div>

          {/* Foreground Image (After - Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={afterImage}
              alt="After"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100vw', maxWidth: '100%' }} // Ensure inner image is full width of container
            />
          </div>
          <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-10">
            Interra Design
          </div>

          {/* Slider Handle */}
          <div
            className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Invisible Range Input for Interaction */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-gray-200">
            <img src={beforeImage} alt="Your Room" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-white font-bold">Your Room</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group border border-gray-200">
            <img src={afterImage} alt="Interra Design" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                <span className="text-white font-bold">Interra Design</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};