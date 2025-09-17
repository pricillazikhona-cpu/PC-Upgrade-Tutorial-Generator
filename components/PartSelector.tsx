import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { PCParts, ComponentType } from '../types';

// --- TYPE DEFINITIONS ---
const ItemTypes = {
  COMPONENT: 'component',
};

const LOCAL_STORAGE_KEY = 'pcBuilderConfig';

// --- PREDEFINED COMPONENT OPTIONS ---
const componentOptions: Record<ComponentType, string[]> = {
  cpu: [
    'Intel Core i5 (8th-10th Gen)',
    'Intel Core i7 (8th-10th Gen)',
    'AMD Ryzen 5 (2000-3000 series)',
    'AMD Ryzen 7 (2000-3000 series)',
  ],
  motherboard: [
    'Intel B-series Chipset (DDR4)',
    'Intel Z-series Chipset (DDR4)',
    'AMD B-series Chipset (DDR4)',
    'AMD X-series Chipset (DDR4)',
  ],
  ram: [
    '8GB DDR4',
    '16GB DDR4',
    '32GB DDR4',
  ],
  gpu: [
    'NVIDIA GeForce GTX 10-series',
    'NVIDIA GeForce RTX 20-series',
    'AMD Radeon RX 500/5000-series',
  ],
  storage: [
    'SATA SSD',
    'NVMe M.2 SSD',
    'Hard Disk Drive (HDD)',
  ],
  psu: [
    '550W PSU',
    '650W PSU',
    '750W PSU',
    '850W PSU',
  ],
  os: [
    'Windows 10',
    'Windows 11',
    'Linux (e.g., Ubuntu)',
    'macOS (Hackintosh)',
  ],
};

const newComponentOptions: Record<ComponentType, string[]> = {
  cpu: [
    'Intel Core i5 (12th-14th Gen)',
    'Intel Core i7 (12th-14th Gen)',
    'Intel Core i9 (12th-14th Gen)',
    'AMD Ryzen 5 (5000-7000 series)',
    'AMD Ryzen 7 (5000-7000 series)',
    'AMD Ryzen 9 (5000-7000 series)',
  ],
  motherboard: [
    'Intel B-series Chipset (DDR5)',
    'Intel Z-series Chipset (DDR5)',
    'AMD B-series Chipset (DDR5)',
    'AMD X-series Chipset (DDR5)',
  ],
  ram: [
    '16GB DDR5',
    '32GB DDR5',
    '64GB DDR5',
  ],
  gpu: [
    'NVIDIA GeForce RTX 30-series',
    'NVIDIA GeForce RTX 40-series',
    'NVIDIA GeForce RTX 4080',
    'NVIDIA GeForce RTX 4090',
    'AMD Radeon RX 6000-series',
    'AMD Radeon RX 7000-series',
    'AMD Radeon RX 7900 XT',
    'AMD Radeon RX 7900 XTX',
  ],
  storage: [
    '1TB NVMe M.2 SSD',
    '2TB NVMe M.2 SSD',
    '4TB NVMe M.2 SSD',
    'High-Capacity SATA SSD (2TB+)',
  ],
  psu: [
    '750W Gold PSU',
    '850W Gold PSU',
    '1000W Gold/Platinum PSU',
    '1200W+ Platinum PSU',
  ],
  os: [
    'Windows 11 (Fresh Install)',
    'Linux (e.g., Ubuntu 24.04)',
    'Dual Boot Setup (Windows/Linux)',
  ],
};

// --- SVG ICONS (as components) ---
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
const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2zM5 16V5h10v11H5z" />
        <path d="M12 6H8a1 1 0 00-1 1v3a1 1 0 001 1h4a1 1 0 001-1V7a1 1 0 00-1-1z" />
    </svg>
);
const LoadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
);


const componentData: { type: ComponentType; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { type: 'cpu', name: 'CPU', icon: CpuIcon },
  { type: 'motherboard', name: 'Motherboard', icon: MotherboardIcon },
  { type: 'ram', name: 'RAM', icon: RamIcon },
  { type: 'gpu', name: 'GPU', icon: GpuIcon },
  { type: 'storage', name: 'Storage', icon: StorageIcon },
  { type: 'psu', name: 'PSU', icon: PsuIcon },
  { type: 'os', name: 'Operating System', icon: OsIcon },
];

// --- MODAL COMPONENT ---
const PartSelectionModal = ({ isOpen, onClose, onSubmit, buildType, componentType }) => {
  const [name, setName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setName('');
      setSelectedValue('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const isCurrentBuild = buildType === 'current';
  const options = (isCurrentBuild ? componentOptions[componentType] : newComponentOptions[componentType]) || [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (value !== 'other') {
      setName(value);
    } else {
      setName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      onClose();
    }
  };

  const renderForm = () => (
    <>
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors mb-3"
      >
        <option value="" disabled>Select a component...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        <option value="other">Other (Please specify)</option>
      </select>
      {(selectedValue === 'other' || options.length === 0) && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isCurrentBuild ? "e.g., Intel Core i9-9900K" : "e.g., NVIDIA GeForce RTX 4070"}
          autoFocus
          className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-white">
          {isCurrentBuild ? `Select Your Current ${componentType.toUpperCase()}` : `Select Your New ${componentType.toUpperCase()}`}
        </h3>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- DRAG-AND-DROP COMPONENTS ---
const ComponentCard = ({ type, name, icon: Icon }) => {
  // Fix: Use an explicit ref to resolve react-dnd typing issues with React's ref prop.
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(ref);
  return (
    <div ref={ref} className={`flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-grab transition-all ${isDragging ? 'opacity-50 scale-105' : 'hover:bg-gray-700/80 hover:border-blue-500'}`}>
      <Icon className="w-6 h-6 text-blue-400" />
      <span className="font-semibold text-gray-300">{name}</span>
    </div>
  );
};

const ComponentSlot = ({ buildType, type, name, onDrop, onRemove, onClick, icon: Icon }) => {
  // Fix: Use an explicit ref to resolve react-dnd typing issues with React's ref prop.
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: { type: ComponentType }) => onDrop(buildType, item.type),
    canDrop: (item: { type: ComponentType }) => item.type === type && !name,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [buildType, type, name]);
  drop(ref);

  const getBorderColor = () => {
    if (isOver && canDrop) return 'border-green-500';
    if (isOver && !canDrop) return 'border-red-500';
    return 'border-gray-700';
  };

  if (name) {
    return (
      <div className="relative flex items-center gap-3 h-16 p-3 rounded-lg bg-gray-700/60 border border-gray-600 shadow-inner cursor-pointer hover:border-blue-400" onClick={() => onClick(buildType, type)}>
        <Icon className="w-8 h-8 text-blue-300 flex-shrink-0" />
        <p className="text-sm text-gray-200 truncate" title={name}>{name}</p>
        <button onClick={(e) => { e.stopPropagation(); onRemove(buildType, type);}} className="absolute top-1 right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-400 hover:bg-red-500 hover:text-white">X</button>
      </div>
    );
  }

  const componentName = componentData.find(c => c.type === type)?.name;

  return (
    <div 
        ref={ref} 
        className={`flex items-center justify-center h-16 p-3 rounded-lg bg-gray-800/50 border-2 border-dashed ${getBorderColor()} transition-colors`}
        title={componentName ? `Drop ${componentName} here` : 'Component slot'}
    >
      <Icon className="w-8 h-8 text-gray-500" />
    </div>
  );
};

// --- COMPATIBILITY CHECKING ---
const CompatibilityWarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.008-1.742 3.008H4.42c-1.522 0-2.492-1.674-1.742-3.008l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const CompatibilityWarnings = ({ warnings }: { warnings: string[] }) => {
    if (warnings.length === 0) return null;

    return (
        <div className="mt-3 space-y-2">
            {warnings.map((warning, index) => (
                <div key={index} role="alert" className="flex items-start text-sm bg-yellow-900/40 border border-yellow-700/50 text-yellow-200 px-3 py-2 rounded-md">
                    <CompatibilityWarningIcon />
                    <span>{warning}</span>
                </div>
            ))}
        </div>
    );
};

const checkCompatibility = (build: Map<ComponentType, string>): string[] => {
    const warnings: string[] = [];
    const cpu = build.get('cpu');
    const motherboard = build.get('motherboard');
    const ram = build.get('ram');
    const gpu = build.get('gpu');
    const psu = build.get('psu');

    // CPU / Motherboard Socket Compatibility
    if (cpu && motherboard) {
        const isIntelCpu = /intel/i.test(cpu);
        const isAmdCpu = /amd/i.test(cpu);
        const isIntelMobo = /intel/i.test(motherboard);
        const isAmdMobo = /amd/i.test(motherboard);
        if (isIntelCpu && isAmdMobo) {
            warnings.push("Intel CPU is likely incompatible with an AMD motherboard chipset.");
        }
        if (isAmdCpu && isIntelMobo) {
            warnings.push("AMD CPU is likely incompatible with an Intel motherboard chipset.");
        }
    }

    // RAM / Motherboard DDR Version Compatibility
    if (ram && motherboard) {
        const isDdr5Ram = /ddr5/i.test(ram);
        const isDdr4Ram = /ddr4/i.test(ram);
        const isDdr5Mobo = /ddr5/i.test(motherboard);
        const isDdr4Mobo = /ddr4/i.test(motherboard);
        if (isDdr5Ram && isDdr4Mobo) {
            warnings.push("DDR5 RAM is not compatible with a DDR4 motherboard.");
        }
        if (isDdr4Ram && isDdr5Mobo) {
            warnings.push("DDR4 RAM is not compatible with a DDR5 motherboard.");
        }
    }
    
    // GPU / PSU Wattage Recommendation
    if (gpu && psu) {
        const isHighEndGpu = /rtx (30|40)\d{2}|rx (6|7)\d{3}/i.test(gpu);
        const isLowWattPsu = /550w|650w/i.test(psu);
        if(isHighEndGpu && isLowWattPsu) {
            warnings.push("A high-end GPU may require a higher wattage PSU (750W+) for stable performance.");
        }
    }

    return warnings;
}


// --- MAIN BUILDER COMPONENT ---
interface VisualBuilderProps {
  onGenerate: (current: PCParts, neu: PCParts) => void;
  isLoading: boolean;
}

const PartSelector: React.FC<VisualBuilderProps> = ({ onGenerate, isLoading }) => {
  const [currentBuild, setCurrentBuild] = useState<Map<ComponentType, string>>(new Map());
  const [newBuild, setNewBuild] = useState<Map<ComponentType, string>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ buildType: 'current' | 'new', componentType: ComponentType } | null>(null);

  const [currentBuildWarnings, setCurrentBuildWarnings] = useState<string[]>([]);
  const [newBuildWarnings, setNewBuildWarnings] = useState<string[]>([]);
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [hasSavedData, setHasSavedData] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    setHasSavedData(!!savedConfig);
    if (savedConfig) {
      try {
        const { current, new: newConfig } = JSON.parse(savedConfig);
        if (current && Array.isArray(current)) {
          setCurrentBuild(new Map(current));
        }
        if (newConfig && Array.isArray(newConfig)) {
          setNewBuild(new Map(newConfig));
        }
      } catch (e) {
        console.error("Failed to parse saved build configuration:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setHasSavedData(false);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentBuildWarnings(checkCompatibility(currentBuild));
  }, [currentBuild]);

  useEffect(() => {
    setNewBuildWarnings(checkCompatibility(newBuild));
  }, [newBuild]);

  const handleDrop = (buildType: 'current' | 'new', componentType: ComponentType) => {
    setModalData({ buildType, componentType });
    setIsModalOpen(true);
  };
  
  const handleSlotClick = (buildType: 'current' | 'new', componentType: ComponentType) => {
    setModalData({ buildType, componentType });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (partName: string) => {
    if (modalData && partName) {
      const { buildType, componentType } = modalData;
      const setter = buildType === 'current' ? setCurrentBuild : setNewBuild;
      setter(prev => new Map(prev).set(componentType, partName));
    }
    setIsModalOpen(false);
    setModalData(null);
  };
  
  const handleRemove = (buildType: 'current' | 'new', componentType: ComponentType) => {
      const setter = buildType === 'current' ? setCurrentBuild : setNewBuild;
      setter(prev => {
          const newMap = new Map(prev);
          newMap.delete(componentType);
          return newMap;
      });
  };

  const handleGenerateClick = () => {
    const toPCParts = (build: Map<ComponentType, string>): PCParts => ({
        cpu: build.get('cpu') || '',
        gpu: build.get('gpu') || '',
        ram: build.get('ram') || '',
        motherboard: build.get('motherboard') || '',
        storage: build.get('storage') || '',
        psu: build.get('psu') || '',
        os: build.get('os') || '',
    });
    onGenerate(toPCParts(currentBuild), toPCParts(newBuild));
  };
  
  const handleSave = () => {
    const config = {
      current: Array.from(currentBuild.entries()),
      new: Array.from(newBuild.entries()),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    setHasSavedData(true);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLoad = () => {
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedConfig) {
      const { current, new: newConfig } = JSON.parse(savedConfig);
      setCurrentBuild(new Map(current));
      setNewBuild(new Map(newConfig));
    }
  };

  const renderBuildArea = (title: string, buildType: 'current' | 'new', build: Map<ComponentType, string>, warnings: string[]) => (
     <div>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">{title}</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
           <div className="space-y-3">
             {componentData.map(({ type, name, icon }) => (
              <ComponentSlot key={`${buildType}-${type}`} buildType={buildType} type={type} name={build.get(type)} onDrop={handleDrop} onRemove={handleRemove} onClick={handleSlotClick} icon={icon} />
             ))}
           </div>
           <CompatibilityWarnings warnings={warnings} />
        </div>
      </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <PartSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit} 
        buildType={modalData?.buildType} 
        componentType={modalData?.componentType}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">Component Library</h2>
              <div className="space-y-3">
                  {componentData.map(c => <ComponentCard key={c.type} {...c} />)}
              </div>
          </div>
          <div className="md:col-span-2 space-y-6">
              {renderBuildArea('1. Your Current PC', 'current', currentBuild, currentBuildWarnings)}
              {renderBuildArea('2. Your New PC', 'new', newBuild, newBuildWarnings)}
               <div className="space-y-3">
                  <button onClick={handleGenerateClick} disabled={isLoading} className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generating...
                        </>
                    ) : 'Generate Upgrade Tutorial'}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleSave} className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                          <SaveIcon className="w-5 h-5 mr-2" />
                          {saveStatus === 'saved' ? 'Saved!' : 'Save Build'}
                      </button>
                      <button onClick={handleLoad} disabled={!hasSavedData} className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                          <LoadIcon className="w-5 h-5 mr-2" />
                          Load Build
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </DndProvider>
  );
};

export default PartSelector;