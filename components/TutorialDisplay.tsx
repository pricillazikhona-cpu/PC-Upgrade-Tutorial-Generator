
import React, { useState } from 'react';
import type { TutorialResponse } from '../types';

interface TutorialDisplayProps {
  tutorialResponse: TutorialResponse | null;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const PdfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
    </svg>
);

const TxtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 2a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H6zm1 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2V10a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const TutorialDisplay: React.FC<TutorialDisplayProps> = ({ tutorialResponse }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleExportPDF = () => {
    if (!tutorialResponse) return;

    // @ts-ignore - jspdf is loaded from a script tag in index.html
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const { warnings, tutorial } = tutorialResponse;

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let y = margin;

    const checkPageBreak = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PC Upgrade Guide", pageWidth / 2, y, { align: "center" });
    y += 15;
    
    // Warnings
    if (warnings && warnings.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(200, 0, 0); // Red color for warnings
        doc.text("Compatibility Warnings", margin, y);
        y += 8;
        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        warnings.forEach(warning => {
            const lines = doc.splitTextToSize(`• ${warning}`, pageWidth - (margin * 2));
            checkPageBreak(lines.length * 5 + 2);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 2;
        });
        y += 10;
    }

    // Tutorial Steps
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    checkPageBreak(10);
    doc.text("Upgrade Steps", margin, y);
    y += 10;
    
    tutorial.forEach(item => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const titleText = `${item.step}. ${item.title}`;
        const titleLines = doc.splitTextToSize(titleText, pageWidth - (margin * 2));
        checkPageBreak(titleLines.length * 6 + 10);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 6;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const detailLines = doc.splitTextToSize(item.details, pageWidth - (margin * 2));
        checkPageBreak(detailLines.length * 5 + 5);
        doc.text(detailLines, margin, y);
        y += detailLines.length * 5 + 8;
    });


    doc.save("pc-upgrade-guide.pdf");
  };

  const handleExportTXT = () => {
    if (!tutorialResponse) return;
    const { warnings, tutorial } = tutorialResponse;

    let content = "PC Upgrade Guide\n";
    content += "=====================\n\n";

    if (warnings && warnings.length > 0) {
        content += "COMPATIBILITY WARNINGS:\n";
        content += "------------------------\n";
        warnings.forEach(warning => {
            content += `- ${warning}\n`;
        });
        content += "\n";
    }

    content += "UPGRADE STEPS:\n";
    content += "----------------\n";
    tutorial.forEach(item => {
        content += `\nStep ${item.step}: ${item.title}\n\n`;
        content += `${item.details}\n\n`;
        content += "----------------\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pc-upgrade-guide.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, step: number) => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not available.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStep(step);
      setTimeout(() => {
        setCopiedStep(null);
      }, 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };


  if (!tutorialResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <InfoIcon />
        <p className="mt-2 text-lg">Your personalized PC upgrade guide will appear here.</p>
        <p className="text-sm">Fill in your components and click "Generate" to start.</p>
      </div>
    );
  }
  
  const { warnings, tutorial } = tutorialResponse;

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-end gap-3">
             <button
                onClick={handleExportTXT}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-lg transition-colors duration-200"
                aria-label="Export tutorial as plain text"
            >
                <TxtIcon />
                Export as TXT
            </button>
             <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-lg transition-colors duration-200"
                aria-label="Export tutorial as PDF"
            >
                <PdfIcon />
                Export as PDF
            </button>
        </div>

        {warnings && warnings.length > 0 && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg shadow-md" role="alert">
                <div className="flex">
                    <WarningIcon />
                    <div>
                        <p className="font-bold">Compatibility Warnings</p>
                        <ul className="mt-2 list-disc list-inside text-sm">
                            {warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )}

      <ol className="relative border-l border-gray-700 ml-4">
        {tutorial.map((item) => (
          <li key={item.step} className="mb-10 ml-8">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-900 rounded-full -left-4 ring-4 ring-gray-800 text-blue-300">
              {item.step}
            </span>
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-300 flex-1">{item.title}</h3>
                    <button
                        onClick={() => handleCopy(item.details, item.step)}
                        className="flex-shrink-0 inline-flex items-center px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700/80 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all"
                        aria-label={`Copy instructions for step ${item.step}`}
                    >
                        {copiedStep === item.step ? (
                        <>
                            <CheckIcon />
                            Copied!
                        </>
                        ) : (
                        <>
                            <CopyIcon />
                            Copy
                        </>
                        )}
                    </button>
                </div>
                <p className="text-base font-normal text-gray-400 whitespace-pre-wrap">{item.details}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TutorialDisplay;