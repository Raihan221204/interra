import React, { useEffect, useState } from 'react';
import { FurnitureItem } from '../types';
import { analyzeRoomFurniture, editRoomDesign } from '../services/geminiService';
import { ImageComparison } from './ImageComparison';
import { InteractiveImage } from './InteractiveImage';

interface ResultsSectionProps {
  onHire: () => void;
  onPurchase: (item: FurnitureItem) => void;
  originalImageFile: File | null;
  generatedImageBase64: string | null;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  onHire, 
  onPurchase, 
  originalImageFile, 
  generatedImageBase64 
}) => {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(generatedImageBase64);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  
  // View Mode
  const [viewMode, setViewMode] = useState<'interactive' | 'comparison'>('interactive');
  
  // Interaction State
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Edit State
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initial load logic
  useEffect(() => {
    const init = async () => {
      try {
        if (originalImageFile) {
            setOriginalImageUrl(URL.createObjectURL(originalImageFile));
        }

        if (generatedImageBase64) {
          // Analyze the AI generated image
          const furniture = await analyzeRoomFurniture(generatedImageBase64);
          setItems(furniture);
        }
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setAnalyzing(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImageFile, generatedImageBase64]);

  const handleEditImage = async () => {
    if (!editPrompt.trim() || !currentImageBase64) return;
    
    setIsEditing(true);
    try {
      const newImageBase64 = await editRoomDesign(currentImageBase64, editPrompt);
      if (newImageBase64) {
        setCurrentImageBase64(newImageBase64);
        setEditPrompt(""); 
        // Re-analyze items on edit? Optional, but better user exp to keep old items or clear. 
        // For prototype speed, we'll keep items but they might be misaligned.
        // Ideally, we re-run analysis:
        setAnalyzing(true);
        const furniture = await analyzeRoomFurniture(newImageBase64);
        setItems(furniture);
        setAnalyzing(false);
      }
    } catch (e) {
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('interactive')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'interactive' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Interactive View
          </button>
          <button 
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'comparison' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Before & After
          </button>
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">
           {viewMode === 'interactive' ? 'Click highlighted objects to shop' : 'Compare with original room'}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Left Column: Visuals */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
            {currentImageBase64 ? (
               viewMode === 'interactive' ? (
                 <InteractiveImage 
                    imageBase64={currentImageBase64}
                    items={items}
                    onItemClick={onPurchase}
                    hoveredItemId={hoveredItemId}
                    setHoveredItemId={setHoveredItemId}
                 />
               ) : (
                 <ImageComparison 
                    beforeImage={originalImageUrl || "https://placehold.co/800x600?text=Original+Not+Found"} 
                    afterImage={`data:image/jpeg;base64,${currentImageBase64}`} 
                 />
               )
            ) : (
              <div className="aspect-video bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
                Image generation failed or pending...
              </div>
            )}
             {isEditing && (
              <div className="mt-2 text-center text-primary text-sm font-medium animate-pulse">
                 Applying changes to design...
              </div>
            )}
          </div>

          {/* AI Editor */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditImage()}
                placeholder='Editor: e.g. "Add a large plant in the corner" or "Change rug to blue"'
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              <button 
                onClick={handleEditImage}
                disabled={isEditing || !editPrompt}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isEditing ? 'Editing...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Products List */}
        <div className="xl:col-span-1 flex flex-col h-full">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-gray-900">Shop the Look</h3>
            <span className="text-sm text-gray-500">{items.length} items found</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[600px] xl:max-h-[800px]">
            {analyzing ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl border border-gray-100 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              items.map((item, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`flex gap-4 p-3 bg-white rounded-xl border transition-all duration-200 cursor-pointer
                    ${hoveredItemId === item.id 
                      ? 'border-primary shadow-md ring-1 ring-primary bg-primary/5' 
                      : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
                >
                   {/* Thumbnail Image */}
                   <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                     {item.thumbnail ? (
                       <img src={`data:image/jpeg;base64,${item.thumbnail}`} alt={item.productName} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                       </div>
                     )}
                   </div>

                   {/* Content */}
                   <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.productName}</h4>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded whitespace-nowrap">{item.estimatedPrice}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                      </div>
                      
                      <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onPurchase(item);
                          }}
                          className={`mt-2 w-full py-1.5 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5
                            ${hoveredItemId === item.id 
                              ? 'bg-primary text-white hover:bg-primary-hover' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                          Purchase Item
                      </button>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2">
            <button 
              onClick={onHire}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-black transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Hire Designer for Execution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};