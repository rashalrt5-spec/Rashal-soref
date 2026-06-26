import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Users, Award, Star, Share2, Copy, Check, ChevronRight, PlayCircle, 
  Plus, CheckCircle2, TrendingUp, HelpCircle, ArrowRight, Wallet2, Calendar, 
  UserCheck, AlertTriangle, Send, ShieldAlert, Heart, Trophy, Upload, X
} from 'lucide-react';
import { User, Task, AdSlot, Withdrawal, Transaction, LeaderboardEntry, TaskSubmission } from '../types';

/* ==========================================
   1. HOME VIEW
   ========================================== */
interface HomeViewProps {
  user: User;
  tasks: Task[];
  adSlots: AdSlot[];
  announcement: string;
  isDarkMode: boolean;
  onWatchAd: (slotId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onSelectView: (view: string) => void;
  taskSubmissions?: TaskSubmission[];
  onSubmitScreenshot: (taskId: string, screenshot: string) => void;
}

export function HomeView({
  user,
  tasks,
  adSlots,
  announcement,
  isDarkMode,
  onWatchAd,
  onCompleteTask,
  onSelectView,
  taskSubmissions = [],
  onSubmitScreenshot
}: HomeViewProps) {
  const [copied, setCopied] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<Task | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const handleCopyLink = () => {
    const refLink = `${window.location.origin}?ref=${user.telegramId}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('স্ক্রিনশটের সাইজ ৫ MB এর বেশি হওয়া যাবে না।');
        return;
      }
      setUploadError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotFile) {
      setUploadError('অনুগ্রহ করে কাজের প্রমাণ হিসেবে স্ক্রিনশট আপলোড করুন।');
      return;
    }
    if (showUploadModal) {
      onSubmitScreenshot(showUploadModal.id, screenshotFile);
      setShowUploadModal(null);
      setScreenshotFile('');
      setUploadError('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Balance Card (Bengali Text styled exactly like screenshots) */}
      <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl border text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent'
      }`}>
        <p className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}`}>
          আপনার ব্যালেন্স
        </p>
        <h2 className="text-4xl font-extrabold font-mono tracking-tight flex items-center justify-center gap-1.5 text-white">
          {user.balance.toFixed(2)} <span className="text-lg font-bold">TK</span>
        </h2>
        
        {/* Secondary Metrics */}
        <div className={`grid grid-cols-3 gap-2 mt-5 pt-4 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-white/10'}`}>
          <div className="text-center">
            <p className="text-[10px] opacity-80">Earned</p>
            <p className="text-sm font-bold font-mono text-white">৳{user.earned.toFixed(1)}</p>
          </div>
          <div className="text-center border-x border-slate-700/30">
            <p className="text-[10px] opacity-80">Referrals</p>
            <p className="text-sm font-bold font-mono text-white">{user.referralsCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] opacity-80">Streak</p>
            <p className="text-sm font-bold font-mono text-white">{user.streak} Days</p>
          </div>
        </div>
      </div>

      {/* 2. Announcement Scrolling Banner */}
      <div className={`py-2 px-4 rounded-xl overflow-hidden border whitespace-nowrap flex items-center relative ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700 font-medium'
      }`}>
        <span className="bg-emerald-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded mr-3 shrink-0 animate-pulse">
          NOTICE
        </span>
        <div className="w-full overflow-hidden relative">
          <p className="inline-block animate-marquee text-xs">
            {announcement || "আপনার চ্যানেল বা গ্রুপ বটে যুক্ত করতে চাইলে এডমিনের সাথে যোগাযোগ করুন।"}
          </p>
        </div>
      </div>

      {/* 4. Active Tasks */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Award className="w-4 h-4 text-purple-500" /> Active Tasks
          </h3>
          <span className="text-[10px] opacity-75 font-semibold font-mono">Proof Screenshot Required</span>
        </div>

        <div className="space-y-2">
          {tasks.filter(t => t.isActive).map((task) => {
            const isCompleted = user.completedTasks.includes(task.id);
            const submission = taskSubmissions.find(s => s.taskId === task.id && s.userId === user.id);
            
            return (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/50' 
                    : 'bg-white border-slate-200 hover:shadow-sm'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{task.name}</h4>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                    +{task.reward.toFixed(2)} TK
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : submission?.status === 'pending' ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse flex items-center gap-1">
                      যাচাই চলছে (Pending)
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        setShowUploadModal(task);
                        setScreenshotFile('');
                        setUploadError('');
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        submission?.status === 'rejected'
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10'
                      }`}
                      id={`task-btn-${task.id}`}
                    >
                      {submission?.status === 'rejected' ? 'আবার জমা দিন (Rejected)' : 'শুরু করুন'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Proof Submission Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400 animate-bounce" />
                <h3 className="text-sm font-bold">টাক্স স্ক্রিনশট সাবমিশন</h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="space-y-2.5">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  টাস্ক: <span className="text-blue-400">{showUploadModal.name}</span> (৳{showUploadModal.reward.toFixed(2)} TK)
                </p>
                <div className="p-3 bg-blue-500/10 rounded-xl text-[11px] leading-relaxed text-blue-300 border border-blue-500/20">
                  <p className="font-bold mb-1">ধাপসমূহ:</p>
                  <p>১. নিচে <strong>"লিংক ভিজিট করুন"</strong> বাটনে ক্লিক করে কাজ সম্পন্ন করুন।</p>
                  <p>২. জয়েন হওয়ার পর বা কাজ সম্পন্ন হওয়ার পর একটি স্ক্রিনশট নিন।</p>
                  <p>৩. সেই স্ক্রিনশটটি নিচে ফাইল সিলেক্টর দিয়ে আপলোড করে জমা দিন।</p>
                </div>
              </div>

              {/* Task Link Visit Button */}
              <a 
                href={showUploadModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15"
              >
                লিংক ভিজিট করুন (Open Link)
              </a>

              {/* File Upload Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">কাজের স্ক্রিনশটটি দিন (Image Only)</label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  screenshotFile 
                    ? 'border-emerald-500 bg-emerald-500/5' 
                    : isDarkMode ? 'border-slate-700 bg-slate-900/40 hover:border-slate-600' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {screenshotFile ? (
                    <div className="space-y-2">
                      <img 
                        src={screenshotFile} 
                        alt="Screenshot Preview" 
                        className="max-h-24 mx-auto rounded border border-emerald-500/30 object-contain"
                      />
                      <p className="text-[10px] font-bold text-emerald-400">স্ক্রিনশট সিলেক্ট হয়েছে! (ট্যাপ করে চেঞ্জ করুন)</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-400">
                      <Upload className="w-6 h-6 mx-auto text-slate-500" />
                      <p className="text-xs font-bold">এখানে ক্লিক করে স্ক্রিনশট আপলোড করুন</p>
                      <p className="text-[9px]">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-center">
                  {uploadError}
                </p>
              )}

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(null)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  জমা দিন (Submit Proof)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   2. RANK VIEW (Leaderboard)
   ========================================== */
interface RankViewProps {
  user: User;
  leaderboard: LeaderboardEntry[];
  isDarkMode: boolean;
}

export function RankView({ user, leaderboard, isDarkMode }: RankViewProps) {
  // Check if current user is in leaderboard, if not, append them at their simulated spot
  const isUserOnBoard = leaderboard.some(entry => entry.username === user.username);
  const updatedLeaderboard = [...leaderboard];
  
  if (!isUserOnBoard) {
    updatedLeaderboard.push({
      username: user.username + " (You)",
      telegramId: user.telegramId,
      referralsCount: user.referralsCount,
    });
  }

  // Sort by referral count
  const sortedLeaderboard = updatedLeaderboard.sort((a, b) => b.referralsCount - a.referralsCount);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl border text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-950 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-transparent'
      }`}>
        <Trophy className="w-10 h-10 mx-auto text-yellow-400 mb-2 animate-bounce" />
        <h2 className="text-xl font-extrabold tracking-tight text-white">Leaderboard</h2>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-100'}`}>
          Top Referrers This Month
        </p>
      </div>

      {/* Podiums for Top 3 */}
      <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2">
        {/* Rank 2 */}
        {sortedLeaderboard[1] && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
                alt="Rank 2"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-slate-300 object-cover" 
              />
              <span className="absolute -top-1 -right-1 bg-slate-300 text-slate-800 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">2</span>
            </div>
            <p className="text-[11px] font-bold truncate max-w-[80px] mt-2 text-slate-200">{sortedLeaderboard[1].username}</p>
            <p className="text-[10px] text-blue-400 font-mono font-bold">{sortedLeaderboard[1].referralsCount} refs</p>
          </div>
        )}

        {/* Rank 1 (Gold/Middle) */}
        {sortedLeaderboard[0] && (
          <div className="flex flex-col items-center">
            <div className="relative -mt-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="Rank 1"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full border-4 border-yellow-400 object-cover" 
              />
              <span className="absolute -top-1.5 -right-1 bg-yellow-400 text-slate-950 text-[11px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-pulse">👑</span>
            </div>
            <p className="text-xs font-black truncate max-w-[100px] mt-2 text-white">{sortedLeaderboard[0].username}</p>
            <p className="text-xs text-yellow-400 font-mono font-bold">{sortedLeaderboard[0].referralsCount} refs</p>
          </div>
        )}

        {/* Rank 3 */}
        {sortedLeaderboard[2] && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
                alt="Rank 3"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-amber-600 object-cover" 
              />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">3</span>
            </div>
            <p className="text-[11px] font-bold truncate max-w-[80px] mt-2 text-slate-200">{sortedLeaderboard[2].username}</p>
            <p className="text-[10px] text-blue-400 font-mono font-bold">{sortedLeaderboard[2].referralsCount} refs</p>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className={`rounded-2xl border divide-y overflow-hidden ${
        isDarkMode ? 'bg-slate-800/30 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
      }`}>
        {sortedLeaderboard.map((entry, index) => {
          const isCurrentUser = entry.telegramId === user.telegramId;
          return (
            <div 
              key={entry.telegramId + '_' + index}
              className={`p-3.5 flex items-center justify-between transition-all ${
                isCurrentUser 
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500' 
                  : 'hover:bg-slate-800/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-slate-400 w-5">#{index + 1}</span>
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase">
                  {entry.username.substring(0, 2)}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isCurrentUser ? 'text-blue-400' : 'text-slate-200'}`}>{entry.username}</p>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {entry.telegramId}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold font-mono text-slate-300">{entry.referralsCount} Referrals</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   3. REFER VIEW (Invite & Earn)
   ========================================== */
interface ReferViewProps {
  user: User;
  isDarkMode: boolean;
}

export function ReferView({ user, isDarkMode }: ReferViewProps) {
  const [copied, setCopied] = useState(false);

  const refLink = `${window.location.origin}?ref=${user.telegramId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const text = `🔥 Fast Money Earning Bot! জয়েন করেই ইনকাম শুরু করুন। রেফার লিংক: ${refLink}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Invite Header Card */}
      <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl border text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent'
      }`}>
        <h2 className="text-lg font-black uppercase text-white">Invite & Earn</h2>
        <p className={`text-xs mt-1 max-w-xs mx-auto ${isDarkMode ? 'text-indigo-300' : 'text-indigo-100'}`}>
          বন্ধুকে দাওয়াত দাও, প্রতিজনের জন্য বোনাস পাও!
        </p>

        {/* Dynamic Referral Link Bar */}
        <div className="mt-5 flex gap-1.5 max-w-sm mx-auto bg-slate-950/40 p-1.5 rounded-xl border border-slate-700/50">
          <input 
            type="text" 
            readOnly 
            value={refLink}
            className="bg-transparent border-none text-[11px] font-mono text-slate-300 px-2 outline-none w-full select-all"
          />
          <button 
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button 
            onClick={handleShareLink}
            className="px-3 py-1.5 bg-[#229ED9] hover:bg-[#1c81b2] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" /> Share
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Your Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Referrals</p>
            <p className="text-xl font-bold text-slate-100 mt-2 font-mono">{user.referralsCount}</p>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Spin Tokens</p>
            <p className="text-xl font-bold text-emerald-400 mt-2 font-mono">{user.spinTokens || 0} টি</p>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Earning</p>
            <p className="text-xl font-bold text-slate-100 mt-2 font-mono">৳{user.earned.toFixed(2)}</p>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Current Balance</p>
            <p className="text-xl font-bold text-blue-400 mt-2 font-mono">৳{user.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 3. How It Works Instruction */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          How It Works
        </h3>

        <div className={`p-4 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <div>
              <p className="text-xs font-bold text-slate-200">Copy your referral link</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Copy বা Share বোতাম দিয়ে আপনার unique link নিন।</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <div>
              <p className="text-xs font-bold text-slate-200">Friends Join & Earn Spin Tokens</p>
              <p className="text-[11px] text-slate-400 mt-0.5">আপনার বন্ধুরা লিংকে ক্লিক করে বটে জয়েন করলে প্রতি জয়েনে আপনি পাবেন ১টি চরকা (Spin Token)!</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
            <div>
              <p className="text-xs font-bold text-slate-200">Withdraw Instant</p>
              <p className="text-[11px] text-slate-400 mt-0.5">৳৩০.০০ হলেই বিকাশ, রকেট বা নগদের মাধ্যমে টাকা সাথে সাথে উইথড্র করুন!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   4. WALLET VIEW (Withdrawals)
   ========================================== */
interface WalletViewProps {
  user: User;
  transactions: Transaction[];
  isDarkMode: boolean;
  onRequestWithdrawal: (method: 'BKASH' | 'NAGAD' | 'ROCKET', accountNo: string, amount: number) => { success: boolean, message: string };
}

export function WalletView({ user, transactions, isDarkMode, onRequestWithdrawal }: WalletViewProps) {
  const [method, setMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET'>('BKASH');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const valAmt = parseFloat(amount);
    if (isNaN(valAmt) || valAmt < 30) {
      setFeedback({ type: 'error', message: 'সর্বনিম্ন উইথড্র ৳৩০.০০ হতে হবে।' });
      return;
    }

    if (valAmt > user.balance) {
      setFeedback({ type: 'error', message: 'উইথড্র করার জন্য আপনার পর্যাপ্ত ব্যালেন্স নেই।' });
      return;
    }

    if (accountNumber.trim().length < 11) {
      setFeedback({ type: 'error', message: 'সঠিক অ্যাকাউন্ট নাম্বার টাইপ করুন।' });
      return;
    }

    const res = onRequestWithdrawal(method, accountNumber, valAmt);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setAccountNumber('');
      setAmount('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header Card */}
      <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl border text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent'
      }`}>
        <Wallet2 className="w-8 h-8 mx-auto text-blue-300 mb-2 animate-pulse" />
        <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5">সহজ উইথড্রয়াল</p>
        <h2 className="text-3xl font-extrabold font-mono tracking-tight text-white">
          {user.balance.toFixed(2)} <span className="text-sm font-bold">TK</span>
        </h2>
        <p className="text-[10px] opacity-70 mt-1">bKash, Nagad, Rocket payment mode active</p>
      </div>

      {/* Withdraw Box Form */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Withdraw
        </h3>

        <form onSubmit={handleSubmit} className={`p-5 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Method Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">নির্বাচন করুন</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className={`w-full px-3 py-2 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="BKASH">BKASH (Min 30)</option>
              <option value="NAGAD">NAGAD (Min 30)</option>
              <option value="ROCKET">ROCKET (Min 30)</option>
            </select>
          </div>

          {/* Account Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Account Number</label>
            <input 
              type="tel"
              required
              placeholder="e.g., 017XXXXXXXX"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Amount (Min 30)</label>
            <input 
              type="number"
              required
              min="30"
              placeholder="Min 30"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Feedback message */}
          {feedback && (
            <div className={`p-2.5 rounded-lg text-xs font-bold border ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/15 active:scale-95 transition-all duration-200"
          >
            Request Withdraw
          </button>
        </form>
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Transactions
        </h3>

        <div className={`rounded-2xl border divide-y overflow-hidden ${
          isDarkMode ? 'bg-slate-800/30 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
        }`}>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-medium">No transactions yet</div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-800/10 transition-all">
                <div>
                  <p className="font-bold text-slate-200 leading-snug">{t.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(t.timestamp).toLocaleDateString()}
                  </p>
                </div>
                
                <span className={`font-bold font-mono text-sm shrink-0 ${
                  t.type.startsWith('withdraw') 
                    ? t.type.includes('approved') 
                      ? 'text-emerald-400' 
                      : t.type.includes('pending')
                        ? 'text-amber-400'
                        : 'text-rose-400 line-through'
                    : 'text-emerald-400'
                }`}>
                  {t.type.startsWith('withdraw') ? '-' : '+'}৳{t.amount.toFixed(1)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   5. SUPPORT VIEW
   ========================================== */
interface SupportViewProps {
  isDarkMode: boolean;
}

export function SupportView({ isDarkMode }: SupportViewProps) {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSuccess(true);
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Support Intro */}
      <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl border text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 to-blue-950 border-slate-800' 
          : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent'
      }`}>
        <h2 className="text-lg font-black uppercase text-white">Support Help Desk</h2>
        <p className={`text-xs mt-1 max-w-xs mx-auto ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}`}>
          যেকোনো সমস্যায় আমাদের সাথে সরাসরি টেলিগ্রামে যোগাযোগ করুন।
        </p>
        <a 
          href="https://t.me/fastmoney_support" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 bg-[#229ED9] hover:bg-[#1c81b2] text-xs font-black text-white rounded-xl transition-all shadow-md active:scale-95"
        >
          <Send className="w-3.5 h-3.5" /> Telegram HelpDesk
        </a>
      </div>

      {/* Support form */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Send Message to Admin
        </h3>

        <form onSubmit={handleSubmit} className={`p-5 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">আপনার সমস্যাটি বিস্তারিত লিখুন</label>
            <textarea 
              rows={4}
              required
              placeholder="এখানে আপনার মেসেজ টাইপ করুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {success && (
            <div className="p-2.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              আপনার মেসেজ সফলভাবে এডমিনের কাছে পাঠানো হয়েছে! শীঘ্রই সমাধান করা হবে।
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/15 transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Quick FAQ */}
      <div className="space-y-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
        </h3>

        <div className={`p-4 rounded-2xl border space-y-3.5 divide-y divide-slate-800/40 ${
          isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="pt-0">
            <p className="text-xs font-bold text-slate-200">১. উইথড্র করতে কত সময় লাগে?</p>
            <p className="text-[11px] text-slate-400 mt-1">উইথড্র করার ১-২৪ ঘণ্টার মধ্যে এডমিন চেক করে আপনার পেমেন্ট পাঠিয়ে দিবেন।</p>
          </div>
          <div className="pt-3.5">
            <p className="text-xs font-bold text-slate-200">২. রেফারে কি পুরষ্কার দেওয়া হয়?</p>
            <p className="text-[11px] text-slate-400 mt-1">প্রতিটি সফল রেফারে আপনি পাবেন ১টি চরকা (Spin Token) যা দিয়ে ভাগ্যের চাকা ঘুরিয়ে টাকা উপার্জন করতে পারবেন।</p>
          </div>
        </div>
      </div>
    </div>
  );
}
