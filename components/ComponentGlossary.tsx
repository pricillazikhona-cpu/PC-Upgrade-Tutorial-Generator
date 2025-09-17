import React, { useState } from 'react';
import type { ComponentType } from '../types';

// Using the same icons from PartSelector for consistency
const CpuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 0-2 2v2H8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h-2a2 2 0 0 0-2-2v-2H8a2 2 0 0 0-2-2H4a2 2 0 0 0-2-2v-2a2 2 0 0 0 2-2h2V8a2 2 0 0 0 2-2h2V4a2 2 0 0 0 2-2zm-2 6h4v4h-4V8z"/></svg>
);
const GpuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M2 7h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm17.586-4.414L15 7.172V4a1 1 0 1 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2h-3.172l4.586-4.586a1 1 0 1 0-1.414-1.414z"/></svg>
);
const RamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M2 6h20v12H2V6zm2 2v8h2V8H4zm4 0v8h2V8H8zm4 0v8h2V8h-2zm4 0v8h2V8h-2z"/></svg>
);
const MotherboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M4 2h16v20H4V2zm2 2v2h2V4H6zm4 0v2h2V4h-2zm4 0v2h2V4h-2zM6 8v2h2V8H6zm0 4v2h2v-2H6zm0 4v2h2v-2H6zm4-4v8h8v-8h-8z"/></svg>
);
const StorageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v4H4V4zm0 6h16v10H4V10zm2 2v2h2v-2H6z"/></svg>
);
const PsuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm14 5h-4v2h4V8zm-6 0H8v2h4V8zm2 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM5 18h14v-7H5v7z" /></svg>
);
const OsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v10H4V5zm0 12h5v-2H4v2zm7 0h9v-2h-9v2zM4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4z"/></svg>
);
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

interface GlossaryItem {
    id: ComponentType;
    name: string;
    fullName: string;
    description: string;
    sample: string;
    imageUrl: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const glossaryData: GlossaryItem[] = [
    {
        id: 'cpu',
        name: 'CPU',
        fullName: 'Central Processing Unit',
        description: 'The "brain" of the computer. It performs all the calculations and instructions that make your computer work. A faster CPU can run programs and games more smoothly.',
        sample: 'A small, square chip, often with gold contacts or pins on the bottom. It sits in a special socket on the motherboard.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Intel_Core_i7-4790K_top_view.jpg/320px-Intel_Core_i7-4790K_top_view.jpg',
        icon: CpuIcon,
    },
    {
        id: 'gpu',
        name: 'GPU',
        fullName: 'Graphics Processing Unit',
        description: 'The "artist" of the computer. It creates the images, videos, and animations you see on your screen. A powerful GPU is essential for modern gaming and video editing.',
        sample: 'A large rectangular card with one or more cooling fans. It plugs into a long slot on the motherboard.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ASUS_GeForce_RTX_2080_Ti_ROG_Strix_OC_%2848666320092%29.jpg/320px-ASUS_GeForce_RTX_2080_Ti_ROG_Strix_OC_%2848666320092%29.jpg',
        icon: GpuIcon,
    },
    {
        id: 'ram',
        name: 'RAM',
        fullName: 'Random Access Memory',
        description: 'The computer\'s "short-term memory." It temporarily holds data that your computer is actively using, allowing for fast access. More RAM lets you run more applications at once without slowdowns.',
        sample: 'Long, thin sticks with small black memory chips on them. They snap into long slots on the motherboard.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DDR4_RAM_modules.jpg/320px-DDR4_RAM_modules.jpg',
        icon: RamIcon,
    },
    {
        id: 'motherboard',
        name: 'Motherboard',
        fullName: '',
        description: 'The "nervous system" of the computer. It\'s a large circuit board that connects all the components together, allowing them to communicate with each other and work as a single system.',
        sample: 'The largest circuit board in your PC case. It has many slots, ports, and connectors for all your other components.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Asus_Prime_Z390-P_motherboard_for_Intel_processors.jpg/320px-Asus_Prime_Z390-P_motherboard_for_Intel_processors.jpg',
        icon: MotherboardIcon,
    },
    {
        id: 'storage',
        name: 'Storage',
        fullName: 'SSD or HDD',
        description: 'The "long-term memory" of the computer. It stores all your files, applications, and the operating system (like Windows or macOS), even when the power is off.',
        sample: 'Can be a small, flat rectangle (SATA SSD), a small stick that mounts directly to the motherboard (NVMe SSD), or a thicker, heavier box (HDD).',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Samsung_960_EVO_250_GB_M.2-NVMe-SSD_Z3253.jpg/320px-Samsung_960_EVO_250_GB_M.2-NVMe-SSD_Z3253.jpg',
        icon: StorageIcon,
    },
    {
        id: 'psu',
        name: 'PSU',
        fullName: 'Power Supply Unit',
        description: 'The "heart" of the computer. It takes electricity from your wall outlet and converts it into the correct voltages to power all the components inside your PC.',
        sample: 'A metal box, usually located at the bottom or top rear of the PC case, with a fan and a large bundle of cables coming out of it.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Corsair_RM750x_power_supply_unit.jpg/320px-Corsair_RM750x_power_supply_unit.jpg',
        icon: PsuIcon,
    },
    {
        id: 'os',
        name: 'OS',
        fullName: 'Operating System',
        description: 'The "manager" of the computer. It\'s the main software that runs on a computer, managing all the hardware and other software. It provides the user interface you interact with.',
        sample: 'This is the software interface you see, like the Windows desktop with its Start Menu and icons, or the macOS desktop with its Dock.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_11_Desktop_Screen.png/320px-Windows_11_Desktop_Screen.png',
        icon: OsIcon,
    }
];

const GlossaryItemCard: React.FC<{ item: GlossaryItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-700 rounded-lg bg-gray-800/50">
            <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`glossary-content-${item.id}`}
            >
                <div className="flex items-center gap-4">
                    <item.icon className="w-8 h-8 text-blue-400" />
                    <div>
                        <h4 className="text-lg font-bold text-gray-200">{item.name}</h4>
                        {item.fullName && <p className="text-sm text-gray-400">{item.fullName}</p>}
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div
                id={`glossary-content-${item.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-gray-700">
                    <p className="text-gray-300 mb-4">{item.description}</p>
                    <div className="bg-gray-700/50 p-3 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                         <img 
                            src={item.imageUrl} 
                            alt={`Example of a ${item.name}`} 
                            className="w-full h-auto object-cover rounded-md col-span-1 md:col-span-1"
                            loading="lazy"
                         />
                         <div className="md:col-span-2">
                             <p className="text-sm font-semibold text-gray-200">What it looks like:</p>
                             <p className="text-sm text-gray-400 mt-1">{item.sample}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ComponentGlossaryProps {
    onClose: () => void;
}

const ComponentGlossary: React.FC<ComponentGlossaryProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        PC Component Guide
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    {glossaryData.map(item => <GlossaryItemCard key={item.id} item={item} />)}
                </div>
                 <div className="p-4 border-t border-gray-700 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComponentGlossary;