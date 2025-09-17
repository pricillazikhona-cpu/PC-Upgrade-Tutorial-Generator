import React, { useState, useCallback } from 'react';
import type { PCParts, TutorialResponse } from './types';
import { generateUpgradeTutorial } from './services/geminiService';
import PartSelector from './components/PartSelector';
import TutorialDisplay from './components/TutorialDisplay';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import ComponentGlossary from './components/ComponentGlossary';

const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const App: React.FC = () => {
  const [tutorial, setTutorial] = useState<TutorialResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const handleGenerateTutorial = useCallback(async (currentParts: PCParts, newParts: PCParts) => {
    setIsLoading(true);
    setError(null);
    setTutorial(null);

    const hasNewParts = Object.values(newParts).some(part => part.trim() !== '');
    if (!hasNewParts) {
        setError("Please add at least one new component to your 'New PC' build to generate an upgrade guide.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await generateUpgradeTutorial(currentParts, newParts);
      setTutorial(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans antialiased">
      {isGlossaryOpen && <ComponentGlossary onClose={() => setIsGlossaryOpen(false)} />}
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="text-center mb-6">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 border border-gray-600 transition-colors"
            >
              <HelpIcon className="w-5 h-5" />
              New to PC building? Start here.
            </button>
        </div>
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <PartSelector
            onGenerate={handleGenerateTutorial}
            isLoading={isLoading}
          />
          
          <div className="mt-12 lg:mt-0">
             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">Your Upgrade Guide</h2>
             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 min-h-[400px] border border-gray-700 shadow-lg">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorAlert message={error} />}
                {!isLoading && !error && (
                  <TutorialDisplay tutorialResponse={tutorial} />
                )}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;