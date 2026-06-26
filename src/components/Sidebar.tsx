import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, Gift, Calendar, HelpCircle, Trophy, UserCheck, Share2, Wallet2, 
  HelpCircle as SupportIcon, Moon, Sun, X, Award, RotateCw, RefreshCw, Scissors, Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
  telegramId: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  telegramId,
  isDarkMode,
  onToggleTheme
}: SidebarProps) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, section: 'menu' },
    { id: 'bonus', label: 'Bonus Hub', icon: Gift, section: 'bonus' },
    { id: 'daily-reward', label: 'Daily Reward', icon: Calendar, section: 'bonus' },
    { id: 'spin-wheel', label: 'Spin Wheel', icon: RotateCw, section: 'bonus' },
    { id: 'scratch-card', label: 'Scratch Card', icon: Scissors, section: 'bonus' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, section: 'bonus' },
    { id: 'mystery-box', label: 'Mystery Box', icon: Sparkles, section: 'bonus' },
    { id: 'vip-status', label: 'VIP Status', icon: Award, section: 'bonus' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, section: 'bonus' },
    { id: 'rank', label: 'Leaderboard', icon: Trophy, section: 'others' },
    { id: 'refer', label: 'Refer & Earn', icon: Share2, section: 'others' },
    { id: 'wallet', label: 'Wallet', icon: Wallet2, section: 'others' },
    { id: 'support', label: 'Support', icon: SupportIcon, section: 'others' },
  ];

  const handleItemClick = (id: string) => {
    onSelectView(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className={`fixed top-0 right-0 h-full w-[280px] z-50 shadow-2xl flex flex-col ${
          isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-800'
        }`}
        id="sidebar-drawer"
      >
        {/* Drawer Header */}
        <div className={`p-4 flex items-center justify-between border-b ${
          isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">FAST MONEY</h2>
              <p className="text-[10px] opacity-75">EARN • WIN • CASH OUT</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-black/10 text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className={`p-4 border-b flex justify-between items-center ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">YOUR TELEGRAM ID</p>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">{telegramId}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Dark Mode</span>
            <button
              onClick={onToggleTheme}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Menu Section */}
          <div className="space-y-1">
            <p className={`text-[10px] font-bold uppercase tracking-wider px-3 mb-1 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>মেনু</p>
            {menuItems.filter(item => item.section === 'menu').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode 
                        ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bonus Section */}
          <div className="space-y-1">
            <p className={`text-[10px] font-bold uppercase tracking-wider px-3 mb-1 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>BONUS</p>
            {menuItems.filter(item => item.section === 'bonus').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode 
                        ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Others Section */}
          <div className="space-y-1">
            <p className={`text-[10px] font-bold uppercase tracking-wider px-3 mb-1 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>অন্যান্য</p>
            {menuItems.filter(item => item.section === 'others').map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode 
                        ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
