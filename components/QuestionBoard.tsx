import React from 'react';
import { Question } from '../types';

interface QuestionBoardProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswerConfirmed: boolean;
  isAnswerCorrect: boolean | null; // null if not yet revealed
  onSelectOption: (index: number) => void;
  hiddenOptions: number[]; // Indices of options hidden by 50/50
}

const QuestionBoard: React.FC<QuestionBoardProps> = ({ 
  question, 
  selectedAnswer, 
  isAnswerConfirmed, 
  isAnswerCorrect, 
  onSelectOption,
  hiddenOptions
}) => {
  
  const getOptionClass = (index: number) => {
    if (hiddenOptions.includes(index)) return "opacity-0 pointer-events-none";

    let baseClass = "relative w-full p-4 md:p-6 text-left border-2 rounded-xl flex items-center gap-4 transition-all duration-200 group ";
    
    // Logic for colors
    if (isAnswerConfirmed && isAnswerCorrect !== null) {
      // Reveal phase
      if (index === question.correctAnswerIndex) {
        // Correct answer always flashes green at end
        return baseClass + "bg-green-600 border-white animate-pulse shadow-[0_0_20px_rgba(0,255,0,0.6)]";
      }
      if (index === selectedAnswer && selectedAnswer !== question.correctAnswerIndex) {
        // Wrong selection
        return baseClass + "bg-red-900/80 border-red-500";
      }
    } else if (index === selectedAnswer) {
      // Selected but not confirmed (orange)
      return baseClass + "bg-yellow-600 border-white text-black font-bold";
    }

    // Default state
    return baseClass + "bg-blue-950/80 border-[#d4af37] hover:bg-blue-900 cursor-pointer";
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto z-10">
      {/* Question Box */}
      <div className="relative bg-blue-950 border-4 border-[#d4af37] rounded-2xl p-6 md:p-10 text-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-full border-l-2 border-[#d4af37]/30"></div>
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-full border-r-2 border-[#d4af37]/30"></div>
        <h2 className="text-xl md:text-3xl font-bold text-white leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !isAnswerConfirmed && onSelectOption(idx)}
            disabled={isAnswerConfirmed || hiddenOptions.includes(idx)}
            className={getOptionClass(idx)}
          >
            <span className={`text-xl font-bold ${selectedAnswer === idx ? 'text-black' : 'text-[#d4af37]'}`}>
              {letters[idx]}:
            </span>
            <span className={`text-lg md:text-xl ${selectedAnswer === idx ? 'text-black' : 'text-white'}`}>
              {option}
            </span>
            
            {/* Horizontal Line deco */}
            <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-white/20"></div>
            <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-white/20"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionBoard;