
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Question, MONEY_LADDER, GUARANTEED_LEVELS } from './types';
import { generateQuestions } from './services/geminiService';
import { initAudio, playTick, playCorrect, playWrong, playTimeout, playPhoneRing } from './services/audioService';
import QuestionBoard from './components/QuestionBoard';
import MoneyTree from './components/MoneyTree';
import Lifelines from './components/Lifelines';
import { Trophy, RefreshCw, AlertTriangle, Play, BrainCircuit, Phone, Clock, User } from 'lucide-react';

// Configuration for phone jokers by contestant
const CONTESTANT_CONFIG: Record<string, { phoneFriendName: string | null }> = {
  "rukiye": { phoneFriendName: "Gülsüm Yaşar" },
  "ayşenur": { phoneFriendName: "Erfan Kaptan" },
  "aysenur": { phoneFriendName: "Erfan Kaptan" },
  "roz": { phoneFriendName: "Zelal Ateş" },
  "leyla": { phoneFriendName: null },
  "rabia": { phoneFriendName: null }
};

const App: React.FC = () => {
  const [contestantName, setContestantName] = useState("");
  const [phoneContact, setPhoneContact] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [phoneTimer, setPhoneTimer] = useState<number | null>(null); // New state for phone call duration
  const [activeMoneyLadder, setActiveMoneyLadder] = useState<number[]>([]);
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    questions: [],
    status: 'IDLE',
    winnings: 0,
    lifelines: { fiftyFifty: true, phoneAFriend: true, askTheAudience: true },
    audienceData: null,
    friendMessage: null,
    selectedAnswer: null,
    isAnswerConfirmed: false,
    isAnswerCorrect: null
  });
  
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // Main Game Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    // Timer only runs if PLAYING, answer not confirmed, AND phone timer is NOT active
    if (gameState.status === 'PLAYING' && !gameState.isAnswerConfirmed && phoneTimer === null) {
      if (timer > 0) {
        interval = setTimeout(() => {
          setTimer(prev => {
            const newVal = prev - 1;
            playTick(newVal); // Play "tick" or "tock" every second
            return newVal;
          });
        }, 1000);
      } else {
        // Time is up!
        playTimeout();
        handleWrongAnswer();
      }
    }
    
    return () => clearTimeout(interval);
  }, [timer, gameState.status, gameState.isAnswerConfirmed, phoneTimer]);

  // Phone Joker Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    if (phoneTimer !== null && phoneTimer > 0) {
      interval = setTimeout(() => {
        setPhoneTimer(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (phoneTimer === 0) {
      // Phone call ended
      setPhoneTimer(null);
      setGameState(prev => ({ ...prev, friendMessage: null })); // Close the phone UI
    }

    return () => clearTimeout(interval);
  }, [phoneTimer]);

  const startGame = async () => {
    if (!contestantName.trim()) {
      alert("Lütfen isminizi giriniz!");
      return;
    }

    const normalizedName = contestantName.toLowerCase().trim();
    const config = CONTESTANT_CONFIG[normalizedName];
    
    // Determine phone friend availability
    const hasPhoneFriend = config ? config.phoneFriendName !== null : true; // Default true for others
    const friendName = config ? config.phoneFriendName : "Arkadaş";
    
    setPhoneContact(friendName);

    initAudio(); 
    setGameState(prev => ({ ...prev, status: 'LOADING' }));
    
    const questions = await generateQuestions(contestantName);
    const fullAscendingLadder = [...MONEY_LADDER].reverse(); 
    setActiveMoneyLadder(fullAscendingLadder);

    setGameState({
      currentQuestionIndex: 0,
      questions,
      status: 'PLAYING',
      winnings: 0,
      lifelines: { 
        fiftyFifty: true, 
        phoneAFriend: hasPhoneFriend, // Disabled for Leyla/Rabia
        askTheAudience: true 
      },
      audienceData: null,
      friendMessage: null,
      selectedAnswer: null,
      isAnswerConfirmed: false,
      isAnswerCorrect: null
    });
    setHiddenOptions([]);
    setTimer(30);
    setPhoneTimer(null);
  };

  const handleSelectOption = (index: number) => {
    if (gameState.status !== 'PLAYING') return;
    setGameState(prev => ({ ...prev, selectedAnswer: index }));
  };

  const confirmAnswer = () => {
    if (gameState.selectedAnswer === null) return;
    
    setGameState(prev => ({ ...prev, isAnswerConfirmed: true }));

    const currentQ = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedAnswer === currentQ.correctAnswerIndex;

    // Delay for dramatic effect
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isAnswerCorrect: isCorrect }));
      if (isCorrect) playCorrect();
      else playWrong();

      setTimeout(() => {
        if (isCorrect) {
          handleCorrectAnswer();
        } else {
          handleWrongAnswer();
        }
      }, 2000); 
    }, 1500); 
  };

  const handleCorrectAnswer = () => {
    const maxIndex = gameState.questions.length - 1;
    
    if (gameState.currentQuestionIndex === maxIndex) {
      setGameState(prev => ({ 
        ...prev, 
        status: 'VICTORY', 
        winnings: activeMoneyLadder[maxIndex]
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      selectedAnswer: null,
      isAnswerConfirmed: false,
      isAnswerCorrect: null,
      friendMessage: null,
      audienceData: null
    }));
    setHiddenOptions([]);
    setTimer(30); 
    setPhoneTimer(null);
  };

  const handleWrongAnswer = () => {
    let finalWinnings = 0;
    const reachedIndex = gameState.currentQuestionIndex; 
    
    const achievedSafeIndex = GUARANTEED_LEVELS
      .filter(levelIdx => levelIdx < reachedIndex && levelIdx < activeMoneyLadder.length)
      .pop();
      
    if (achievedSafeIndex !== undefined) {
      finalWinnings = activeMoneyLadder[achievedSafeIndex];
    } else {
      finalWinnings = 0;
    }

    setGameState(prev => ({
      ...prev,
      status: 'GAME_OVER',
      winnings: finalWinnings
    }));
  };

  const withdraw = () => {
    const amount = gameState.currentQuestionIndex > 0 
      ? activeMoneyLadder[gameState.currentQuestionIndex - 1] 
      : 0;

    setGameState(prev => ({
      ...prev,
      status: 'GAME_OVER',
      winnings: amount
    }));
  };

  // --- Lifelines ---

  const useFiftyFifty = () => {
    const currentQ = gameState.questions[gameState.currentQuestionIndex];
    const correct = currentQ.correctAnswerIndex;
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
    
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0], shuffled[1]]);

    setGameState(prev => ({
      ...prev,
      lifelines: { ...prev.lifelines, fiftyFifty: false }
    }));
  };

  const useAskAudience = () => {
    const currentQ = gameState.questions[gameState.currentQuestionIndex];
    const correct = currentQ.correctAnswerIndex;
    
    const difficulty = currentQ.difficulty || 5;
    const correctChance = Math.max(30, 90 - (difficulty * 4)); 
    
    const remaining = 100 - correctChance;
    let others = [0, 0, 0];
    
    let r1 = Math.floor(Math.random() * remaining);
    let r2 = Math.floor(Math.random() * (remaining - r1));
    let r3 = remaining - r1 - r2;
    others = [r1, r2, r3];
    
    const percentages = [0, 0, 0, 0];
    percentages[correct] = correctChance;
    
    let otherIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i !== correct) {
        percentages[i] = others[otherIdx++];
      }
    }

    setGameState(prev => ({
      ...prev,
      audienceData: percentages,
      lifelines: { ...prev.lifelines, askTheAudience: false }
    }));
  };

  const usePhoneFriend = () => {
    if (!phoneContact) return;

    // 1. Play Ring Sound
    playPhoneRing();

    // 2. Set UI to "Calling..."
    setGameState(prev => ({
      ...prev,
      lifelines: { ...prev.lifelines, phoneAFriend: false },
      friendMessage: "Aranıyor..."
    }));

    // 3. Wait 3 seconds, then "Pickup" and start 20s timer
    setTimeout(() => {
      setGameState(prev => ({ ...prev, friendMessage: "Bağlandı" }));
      setPhoneTimer(20);
    }, 3000);
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // --- Renders ---

  if (gameState.status === 'IDLE') {
    return (
      <div className="min-h-screen honeycomb-gradient flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-20 rounded-full"></div>
          <h1 className="relative text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-yellow-800 tracking-wider drop-shadow-sm uppercase" style={{textShadow: '0 4px 10px rgba(0,0,0,0.5)'}}>
            WER WIRD<br/>MILLIONÄR?
          </h1>
        </div>
        
        <div className="bg-black/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm max-w-md w-full">
          <div className="mb-6 text-left">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
              Yarışmacı İsmi
            </label>
            <div className="flex items-center bg-gray-900 border border-gray-600 rounded-lg overflow-hidden focus-within:border-[#d4af37] transition-colors">
              <div className="pl-3 text-gray-500">
                <User size={20} />
              </div>
              <input
                id="username"
                type="text"
                value={contestantName}
                onChange={(e) => setContestantName(e.target.value)}
                placeholder="İsminizi girin (Örn: Rukiye, Ayşenur...)"
                className="w-full bg-transparent text-white px-4 py-3 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              (Rukiye, Ayşenur, Rabia, Leyla, Roz)
            </p>
          </div>

          <button 
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 border border-blue-400 text-white font-bold text-xl rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Play size={24} /> SPIEL STARTEN
          </button>
        </div>
      </div>
    );
  }

  if (gameState.status === 'LOADING') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#d4af37] animate-pulse text-xl">Sorular Hazırlanıyor: {contestantName}</p>
      </div>
    );
  }

  if (gameState.status === 'GAME_OVER' || gameState.status === 'VICTORY') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        {gameState.status === 'VICTORY' ? (
          <Trophy size={80} className="text-yellow-400 mb-6 animate-bounce" />
        ) : (
          <AlertTriangle size={80} className="text-red-500 mb-6" />
        )}
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          {gameState.status === 'VICTORY' ? 'TEBRİKLER MİLYONER!' : 'YARIŞMA BİTTİ'}
        </h2>
        <p className="text-gray-400 text-xl">{contestantName}</p>
        
        <div className="text-2xl md:text-4xl text-[#d4af37] font-mono font-bold my-6 p-4 border-2 border-[#d4af37] rounded-xl bg-gray-900/50">
          Kazanılan Ödül: € {gameState.winnings.toLocaleString()}
        </div>

        <button 
          onClick={() => {
            setGameState(prev => ({ ...prev, status: 'IDLE' }));
            setTimer(30);
            setContestantName("");
            setPhoneContact(null);
            setPhoneTimer(null);
          }}
          className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={20} /> Yeniden Oyna
        </button>
      </div>
    );
  }

  const currentQ = gameState.questions[gameState.currentQuestionIndex];
  
  let timerColor = "text-white border-white";
  if (timer <= 10) timerColor = "text-red-500 border-red-500 animate-pulse";
  else if (timer <= 20) timerColor = "text-yellow-500 border-yellow-500";

  return (
    <div ref={topRef} className="min-h-screen honeycomb-gradient text-white flex flex-col md:flex-row overflow-hidden relative">
      
      {/* --- Sidebar (Money Tree) --- */}
      <div className="order-2 md:order-2 w-full md:w-80 bg-black/40 border-l border-gray-800 p-4 flex flex-col justify-between z-20">
        <div className="hidden md:flex flex-col items-center mb-6">
           <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-black rounded-full border-2 border-[#d4af37] flex items-center justify-center shadow-lg mb-2">
             <BrainCircuit className="text-[#d4af37]" size={40} />
           </div>
           <p className="text-[#d4af37] font-bold uppercase tracking-widest">{contestantName}</p>
        </div>
        
        <MoneyTree 
          currentQuestionIndex={gameState.currentQuestionIndex} 
          moneyLadder={activeMoneyLadder}
        />
        
        <div className="mt-4 md:mt-auto pt-4 border-t border-gray-700">
           <button 
             onClick={withdraw}
             disabled={gameState.isAnswerConfirmed}
             className="w-full py-2 bg-red-900/50 hover:bg-red-900 border border-red-500 rounded text-red-200 text-sm uppercase tracking-widest font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
           >
             AUSSTEIGEN
           </button>
        </div>
      </div>

      {/* --- Main Game Area --- */}
      <div className="order-1 md:order-1 flex-1 flex flex-col p-4 relative">
        
        {/* Top Bar: Lifelines & Timer */}
        <div className="flex flex-col items-center justify-center mb-4 md:mb-8 pt-4">
           
           <div className="w-full flex justify-between items-start px-4 md:px-12 max-w-5xl">
             <Lifelines 
               lifelines={gameState.lifelines} 
               onUseLifeline={(type) => {
                 if (type === 'fiftyFifty') useFiftyFifty();
                 if (type === 'askTheAudience') useAskAudience();
                 if (type === 'phoneAFriend') usePhoneFriend();
               }}
               disabled={gameState.isAnswerConfirmed || phoneTimer !== null}
             />

             {/* Timer UI */}
             <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 bg-black/50 ${timerColor} transition-colors duration-300 shadow-lg`}>
                <span className="text-2xl md:text-3xl font-black font-mono">{timer}</span>
                <Clock size={16} className="absolute -top-2 -right-2 bg-black rounded-full" />
             </div>
           </div>
           
           {/* Active Lifeline Info Panels */}
           <div className="min-h-[80px] w-full max-w-2xl text-center mt-4">
             {/* Phone Friend Msg */}
             {gameState.friendMessage && (
               <div className="bg-blue-900/90 border border-blue-400 p-4 rounded-lg animate-fade-in mx-auto shadow-xl flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                   {/* Profile Avatar */}
                   <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                     {phoneContact ? getInitials(phoneContact) : "?"}
                   </div>
                   <div className="text-left">
                     <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">Telefon Hattında</p>
                     <p className="text-white font-bold text-lg">{phoneContact || "Arkadaş"}</p>
                     <p className="text-yellow-400 text-sm animate-pulse font-bold">{gameState.friendMessage}</p>
                   </div>
                 </div>
                 
                 {/* Phone Timer Display */}
                 {phoneTimer !== null && (
                   <div className="flex flex-col items-center justify-center">
                     <div className="text-4xl font-mono font-black text-white drop-shadow-lg">
                       {phoneTimer}
                     </div>
                     <span className="text-xs text-blue-300 uppercase">Saniye</span>
                   </div>
                 )}
               </div>
             )}
             
             {/* Audience Stats */}
             {gameState.audienceData && (
               <div className="bg-purple-900/90 border border-purple-400 p-3 rounded-lg animate-fade-in mx-auto flex justify-center gap-4 items-end h-24">
                  {gameState.audienceData.map((pct, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-8">
                      <span className="text-xs font-bold text-purple-200">{pct}%</span>
                      <div className="w-full bg-purple-700 rounded-t" style={{height: `${pct}%`}}></div>
                      <span className="text-xs font-bold text-white">{['A','B','C','D'][i]}</span>
                    </div>
                  ))}
               </div>
             )}
           </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex items-center justify-center pb-8 md:pb-12">
          <QuestionBoard 
            question={currentQ}
            selectedAnswer={gameState.selectedAnswer}
            isAnswerConfirmed={gameState.isAnswerConfirmed}
            isAnswerCorrect={gameState.isAnswerCorrect}
            onSelectOption={handleSelectOption}
            hiddenOptions={hiddenOptions}
          />
        </div>

        {/* Bottom Control */}
        <div className="flex justify-center h-20">
          {gameState.selectedAnswer !== null && !gameState.isAnswerConfirmed && (
            <button 
              onClick={confirmAnswer}
              className="px-12 py-3 bg-[#d4af37] hover:bg-yellow-500 text-black text-xl font-bold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-bounce"
            >
              Endgültige Entscheidung
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
