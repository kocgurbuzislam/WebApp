import React from 'react';
import { Users, Phone, Scissors } from 'lucide-react';

interface LifelinesProps {
  lifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askTheAudience: boolean;
  };
  onUseLifeline: (type: 'fiftyFifty' | 'phoneAFriend' | 'askTheAudience') => void;
  disabled: boolean;
}

const Lifelines: React.FC<LifelinesProps> = ({ lifelines, onUseLifeline, disabled }) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={() => onUseLifeline('fiftyFifty')}
        disabled={!lifelines.fiftyFifty || disabled}
        className={`relative group flex flex-col items-center justify-center w-16 h-12 md:w-20 md:h-16 rounded-full border-2 transition-all duration-300
          ${!lifelines.fiftyFifty ? 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed' : 'border-[#d4af37] bg-blue-900 hover:bg-blue-800 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.5)]'}
        `}
        title="%50"
      >
        <Scissors size={24} className={lifelines.fiftyFifty ? 'text-[#d4af37]' : 'text-gray-500'} />
        {!lifelines.fiftyFifty && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full h-0.5 bg-red-600 rotate-45 absolute" />
             <div className="w-full h-0.5 bg-red-600 -rotate-45 absolute" />
          </div>
        )}
      </button>

      <button
        onClick={() => onUseLifeline('phoneAFriend')}
        disabled={!lifelines.phoneAFriend || disabled}
        className={`relative group flex flex-col items-center justify-center w-16 h-12 md:w-20 md:h-16 rounded-full border-2 transition-all duration-300
          ${!lifelines.phoneAFriend ? 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed' : 'border-[#d4af37] bg-blue-900 hover:bg-blue-800 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.5)]'}
        `}
        title="Telefon Joker"
      >
        <Phone size={24} className={lifelines.phoneAFriend ? 'text-[#d4af37]' : 'text-gray-500'} />
         {!lifelines.phoneAFriend && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full h-0.5 bg-red-600 rotate-45 absolute" />
             <div className="w-full h-0.5 bg-red-600 -rotate-45 absolute" />
          </div>
        )}
      </button>

      <button
        onClick={() => onUseLifeline('askTheAudience')}
        disabled={!lifelines.askTheAudience || disabled}
        className={`relative group flex flex-col items-center justify-center w-16 h-12 md:w-20 md:h-16 rounded-full border-2 transition-all duration-300
          ${!lifelines.askTheAudience ? 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed' : 'border-[#d4af37] bg-blue-900 hover:bg-blue-800 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.5)]'}
        `}
        title="Seyirci Jokeri"
      >
        <Users size={24} className={lifelines.askTheAudience ? 'text-[#d4af37]' : 'text-gray-500'} />
         {!lifelines.askTheAudience && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full h-0.5 bg-red-600 rotate-45 absolute" />
             <div className="w-full h-0.5 bg-red-600 -rotate-45 absolute" />
          </div>
        )}
      </button>
    </div>
  );
};

export default Lifelines;