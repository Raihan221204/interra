import React, { useState, useRef } from 'react';

interface InputSectionProps {
  onGenerate: (preferences: string, file: File) => void;
}

const DESIGN_STYLES = [
  "Modern Minimalist",
  "Bohemian Chic",
  "Scandinavian",
  "Industrial",
  "Mid-Century Modern",
  "Coastal/Hamptons",
  "Japandi",
  "Art Deco"
];

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate }) => {
  const [preferences, setPreferences] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = () => {
    if (file) {
      // Combine styles with text preferences
      const styleString = selectedStyles.length > 0 ? `Styles: ${selectedStyles.join(', ')}. ` : '';
      const finalPrompt = `${styleString}${preferences}`;
      onGenerate(finalPrompt || "Modern Minimalist", file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Redesign your room in seconds.</h2>
        <p className="text-lg text-gray-500">Upload a photo, choose your vibe, and let AI do the rest.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center aspect-[4/3] cursor-pointer transition-colors ${preview ? 'border-primary border-solid p-0 overflow-hidden' : 'border-gray-200 hover:border-primary/50 bg-gray-50'}`}
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative w-full h-full group">
              <img src={preview} alt="Room Preview" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                 <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Upload current room</p>
              <p className="text-sm text-gray-500 mt-1">JPG or PNG up to 10MB</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>

        {/* Preferences & Action */}
        <div className="flex flex-col h-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Style(s)
          </label>
          <div className="flex flex-wrap gap-2 mb-6">
            {DESIGN_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedStyles.includes(style)
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Specific Requests
          </label>
          <textarea
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-gray-700 bg-white shadow-sm mb-8"
            placeholder="E.g., I want to keep the sofa but change the rug. Make it feel warmer."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={!file}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 mt-auto ${
              file 
                ? 'bg-primary text-white hover:bg-primary-hover transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Generate Design
          </button>
        </div>
      </div>
    </div>
  );
};