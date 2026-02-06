import React from 'react';
import { Designer } from '../types';

interface DesignerListingProps {
  onBack: () => void;
}

const MOCK_DESIGNERS: Designer[] = [
  {
    id: '1',
    name: "Elena Rodriguez",
    specialty: "Minimalist & Modern",
    rating: 4.9,
    hourlyRate: 120,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '2',
    name: "Kai Chen",
    specialty: "Industrial & Urban",
    rating: 4.8,
    hourlyRate: 150,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '3',
    name: "Sarah Jenkins",
    specialty: "Bohemian & Eclectic",
    rating: 4.7,
    hourlyRate: 95,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: '4',
    name: "Marcus Thorne",
    specialty: "Mid-Century Modern",
    rating: 5.0,
    hourlyRate: 200,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

export const DesignerListing: React.FC<DesignerListingProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Design
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Top Rated Designers</h2>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_DESIGNERS.map((designer) => (
          <div key={designer.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="aspect-square overflow-hidden bg-gray-100">
               <img src={designer.imageUrl} alt={designer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-gray-900">{designer.name}</h3>
                 <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded text-xs font-bold text-yellow-700">
                    <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {designer.rating}
                 </div>
               </div>
               <p className="text-gray-500 text-sm mb-4">{designer.specialty}</p>
               <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">${designer.hourlyRate}/hr</span>
                  <button 
                    onClick={() => alert(`Booking request sent to ${designer.name}!`)}
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    Book Now
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};