import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, Calendar, RotateCw, Scissors, HelpCircle, Sparkles, Award, Trophy, 
  Check, Play, AlertCircle, ShoppingCart, RefreshCw, Star, Heart, Flame
} from 'lucide-react';
import { User, QuizQuestion } from '../types';
import { INITIAL_QUIZ_QUESTIONS } from '../data/initialData';

/* ==========================================
   1. BONUS HUB OVERVIEW
   ========================================== */
interface BonusHubProps {
  isDarkMode: boolean;
  onSelectView: (view: string) => void;
}

export function BonusHub({ isDarkMode, onSelectView }: BonusHubProps) {
  const games = [
    { id: 'daily-reward', label: 'Daily Reward', desc: 'প্রতিদিন পুরস্কার নিন', icon: Calendar, color: 'from-amber-500 to-orange-500' },
    { id: 'spin-wheel', label: 'Spin Wheel', desc: 'চাকা ঘুরিয়ে জিতুন', icon: RotateCw, color: 'from-blue-500 to-cyan-500 animate-spin-slow' },
    { id: 'scratch-card', label: 'Scratch Card', desc: 'স্ক্র্যাচ করে জিতুন', icon: Scissors, color: 'from-pink-500 to-rose-500' },
    { id: 'quiz', label: 'Quiz', desc: 'প্রশ্নের উত্তর দিন', icon: HelpCircle, color: 'from-purple-500 to-indigo-500' },
    { id: 'mystery-box', label: 'Mystery Box', desc: 'রেফার করে খুলুন', icon: Sparkles, color: 'from-yellow-500 to-amber-500' },
    { id: 'vip-status', label: 'VIP Status', desc: 'বেশি আয় করুন', icon: Award, color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-slate-900 to-blue-950 border-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
      }`}>
        <Gift className="w-10 h-10 mx-auto text-yellow-400 mb-2 animate-bounce" />
        <h2 className="text-xl font-extrabold text-white">Bonus Hub</h2>
        <p className="text-xs opacity-85 mt-1">সবগুলো বোনাস গেম খেলে প্রতিদিন আরো বেশি টাকা আয় করুন!</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              onClick={() => onSelectView(game.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all hover:scale-[1.02] active:scale-95 ${
                isDarkMode ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/60' : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${game.color} text-white self-start`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100">{game.label}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{game.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Achievements link shortcut */}
      <button 
        onClick={() => onSelectView('achievements')}
        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all hover:bg-slate-800/40 ${
          isDarkMode ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200">Achievements Milestones</p>
            <p className="text-[10px] text-slate-400 mt-0.5">রেফার এবং টাস্ক মাইলস্টোন পূরণ করে অতিরিক্ত বোনাস ক্লেইম করুন।</p>
          </div>
        </div>
        <span className="text-blue-400 text-xs font-bold">Claim</span>
      </button>
    </div>
  );
}

/* ==========================================
   2. DAILY REWARD
   ========================================== */
interface DailyRewardProps {
  user: User;
  isDarkMode: boolean;
  onClaimDaily: () => { success: boolean; message: string; reward: number };
}

export function DailyRewardView({ user, isDarkMode, onClaimDaily }: DailyRewardProps) {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClaim = () => {
    const res = onClaimDaily();
    if (res.success) {
      setStatusMsg({ type: 'success', text: `${res.message} (You received ৳${res.reward.toFixed(2)} TK)` });
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const hasClaimedToday = user.lastDailyRewardClaimed 
    ? new Date(user.lastDailyRewardClaimed).toDateString() === new Date().toDateString()
    : false;

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-amber-955 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white'
      }`}>
        <Calendar className="w-12 h-12 mx-auto text-yellow-400 mb-2 animate-pulse" />
        <h2 className="text-lg font-black uppercase text-white">Daily Reward Check-In</h2>
        <p className="text-xs opacity-90 mt-1">প্রতিদিন ক্লিক করে বোনাস ব্যালেন্স সাথে সাথে যুক্ত করুন!</p>
      </div>

      {/* Streak indicators */}
      <div className={`p-4 rounded-2xl border ${
        isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" /> Current Streak
          </p>
          <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">{user.streak} Days Streak</span>
        </div>

        {/* 7 Day visual progress track */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayNum = i + 1;
            const isCompleted = user.streak >= dayNum;
            const isCurrent = (user.streak % 7) + 1 === dayNum;
            return (
              <div key={dayNum} className="space-y-1.5">
                <div className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                  isCompleted 
                    ? 'bg-orange-500 border-transparent text-white shadow-md shadow-orange-500/20' 
                    : isCurrent
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : `Day ${dayNum}`}
                </div>
                <p className="text-[9px] text-slate-400">৳০.১০-০.৫০</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Claim */}
      <div className="space-y-3">
        {statusMsg && (
          <div className={`p-3 rounded-lg text-xs font-bold border text-center ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {statusMsg.text}
          </div>
        )}

        <button
          disabled={hasClaimedToday}
          onClick={handleClaim}
          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 ${
            hasClaimedToday
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/15'
          }`}
          id="claim-daily-btn"
        >
          {hasClaimedToday ? 'Already Claimed Today' : 'Claim Daily Reward'}
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   3. SPIN WHEEL
   ========================================== */
interface SpinWheelProps {
  user: User;
  isDarkMode: boolean;
  onRewardUser: (amount: number, description: string) => void;
  onUseSpinToken: () => boolean;
}

export function SpinWheelView({ user, isDarkMode, onRewardUser, onUseSpinToken }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const segments = [
    { label: '0.10 TK', val: 0.10, color: 'bg-slate-700' },
    { label: '0.50 TK', val: 0.50, color: 'bg-blue-600' },
    { label: '0.30 TK', val: 0.30, color: 'bg-purple-600' },
    { label: '0.20 TK', val: 0.20, color: 'bg-slate-700' },
    { label: '0.40 TK', val: 0.40, color: 'bg-emerald-600' },
    { label: '0.15 TK', val: 0.15, color: 'bg-slate-700' },
    { label: '0.25 TK', val: 0.25, color: 'bg-yellow-600' },
    { label: '0.35 TK', val: 0.35, color: 'bg-slate-700' },
  ];

  const lastClaimed = user.lastBonusClaims?.['spin-wheel'];
  let isLocked = false;
  let countdownMsg = '';

  if (lastClaimed) {
    const lastClaimedDate = new Date(lastClaimed);
    const diffMs = Date.now() - lastClaimedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      isLocked = true;
      const hoursLeft = Math.floor(24 - diffHours);
      const minsLeft = Math.floor((24 - diffHours - hoursLeft) * 60);
      countdownMsg = `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় চাকা ঘুরাতে পারবেন না। আরও ${hoursLeft} ঘণ্টা ${minsLeft} মিনিট অপেক্ষা করুন।`;
    }
  }

  const handleSpin = () => {
    if (spinning || isLocked) return;
    setSpinResult(null);

    const tokenCount = user.spinTokens || 0;
    if (tokenCount < 1) {
      setSpinResult('আপনার কাছে কোনো চরকা টোকেন নেই! বন্ধুদের রেফার করে চরকা অর্জন করুন।');
      return;
    }

    const success = onUseSpinToken();
    if (!success) return;

    setSpinning(true);

    // Randomize winning index
    const winIndex = Math.floor(Math.random() * segments.length);
    const winningSegment = segments[winIndex];

    setTimeout(() => {
      setSpinning(false);
      onRewardUser(winningSegment.val, 'Spin wheel winning');
      setSpinResult(`অভিনন্দন! আপনি জিতেছেন ৳${winningSegment.label}`);
    }, 3000); // Spin rotation duration
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-blue-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
      }`}>
        <RotateCw className="w-12 h-12 mx-auto text-yellow-400 mb-2 animate-spin-slow" />
        <h2 className="text-lg font-black uppercase text-white">Interactive Spin Fortune Wheel</h2>
        <p className="text-xs opacity-90 mt-1">ভাগ্যের চাকা ঘুরিয়ে আকর্ষণীয় পুরষ্কার জিতে নিন!</p>
      </div>

      {/* Available Spin Tokens badge */}
      <div className={`p-4 rounded-2xl border flex justify-between items-center ${
        isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <RotateCw className="w-4 h-4 text-cyan-400" /> আপনার চরকা সংখ্যা:
        </p>
        <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full animate-pulse">
          {user.spinTokens || 0} টি
        </span>
      </div>

      {/* Wheel Spinner Board */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        <div className="relative w-44 h-44 rounded-full border-4 border-yellow-400 shadow-xl overflow-hidden flex items-center justify-center bg-slate-900">
          {/* Animated Rotate Container */}
          <motion.div 
            animate={spinning ? { rotate: [0, 1800] } : { rotate: 0 }}
            transition={spinning ? { duration: 3, ease: 'easeInOut' } : {}}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[10px] font-black"
          >
            {segments.slice(0, 4).map((seg, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center p-2 text-white border border-slate-800/10 ${seg.color}`}
              >
                {seg.label}
              </div>
            ))}
          </motion.div>

          {/* Core Indicator Dot */}
          <div className="absolute w-12 h-12 rounded-full bg-[#1e293b] border-2 border-yellow-400 flex items-center justify-center z-10 shadow-lg">
            <span className="text-[10px] font-black uppercase text-yellow-400">SPIN</span>
          </div>
        </div>

        {/* Needle pointer */}
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-yellow-400 -mt-2.5 z-20" />
      </div>

      <div className="space-y-3">
        {isLocked && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
            {countdownMsg}
          </div>
        )}

        {spinResult && (
          <div className={`p-3 border rounded-xl text-center text-xs font-bold ${
            spinResult.includes('অভিনন্দন') 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {spinResult}
          </div>
        )}

        <button
          disabled={spinning || isLocked}
          onClick={handleSpin}
          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 ${
            spinning || isLocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-blue-500/15'
          }`}
          id="spin-trigger-btn"
        >
          {spinning ? 'Spinning...' : isLocked ? 'Locked (24h Cooldown)' : 'Start Spinning (১ চরকা)'}
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   4. SCRATCH CARD
   ========================================== */
interface ScratchCardProps {
  user: User;
  isDarkMode: boolean;
  onRewardUser: (amount: number, description: string) => void;
}

export function ScratchCardView({ user, isDarkMode, onRewardUser }: ScratchCardProps) {
  const [scratched, setScratched] = useState(false);
  const [revealedReward, setRevealedReward] = useState<number | null>(null);

  const lastClaimed = user.lastBonusClaims?.['scratch-card'];
  let isLocked = false;
  let countdownMsg = '';

  if (lastClaimed) {
    const lastClaimedDate = new Date(lastClaimed);
    const diffMs = Date.now() - lastClaimedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      isLocked = true;
      const hoursLeft = Math.floor(24 - diffHours);
      const minsLeft = Math.floor((24 - diffHours - hoursLeft) * 60);
      countdownMsg = `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় স্ক্র্যাচ কার্ড ক্লেইম করতে পারবেন না। আরও ${hoursLeft} ঘণ্টা ${minsLeft} মিনিট অপেক্ষা করুন।`;
    }
  }

  const handleScratchReveal = () => {
    if (scratched || isLocked) return;
    const rewards = [0.10, 0.20, 0.30, 0.40, 0.50, 0.25];
    const win = rewards[Math.floor(Math.random() * rewards.length)];
    setRevealedReward(win);
    setScratched(true);
    onRewardUser(win, 'Scratch Card Reward');
  };

  const handleResetCard = () => {
    setScratched(false);
    setRevealedReward(null);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-pink-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-pink-600 to-rose-600 text-white'
      }`}>
        <Scissors className="w-12 h-12 mx-auto text-yellow-300 mb-2 animate-bounce" />
        <h2 className="text-lg font-black uppercase text-white">Scratch & Match Card</h2>
        <p className="text-xs opacity-90 mt-1">কার্ডটি ঘষে ক্লেইম করুন আপনার নগদ পুরষ্কার!</p>
      </div>

      {isLocked && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
          {countdownMsg}
        </div>
      )}

      {/* Interactive scratch platform */}
      <div className="flex flex-col items-center justify-center">
        <div 
          onClick={handleScratchReveal}
          className={`relative w-64 h-36 rounded-2xl overflow-hidden shadow-lg border border-dashed border-slate-600 flex items-center justify-center bg-slate-900 ${
            isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
          id="scratch-card-board"
        >
          {/* Card cover cover layer */}
          <AnimatePresence>
            {!scratched && (
              <motion.div 
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 flex flex-col items-center justify-center p-4 text-center z-10"
              >
                <div className="p-2.5 bg-white/10 rounded-full mb-1">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  {isLocked ? 'Locked (24h Cooldown)' : 'Tap to Scratch Cover'}
                </p>
                <p className="text-[10px] text-slate-300 mt-1">
                  {isLocked ? '২৪ ঘণ্টা পর পুনরায় ক্লেইম করতে পারবেন' : 'ঘষে ভেতরের গিফটটি উন্মোচন করুন'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Underneath Reward content */}
          <div className="text-center p-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Your Hidden Reward</span>
            <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">৳{revealedReward?.toFixed(2)} TK</h3>
            <p className="text-xs text-slate-200 mt-2 font-bold flex items-center justify-center gap-1">
              <Check className="w-4 h-4 text-emerald-500" /> claimed & added to balance!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-center">
        {scratched && !isLocked && (
          <button 
            onClick={handleResetCard}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all"
            id="scratch-reset-btn"
          >
            Play Another Card
          </button>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   5. QUIZ GAME
   ========================================== */
interface QuizProps {
  user: User;
  isDarkMode: boolean;
  onRewardUser: (amount: number, description: string) => void;
}

export function QuizView({ user, isDarkMode, onRewardUser }: QuizProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions: QuizQuestion[] = INITIAL_QUIZ_QUESTIONS;
  const currentQ = questions[currentQIndex];

  const lastClaimed = user.lastBonusClaims?.['quiz'];
  let isLocked = false;
  let countdownMsg = '';

  if (lastClaimed) {
    const lastClaimedDate = new Date(lastClaimed);
    const diffMs = Date.now() - lastClaimedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      isLocked = true;
      const hoursLeft = Math.floor(24 - diffHours);
      const minsLeft = Math.floor((24 - diffHours - hoursLeft) * 60);
      countdownMsg = `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় কুইজ খেলে পুরস্কার পেতে পারবেন না। আরও ${hoursLeft} ঘণ্টা ${minsLeft} মিনিট অপেক্ষা করুন।`;
    }
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered || isLocked) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setQuizScore(prev => prev + 1);
      onRewardUser(currentQ.reward, `Quiz: ${currentQ.question}`);
      setFeedback(`সঠিক উত্তর! আপনি পেয়েছেন ৳${currentQ.reward.toFixed(2)} TK বোনাস।`);
    } else {
      setFeedback(`ভুল উত্তর! সঠিক উত্তরটি ছিলো: ${currentQ.options[currentQ.correctIndex]}`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Completed, reset to first question
      setCurrentQIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-purple-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
      }`}>
        <HelpCircle className="w-12 h-12 mx-auto text-yellow-300 mb-2 animate-bounce" />
        <h2 className="text-lg font-black uppercase text-white">General Knowledge Quiz</h2>
        <p className="text-xs opacity-90 mt-1">সঠিক উত্তর দিয়ে সরাসরি ব্যালেন্স যুক্ত করুন!</p>
      </div>

      {isLocked && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
          {countdownMsg}
        </div>
      )}

      {/* Quiz Progress */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Question {currentQIndex + 1} of {questions.length}</span>
        <span>Daily Reward limit active</span>
      </div>

      {/* Question Card */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="text-sm font-black text-slate-100 leading-relaxed mb-4">{currentQ.question}</h3>
        
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            
            let btnStyle = isDarkMode 
              ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
 
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold';
              } else {
                btnStyle = 'opacity-50 border-slate-800';
              }
            }
 
            return (
              <button
                key={idx}
                disabled={isAnswered || isLocked}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-3 text-xs text-left rounded-xl border transition-all ${btnStyle}`}
                id={`quiz-option-${idx}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button */}
      {isAnswered && (
        <div className="space-y-4">
          <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
            selectedOption === currentQ.correctIndex 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {feedback}
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all"
            id="quiz-next-btn"
          >
            {currentQIndex === questions.length - 1 ? 'Restart Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   6. MYSTERY BOX
   ========================================== */
interface MysteryBoxProps {
  user: User;
  isDarkMode: boolean;
  onRewardUser: (amount: number, description: string) => void;
}

export function MysteryBoxView({ user, isDarkMode, onRewardUser }: MysteryBoxProps) {
  const [opened, setOpened] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  const lastClaimed = user.lastBonusClaims?.['mystery-box'];
  let isLocked = false;
  let countdownMsg = '';

  if (lastClaimed) {
    const lastClaimedDate = new Date(lastClaimed);
    const diffMs = Date.now() - lastClaimedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      isLocked = true;
      const hoursLeft = Math.floor(24 - diffHours);
      const minsLeft = Math.floor((24 - diffHours - hoursLeft) * 60);
      countdownMsg = `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় মিস্ট্রি বক্স খুলতে পারবেন না। আরও ${hoursLeft} ঘণ্টা ${minsLeft} মিনিট অপেক্ষা করুন।`;
    }
  }

  const handleOpenBox = () => {
    if (opened || isLocked) return;
    const wins = [0.10, 0.20, 0.30, 0.40, 0.50];
    const winning = wins[Math.floor(Math.random() * wins.length)];
    onRewardUser(winning, 'Mystery Box Opening');
    setRewardMsg(`অভিনন্দন! মিস্ট্রি বক্স থেকে আপনি পেয়েছেন ৳${winning.toFixed(2)} TK!`);
    setOpened(true);
  };

  const handleResetBox = () => {
    setOpened(false);
    setRewardMsg('');
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-yellow-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-yellow-600 to-amber-600 text-white'
      }`}>
        <Sparkles className="w-12 h-12 mx-auto text-yellow-300 mb-2 animate-pulse" />
        <h2 className="text-lg font-black uppercase text-white">Daily Mystery Box</h2>
        <p className="text-xs opacity-90 mt-1">ট্যাপ করে প্রতিদিন মিস্ট্রি বক্স থেকে আকর্ষণীয় ক্যাশ জিতুন!</p>
      </div>

      {isLocked && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl text-center">
          {countdownMsg}
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-6">
        <motion.div 
          onClick={handleOpenBox}
          animate={opened ? { scale: [1, 1.1, 1] } : { y: [0, -10, 0] }}
          transition={opened ? { duration: 0.5 } : { repeat: Infinity, duration: 2 }}
          className={`w-40 h-40 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl shadow-xl border-4 border-yellow-300 flex items-center justify-center text-white relative ${
            isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
          id="mystery-box-graphic"
        >
          {opened ? (
            <div className="text-center p-2">
              <span className="text-4xl animate-bounce block">🎁</span>
              <span className="text-xs font-black uppercase tracking-wider text-yellow-200">OPENED</span>
            </div>
          ) : (
            <div className="text-center p-2">
              <span className="text-4xl block">📦</span>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {isLocked ? 'LOCKED' : 'TAP TO OPEN'}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="space-y-3 text-center">
        {opened ? (
          <>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
              {rewardMsg}
            </div>
            {!isLocked && (
              <button 
                onClick={handleResetBox}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all"
                id="mystery-reset-btn"
              >
                Open Another Box
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400">
            {isLocked ? '২৪ ঘণ্টা পর পুনরায় বক্সটি খুলতে পারবেন।' : 'গিফট বক্সটি সম্পূর্ণ ফ্রি তে খুলুন।'}
          </p>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   7. VIP STATUS
   ========================================== */
interface VipStatusProps {
  user: User;
  isDarkMode: boolean;
  onUpgradeVip: () => { success: boolean; message: string };
}

export function VipStatusView({ user, isDarkMode, onUpgradeVip }: VipStatusProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpgrade = () => {
    const res = onUpgradeVip();
    setFeedback(res.message);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-rose-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-rose-600 to-pink-600 text-white'
      }`}>
        <Award className="w-12 h-12 mx-auto text-yellow-300 mb-2 animate-pulse" />
        <h2 className="text-lg font-black uppercase text-white">VIP Club Status</h2>
        <p className="text-xs opacity-90 mt-1">সবগুলো আর্নিং এবং ডেইলি রিওয়ার্ড ডাবল করুন!</p>
      </div>

      {/* Upgrade features comparison */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">VIP Benefits</h3>
        
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-slate-300"><strong>2x Ads Earning:</strong> প্রতিটি ডেইলি এড দেখার পর দ্বিগুণ পেমেন্ট পান।</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-slate-300"><strong>Instant Claim Daily:</strong> ডেইলি বোনাস এ পাবেন সর্বোচ্চ ২৫% এক্সট্রা রিওয়ার্ড।</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-slate-300"><strong>Priority Withdrawal:</strong> উইথড্র করার সাথে সাথে ইনস্ট্যান্ট পেমেন্ট এপ্রুভালের সুবিধা।</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {user.vipStatus ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-xs font-bold text-emerald-400">
            👑 আপনি অলরেডি আমাদের একজন সম্মানিত VIP মেম্বার!
          </div>
        ) : (
          <>
            {feedback && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center text-xs font-bold text-blue-400">
                {feedback}
              </div>
            )}
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/15 active:scale-95"
              id="vip-upgrade-btn"
            >
              Upgrade to VIP (৳৫০.০০ TK Balance Cost)
            </button>
            <p className="text-[11px] text-center text-slate-400">উইথড্র করার আগে একাউন্ট VIP করে নিলে আর্নিং দ্বিগুণ বেড়ে যাবে।</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   8. ACHIEVEMENTS
   ========================================== */
interface AchievementsProps {
  user: User;
  isDarkMode: boolean;
  onRewardUser: (amount: number, description: string) => void;
}

export function AchievementsView({ user, isDarkMode, onRewardUser }: AchievementsProps) {
  const [claimed, setClaimed] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const milestones = [
    { id: 'm1', label: 'Newcomer Referrer', desc: 'Refer 5 friends to earn bonus', target: 5, current: user.referralsCount, reward: 5.0 },
    { id: 'm2', label: 'Pro Earning Active', desc: 'Refer 15 friends to earn bonus', target: 15, current: user.referralsCount, reward: 15.0 },
    { id: 'm3', label: 'Daily Earning Streak', desc: 'Reach a streak of 5 checkins', target: 5, current: user.streak, reward: 2.0 },
  ];

  const handleClaimAward = (id: string, reward: number, label: string) => {
    if (claimed.includes(id)) return;
    setClaimed(prev => [...prev, id]);
    onRewardUser(reward, `Achievement Award: ${label}`);
    setSuccessMsg(`অভিনন্দন! আপনি ক্লেইম করেছেন ৳${reward.toFixed(2)} TK বোনাস!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl text-center border relative overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gradient-to-br from-yellow-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-yellow-600 to-amber-600 text-white'
      }`}>
        <Trophy className="w-12 h-12 mx-auto text-yellow-300 mb-2 animate-pulse" />
        <h2 className="text-lg font-black uppercase text-white">Achievements Awards</h2>
        <p className="text-xs opacity-90 mt-1">মাইলস্টোন পূরণ করে অতিরিক্ত ক্যাশ ক্লেইম করুন!</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400">
          {successMsg}
        </div>
      )}

      <div className="space-y-3">
        {milestones.map((m) => {
          const isEligible = m.current >= m.target;
          const isClaimed = claimed.includes(m.id);
          const percent = Math.min(100, (m.current / m.target) * 100);

          return (
            <div 
              key={m.id}
              className={`p-4 rounded-2xl border space-y-3.5 ${
                isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-slate-100">{m.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">+৳{m.reward.toFixed(2)} TK</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Progress</span>
                  <span>{m.current} / {m.target}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {/* Claim Action */}
              <button
                disabled={!isEligible || isClaimed}
                onClick={() => handleClaimAward(m.id, m.reward, m.label)}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                  isClaimed 
                    ? 'bg-emerald-500/10 text-emerald-400 cursor-default border border-emerald-500/20' 
                    : isEligible
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
                id={`achievement-claim-${m.id}`}
              >
                {isClaimed ? 'Claimed successfully' : isEligible ? 'Claim Bonus' : 'Not Completed Yet'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
