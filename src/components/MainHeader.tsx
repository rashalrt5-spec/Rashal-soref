import React, { useState } from 'react';
import { Headphones, Settings, Menu, ShieldCheck, HelpCircle, Lock, Sparkles, X } from 'lucide-react';
import { User } from '../types';

interface MainHeaderProps {
  user: User;
  isDarkMode: boolean;
  onOpenSidebar: () => void;
  onOpenAdmin: () => void;
  onOpenSupport: () => void;
}

export default function MainHeader({
  user,
  isDarkMode,
  onOpenSidebar,
  onOpenAdmin,
  onOpenSupport
}: MainHeaderProps) {
  const [showPassModal, setShowPassModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState('');

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Rashal117') {
      onOpenAdmin();
      setShowPassModal(false);
      setPasswordInput('');
      setPassError('');
    } else {
      setPassError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  return (
    <>
      <header className={`p-4 flex items-center justify-between shadow-md relative ${
        isDarkMode 
          ? 'bg-gradient-to-b from-blue-950 to-slate-900 border-b border-slate-800' 
          : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white'
      }`}>
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setShowPassModal(true)}>
            {/* Real RF RASHAL Avatar fallback */}
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
              alt="RF RASHAL Avatar" 
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full border-2 border-emerald-400 object-cover shadow-md group-hover:scale-105 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white">
              <span className="block w-2 h-2 rounded-full bg-emerald-100 animate-pulse"></span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-tight text-white">{user.username}</h1>
              {user.vipStatus && (
                <span className="text-[9px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-1 py-0.1 rounded font-black font-mono">VIP</span>
              )}
            </div>
            <p className="text-[11px] opacity-80 font-mono">ID: {user.telegramId}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Support */}
          <button 
            onClick={onOpenSupport}
            className={`p-2 rounded-full transition-all ${
              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-blue-400' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Support"
            id="support-header-btn"
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Settings / Gear (Secret Gate) */}
          <button 
            onClick={() => setShowPassModal(true)}
            className={`p-2 rounded-full transition-all ${
              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Admin Settings"
            id="settings-header-btn"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sidebar / Menu */}
          <button 
            onClick={onOpenSidebar}
            className={`p-2 rounded-full transition-all ${
              isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Menu"
            id="menu-header-btn"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Small Tag on Side */}
        <div className="absolute right-4 bottom-1.5 flex items-center gap-1 opacity-70">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-[9px] font-black tracking-widest font-mono">FAST MONEY</span>
        </div>
      </header>

      {/* Secret Admin Passcode Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border transition-all ${
            isDarkMode ? 'bg-[#1e293b] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-bold">সিক্রেট গেটওয়ে (Password Required)</h3>
              </div>
              <button 
                onClick={() => {
                  setShowPassModal(false);
                  setPasswordInput('');
                  setPassError('');
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="p-6 space-y-4">
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                প্রোফাইলের এই গোপন জায়গায় ঢোকার জন্য সঠিক সিক্রেট পাসকোডটি প্রদান করুন।
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider block text-slate-400">সিক্রেট গেটওয়ে পাসকোড</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPassError('');
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400'
                  }`}
                  autoFocus
                />
              </div>

              {passError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  {passError}
                </p>
              )}

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowPassModal(false);
                    setPasswordInput('');
                    setPassError('');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  প্রবেশ করুন <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
