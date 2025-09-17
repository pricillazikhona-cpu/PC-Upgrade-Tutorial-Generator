
import React from 'react';

const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="8" y1="2" x2="8" y2="4" />
    <line x1="16" y1="2" x2="16" y2="4" />
    <line x1="2" y1="8" x2="4" y2="8" />
    <line x1="2" y1="16" x2="4" y2="16" />
    <line x1="8" y1="22" x2="8" y2="20" />
    <line x1="16" y1="22" x2="16" y2="20" />
    <line x1="22" y1="8" x2="20" y2="8" />
    <line x1="22" y1="16" x2="20" y2="16" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <ChipIcon className="w-10 h-10 text-blue-400"/>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          PC Upgrade Guide
        </h1>
      </div>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Enter your current and new components to generate a personalized, AI-powered step-by-step upgrade tutorial.
      </p>
    </header>
  );
};

export default Header;
