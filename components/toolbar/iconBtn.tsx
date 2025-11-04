
import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, isActive = false, tooltip }) => {
  const activeClasses = isActive 
    ? 'bg-blue-500/30 text-blue-400 shadow-[0_0_15px_5px_rgba(96,165,250,0.4)]' 
    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-blue-400 hover:shadow-[0_0_15px_5px_rgba(96,165,250,0.2)]';

  return (
    <div className="relative group flex items-center">
      <button
        onClick={onClick}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${activeClasses}`}
      >
        {children}
      </button>
       <div className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
};

export default IconButton;
