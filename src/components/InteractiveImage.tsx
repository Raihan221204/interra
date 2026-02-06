import React, { useState } from 'react';
import { FurnitureItem } from '../types';

interface InteractiveImageProps {
  imageBase64: string;
  items: FurnitureItem[];
  onItemClick: (item: FurnitureItem) => void;
  hoveredItemId?: string | null;
  setHoveredItemId: (id: string | null) => void;
}

export const InteractiveImage: React.FC<InteractiveImageProps> = ({ 
  imageBase64, 
  items, 
  onItemClick,
  hoveredItemId,
  setHoveredItemId
}) => {
  // We use this state to ensure image is loaded before showing boxes
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden group border border-gray-200 shadow-sm bg-gray-100">
      <img 
        src={`data:image/jpeg;base64,${imageBase64}`} 
        alt="Interactive Room Design" 
        className="w-full h-auto object-cover block"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Overlay Layer */}
      {isLoaded && items.map((item) => {
        if (!item.box_2d) return null;
        
        // Convert 0-1000 scale to percentage
        const [ymin, xmin, ymax, xmax] = item.box_2d;
        const top = ymin / 10;
        const left = xmin / 10;
        const height = (ymax - ymin) / 10;
        const width = (xmax - xmin) / 10;

        const isHovered = hoveredItemId === item.id;

        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(item);
            }}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            className={`absolute cursor-pointer transition-all duration-300 border-2 
              ${isHovered 
                ? 'border-white bg-primary/20 shadow-[0_0_15px_rgba(255,97,49,0.5)] z-20' 
                : 'border-transparent hover:border-white/50 bg-transparent z-10'
              }`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {/* Price Tag Tooltip on Hover */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 -top-10 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-opacity duration-200 pointer-events-none
                ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}
            >
              {item.productName} • {item.estimatedPrice}
            </div>

            {/* Pulsing indicator dot in center if not hovered */}
            {!isHovered && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full animate-ping pointer-events-none" />
            )}
            {!isHovered && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm pointer-events-none" />
            )}
          </div>
        );
      })}
      
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
         Click highlighted items to purchase
      </div>
    </div>
  );
};