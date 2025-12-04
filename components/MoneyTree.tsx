import React from 'react';
import { GUARANTEED_LEVELS } from '../types';

interface MoneyTreeProps {
  currentQuestionIndex: number; // 0 to N-1
  moneyLadder: number[]; // Array of amounts
}

const MoneyTree: React.FC<MoneyTreeProps> = ({ currentQuestionIndex, moneyLadder }) => {
  // moneyLadder is passed in normal order (ascending) usually, but visual needs reversed.
  // App.tsx passes it in ascending order (500 -> 1M).
  // We need to display highest at top.
  
  const reversedLadder = [...moneyLadder].reverse();

  return (
    <div className="bg-black/80 border-2 border-[#d4af37] rounded-lg p-4 w-full md:w-64 max-h-[40vh] md:max-h-full overflow-y-auto">
      <ul className="flex flex-col gap-1">
        {reversedLadder.map((amount, index) => {
          // Total levels
          const totalLevels = reversedLadder.length;
          // Current visual row index 'index' goes from 0 to totalLevels-1
          // Level number: (totalLevels - index)
          const level = totalLevels - index; 
          
          // The index in the questions array (0-based) corresponding to this level
          const questionIdx = level - 1; 
          
          const isActive = questionIdx === currentQuestionIndex;
          const isPassed = questionIdx < currentQuestionIndex;
          
          // Check if this level is a guaranteed level 
          // (Safe Havens are typically Q3 and Q6 if length permits)
          // We can use the global constant for indices, but bounded by current ladder length
          const isGuaranteed = GUARANTEED_LEVELS.includes(questionIdx);

          let textColor = "text-yellow-600";
          if (isActive) textColor = "text-black";
          else if (isPassed) textColor = "text-green-500";
          else if (isGuaranteed) textColor = "text-white";

          let bgClass = "bg-transparent";
          if (isActive) bgClass = "bg-[#d4af37] animate-pulse";

          return (
            <li 
              key={index} 
              className={`flex justify-between items-center px-2 py-1 rounded ${bgClass} ${textColor} font-bold font-mono text-sm md:text-base`}
            >
              <span className={isActive ? "text-black" : "text-yellow-500"}>{level}</span>
              <span>€ {amount.toLocaleString()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyTree;