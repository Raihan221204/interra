import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsSection } from './components/ResultsSection';
import { AuthModal } from './components/AuthModal';
import { PaymentPage } from './components/PaymentPage';
import { DesignerListing } from './components/DesignerListing';
import { AppState, User, FurnitureItem } from './types';
import { authService } from './services/authService';
import { fileToBase64, generateRoomDesign } from './services/geminiService';

function App() {
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Selection State
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleGenerate = async (prefs: string, file: File) => {
    setOriginalFile(file);
    setState(AppState.GENERATING);

    try {
      // 1. Convert file to base64
      const base64Input = await fileToBase64(file);
      
      // 2. Generate new design
      const newDesignBase64 = await generateRoomDesign(base64Input, prefs);
      setGeneratedImage(newDesignBase64);
      
      // 3. Show results
      setState(AppState.RESULTS);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate design. Please try again.");
      setState(AppState.INPUT);
    }
  };

  const handleHire = () => {
    // Direct navigation, no auth check
    setState(AppState.DESIGNERS);
  };

  const handlePurchase = (item: FurnitureItem) => {
    // Direct navigation, no auth check
    setSelectedProduct(item);
    setState(AppState.PAYMENT);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setState(AppState.INPUT);
    setOriginalFile(null);
    setGeneratedImage(null);
  };

  const navigateHome = () => {
    setState(AppState.INPUT);
    setOriginalFile(null);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onLogoClick={navigateHome}
      />
      
      <main className="w-full">
        {state === AppState.INPUT && (
          <div className="animate-fade-in">
             <InputSection onGenerate={handleGenerate} />
          </div>
        )}

        {state === AppState.GENERATING && (
          <div className="animate-fade-in pt-12">
            <LoadingScreen />
          </div>
        )}

        {state === AppState.RESULTS && (
          <div className="animate-fade-in">
            <ResultsSection 
              onHire={handleHire} 
              onPurchase={handlePurchase}
              originalImageFile={originalFile}
              generatedImageBase64={generatedImage}
            />
          </div>
        )}

        {state === AppState.PAYMENT && (
          <div className="animate-fade-in">
             <PaymentPage 
                item={selectedProduct} 
                onBack={() => setState(AppState.RESULTS)} 
             />
          </div>
        )}

        {state === AppState.DESIGNERS && (
          <div className="animate-fade-in">
             <DesignerListing 
                onBack={() => setState(AppState.RESULTS)}
             />
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </div>
  );
}

export default App;