import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Gift, Trophy, Share2, Wallet2, 
  HelpCircle, ShieldCheck, Heart, Headphones
} from 'lucide-react';

import { User, Task, AdSlot, Withdrawal, Transaction, TaskSubmission } from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_AD_SLOTS, 
  INITIAL_LEADERBOARD, 
  INITIAL_WITHDRAWALS 
} from './data/initialData';

import MainHeader from './components/MainHeader';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';

import { 
  HomeView, 
  RankView, 
  ReferView, 
  WalletView, 
  SupportView 
} from './components/Views';

import { 
  BonusHub, 
  DailyRewardView, 
  SpinWheelView, 
  ScratchCardView, 
  QuizView, 
  MysteryBoxView, 
  VipStatusView, 
  AchievementsView 
} from './components/Games';

export default function App() {
  // 1. Core Persistent State with LocalStorage
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('fastmoney_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.spinTokens === undefined) parsed.spinTokens = 3;
      if (!parsed.lastBonusClaims) parsed.lastBonusClaims = {};
      return parsed;
    }
    return {
      id: 'usr_rashal',
      username: 'RF RASHAL',
      telegramId: '8479465879',
      balance: 0.00,
      earned: 0.00,
      referralsCount: 0,
      streak: 1,
      lastDailyRewardClaimed: null,
      vipStatus: false,
      completedTasks: [],
      adViews: { ad_slot_1: 0, ad_slot_2: 0 },
      lastAdWatched: { ad_slot_1: null, ad_slot_2: null },
      referrals: [],
      streakLastUpdated: null,
      spinTokens: 3,
      lastBonusClaims: {},
    };
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fastmoney_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem('fastmoney_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fastmoney_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcement, setAnnouncement] = useState(() => {
    return localStorage.getItem('fastmoney_announcement') || 'আপনার চ্যানেল বা গ্রুপ বটে যুক্ত করতে চাইলে এডমিনের সাথে যোগাযোগ করুন।';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fastmoney_all_users');
    if (saved) return JSON.parse(saved);
    
    // Default list of simulated users in the system for admin visibility
    return [
      {
        id: 'usr_rashal',
        username: 'RF RASHAL',
        telegramId: '8479465879',
        balance: 0.00,
        earned: 0.00,
        referralsCount: 0,
        streak: 1,
        lastDailyRewardClaimed: null,
        vipStatus: false,
        completedTasks: [],
        adViews: { ad_slot_1: 0, ad_slot_2: 0 },
        lastAdWatched: { ad_slot_1: null, ad_slot_2: null },
        referrals: [],
        streakLastUpdated: null,
        spinTokens: 3,
      },
      {
        id: 'usr_nipa',
        username: 'Nipa',
        telegramId: '458923485',
        balance: 90.00,
        earned: 90.00,
        referralsCount: 45,
        streak: 5,
        lastDailyRewardClaimed: new Date().toISOString(),
        vipStatus: true,
        completedTasks: [],
        adViews: {},
        lastAdWatched: {},
        referrals: [],
        streakLastUpdated: null,
        spinTokens: 45,
      },
      {
        id: 'usr_sumit',
        username: 'Owner Sumit',
        telegramId: '849204325',
        balance: 150.00,
        earned: 150.00,
        referralsCount: 45,
        streak: 3,
        lastDailyRewardClaimed: null,
        vipStatus: false,
        completedTasks: [],
        adViews: {},
        lastAdWatched: {},
        referrals: [],
        streakLastUpdated: null,
        spinTokens: 12,
      }
    ];
  });

  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('fastmoney_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('fastmoney_theme');
    return saved ? saved === 'dark' : true; // Dark mode by default
  });

  // UI Navigation states
  const [activeView, setActiveView] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to LocalStorage on state changes
  useEffect(() => {
    localStorage.setItem('fastmoney_user', JSON.stringify(user));
    // Keep user's record in the overall users collection updated too
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fastmoney_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fastmoney_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('fastmoney_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fastmoney_announcement', announcement);
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('fastmoney_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('fastmoney_submissions', JSON.stringify(taskSubmissions));
  }, [taskSubmissions]);

  useEffect(() => {
    localStorage.setItem('fastmoney_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handle URL Referrals if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode && refCode !== user.telegramId) {
      // Simulate adding a referral to another user when we boot up!
      setUsers(prev => prev.map(u => {
        if (u.telegramId === refCode && !u.referrals.includes(user.username)) {
          const updatedRefs = [...u.referrals, user.username];
          const currentTokens = u.spinTokens || 0;
          return {
            ...u,
            referrals: updatedRefs,
            referralsCount: updatedRefs.length,
            spinTokens: currentTokens + 1, // Receive 1 spin token ("চরকা") per referral
          };
        }
        return u;
      }));
    }
  }, []);

  // 2. Action Logic
  const handleWatchAd = (slotId: string) => {
    const slot = INITIAL_AD_SLOTS.find(s => s.id === slotId);
    if (!slot) return;

    const viewsToday = user.adViews[slotId] || 0;
    if (viewsToday >= slot.maxViews) return;

    // Premium VIPs get 2x rewards on ads
    const rewardMultiplier = user.vipStatus ? 2.0 : 1.0;
    const finalReward = slot.reward * rewardMultiplier;

    // Update views counter
    const updatedViews = { ...user.adViews, [slotId]: viewsToday + 1 };
    const updatedLastWatched = { ...user.lastAdWatched, [slotId]: new Date().toISOString() };

    const newBalance = user.balance + finalReward;
    const newEarned = user.earned + finalReward;

    setUser(prev => ({
      ...prev,
      balance: newBalance,
      earned: newEarned,
      adViews: updatedViews,
      lastAdWatched: updatedLastWatched,
    }));

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_ad_' + Date.now(),
      amount: finalReward,
      type: 'earn',
      description: `Daily Ad View: ${slot.name}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleCompleteTask = (taskId: string) => {
    // Legacy support, but we now require screenshots via handleSubmitScreenshot
  };

  const handleSubmitScreenshot = (taskId: string, screenshot: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if they already submitted
    const alreadySubmitted = taskSubmissions.some(s => s.taskId === taskId && s.userId === user.id && s.status === 'pending');
    if (alreadySubmitted) return;

    const submission: TaskSubmission = {
      id: 'sub_' + Date.now(),
      userId: user.id,
      username: user.username,
      telegramId: user.telegramId,
      taskId,
      taskName: task.name,
      reward: task.reward,
      screenshot,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    setTaskSubmissions(prev => [submission, ...prev]);
  };

  const handleClaimDailyReward = () => {
    if (user.lastDailyRewardClaimed) {
      const lastClaimedDate = new Date(user.lastDailyRewardClaimed);
      const diffMs = Date.now() - lastClaimedDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 24) {
        const hoursLeft = Math.ceil(24 - diffHours);
        return { success: false, message: `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় বোনাস ক্লেইম করতে পারবেন না। আরও ${hoursLeft} ঘণ্টা অপেক্ষা করুন।`, reward: 0 };
      }
    }

    // Daily reward ranges randomized between 0.10 and 0.50 TK (per user request)
    const finalReward = parseFloat((Math.random() * (0.50 - 0.10) + 0.10).toFixed(2));

    const newBalance = user.balance + finalReward;
    const newEarned = user.earned + finalReward;
    const newStreak = user.streak + 1;
    const updatedClaims = {
      ...(user.lastBonusClaims || {}),
      'daily-reward': new Date().toISOString()
    };

    setUser(prev => ({
      ...prev,
      balance: newBalance,
      earned: newEarned,
      streak: newStreak,
      lastDailyRewardClaimed: new Date().toISOString(),
      lastBonusClaims: updatedClaims
    }));

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_daily_' + Date.now(),
      amount: finalReward,
      type: 'bonus',
      description: `Daily Reward Checkin (Streak Day ${user.streak})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);

    return { success: true, message: 'সফলভাবে ডেইলি রিওয়ার্ড ক্লেইম করা হয়েছে!', reward: finalReward };
  };

  const handleClaimBonusGame = (gameId: string, amount: number, description: string) => {
    if (user.lastBonusClaims?.[gameId]) {
      const lastClaimedDate = new Date(user.lastBonusClaims[gameId]!);
      const diffMs = Date.now() - lastClaimedDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 24) {
        return { success: false, message: `দুঃখিত! ২৪ ঘণ্টার আগে আপনি পুনরায় ক্লেইম করতে পারবেন না।` };
      }
    }

    const newBalance = user.balance + amount;
    const newEarned = user.earned + amount;
    const updatedClaims = {
      ...(user.lastBonusClaims || {}),
      [gameId]: new Date().toISOString()
    };

    setUser(prev => ({
      ...prev,
      balance: newBalance,
      earned: newEarned,
      lastBonusClaims: updatedClaims
    }));

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_bonus_' + Date.now(),
      amount: amount,
      type: 'earn',
      description: description,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);

    return { success: true };
  };

  const handleEarningReward = (amount: number, description: string) => {
    const newBalance = user.balance + amount;
    const newEarned = user.earned + amount;

    setUser(prev => ({
      ...prev,
      balance: newBalance,
      earned: newEarned,
    }));

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_bonus_' + Date.now(),
      amount: amount,
      type: 'earn',
      description: description,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleUpgradeVip = () => {
    const vipCost = 50.0;
    if (user.balance < vipCost) {
      return { success: false, message: 'উইথড্র ব্যালেন্স থেকে VIP নিতে নূন্যতম ৳৫০.০০ ব্যালেন্স থাকা লাগবে।' };
    }

    setUser(prev => ({
      ...prev,
      balance: prev.balance - vipCost,
      vipStatus: true,
    }));

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_vip_' + Date.now(),
      amount: vipCost,
      type: 'earn',
      description: 'Purchased VIP Membership Club',
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);

    return { success: true, message: 'অভিনন্দন! আপনি সফলভাবে VIP মেম্বারশিপে আপগ্রেড হয়েছেন।' };
  };

  const handleRequestWithdrawal = (method: 'BKASH' | 'NAGAD' | 'ROCKET', accountNo: string, amount: number) => {
    if (user.balance < amount) {
      return { success: false, message: 'উইথড্র করার জন্য আপনার পর্যাপ্ত ব্যালেন্স নেই।' };
    }

    const withdrawRequest: Withdrawal = {
      id: 'withdraw_' + Date.now(),
      userId: user.id,
      username: user.username,
      telegramId: user.telegramId,
      method,
      accountNumber: accountNo,
      amount,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    // Deduct balance
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    setWithdrawals(prev => [withdrawRequest, ...prev]);

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_wd_' + Date.now(),
      amount: amount,
      type: 'withdraw_pending',
      description: `Withdrawal Requested (${method}) to ${accountNo}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);

    return { success: true, message: 'উইথড্র রিকোয়েস্ট সফলভাবে গ্রহণ করা হয়েছে। এডমিন ভেরিফাই করে পেমেন্ট পাঠিয়ে দিবে।' };
  };

  // 3. Admin State Operations
  const handleApproveTaskSubmissionInAdmin = (submissionId: string) => {
    const sub = taskSubmissions.find(s => s.id === submissionId);
    if (!sub) return;

    setTaskSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'approved' } : s));

    // Credit user
    if (sub.userId === user.id) {
      setUser(prev => {
        const completed = [...prev.completedTasks];
        if (!completed.includes(sub.taskId)) {
          completed.push(sub.taskId);
        }
        return {
          ...prev,
          balance: prev.balance + sub.reward,
          earned: prev.earned + sub.reward,
          completedTasks: completed,
        };
      });
    } else {
      setUsers(prev => prev.map(u => {
        if (u.id === sub.userId) {
          const completed = [...(u.completedTasks || [])];
          if (!completed.includes(sub.taskId)) {
            completed.push(sub.taskId);
          }
          return {
            ...u,
            balance: u.balance + sub.reward,
            earned: u.earned + sub.reward,
            completedTasks: completed,
          };
        }
        return u;
      }));
    }

    // Record Transaction
    const tx: Transaction = {
      id: 'tx_task_app_' + Date.now(),
      amount: sub.reward,
      type: 'earn',
      description: `Task Verified & Approved: ${sub.taskName}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleRejectTaskSubmissionInAdmin = (submissionId: string) => {
    setTaskSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'rejected' } : s));
  };

  const handleUseSpinToken = () => {
    const tokens = user.spinTokens || 0;
    if (tokens < 1) return false;
    setUser(prev => ({
      ...prev,
      spinTokens: tokens - 1
    }));
    return true;
  };

  const handleUpdateUserInAdmin = (userId: string, updatedFields: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (userId === user.id) {
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const handleAddTaskInAdmin = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleDeleteTaskInAdmin = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleToggleTaskInAdmin = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isActive: !t.isActive } : t));
  };

  const handleUpdateWithdrawalStatusInAdmin = (withdrawalId: string, status: 'approved' | 'rejected') => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === withdrawalId) {
        // Return updated request
        return { ...w, status };
      }
      return w;
    }));

    const withdrawRecord = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawRecord) return;

    if (status === 'approved') {
      // Create approved transaction record
      const tx: Transaction = {
        id: 'tx_wd_app_' + Date.now(),
        amount: withdrawRecord.amount,
        type: 'withdraw_approved',
        description: `Withdrawal Approved (${withdrawRecord.method}) to ${withdrawRecord.accountNumber}`,
        timestamp: new Date().toISOString(),
      };
      setTransactions(prev => [tx, ...prev]);
    } else if (status === 'rejected') {
      // Refund user balance
      if (withdrawRecord.userId === user.id) {
        setUser(prev => ({
          ...prev,
          balance: prev.balance + withdrawRecord.amount,
        }));
      } else {
        setUsers(prev => prev.map(u => u.id === withdrawRecord.userId ? { ...u, balance: u.balance + withdrawRecord.amount } : u));
      }

      // Create rejected transaction record
      const tx: Transaction = {
        id: 'tx_wd_rej_' + Date.now(),
        amount: withdrawRecord.amount,
        type: 'withdraw_rejected',
        description: `Withdrawal Rejected (${withdrawRecord.method}) - Refunded`,
        timestamp: new Date().toISOString(),
      };
      setTransactions(prev => [tx, ...prev]);
    }
  };

  // Bottom Navigation tabs definitions
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bonus', label: 'Bonus', icon: Gift },
    { id: 'rank', label: 'Rank', icon: Trophy },
    { id: 'refer', label: 'Refer', icon: Share2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet2 },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${
      isDarkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* 1. Profile Header (Main Top Banner) */}
      <MainHeader 
        user={user}
        isDarkMode={isDarkMode}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSupport={() => setActiveView('support')}
      />

      {/* 2. Main Scrollable Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Standard Tab Views */}
            {activeView === 'home' && (
              <HomeView 
                user={user}
                tasks={tasks}
                adSlots={INITIAL_AD_SLOTS}
                announcement={announcement}
                isDarkMode={isDarkMode}
                onWatchAd={handleWatchAd}
                onCompleteTask={handleCompleteTask}
                onSelectView={setActiveView}
                taskSubmissions={taskSubmissions}
                onSubmitScreenshot={handleSubmitScreenshot}
              />
            )}

            {activeView === 'bonus' && (
              <BonusHub 
                isDarkMode={isDarkMode}
                onSelectView={setActiveView}
              />
            )}

            {activeView === 'rank' && (
              <RankView 
                user={user}
                leaderboard={INITIAL_LEADERBOARD}
                isDarkMode={isDarkMode}
              />
            )}

            {activeView === 'refer' && (
              <ReferView 
                user={user}
                isDarkMode={isDarkMode}
              />
            )}

            {activeView === 'wallet' && (
              <WalletView 
                user={user}
                transactions={transactions}
                isDarkMode={isDarkMode}
                onRequestWithdrawal={handleRequestWithdrawal}
              />
            )}

            {activeView === 'support' && (
              <SupportView isDarkMode={isDarkMode} />
            )}

            {/* Extra Interactive Mini Games */}
            {activeView === 'daily-reward' && (
              <DailyRewardView 
                user={user}
                isDarkMode={isDarkMode}
                onClaimDaily={handleClaimDailyReward}
              />
            )}

            {activeView === 'spin-wheel' && (
              <SpinWheelView 
                user={user}
                isDarkMode={isDarkMode}
                onRewardUser={(amount, description) => handleClaimBonusGame('spin-wheel', amount, description)}
                onUseSpinToken={handleUseSpinToken}
              />
            )}

            {activeView === 'scratch-card' && (
              <ScratchCardView 
                user={user}
                isDarkMode={isDarkMode}
                onRewardUser={(amount, description) => handleClaimBonusGame('scratch-card', amount, description)}
              />
            )}

            {activeView === 'quiz' && (
              <QuizView 
                user={user}
                isDarkMode={isDarkMode}
                onRewardUser={(amount, description) => handleClaimBonusGame('quiz', amount, description)}
              />
            )}

            {activeView === 'mystery-box' && (
              <MysteryBoxView 
                user={user}
                isDarkMode={isDarkMode}
                onRewardUser={(amount, description) => handleClaimBonusGame('mystery-box', amount, description)}
              />
            )}

            {activeView === 'vip-status' && (
              <VipStatusView 
                user={user}
                isDarkMode={isDarkMode}
                onUpgradeVip={handleUpgradeVip}
              />
            )}

            {activeView === 'achievements' && (
              <AchievementsView 
                user={user}
                isDarkMode={isDarkMode}
                onRewardUser={handleEarningReward}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Bottom Tab Navigation Bar */}
      <nav className={`fixed bottom-0 inset-x-0 z-30 border-t py-2 px-3 flex justify-around items-center backdrop-blur-md shadow-lg ${
        isDarkMode 
          ? 'bg-[#0f172a]/90 border-slate-800 text-slate-400' 
          : 'bg-white/95 border-slate-200 text-slate-500'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Determine if tab matches active view (or subviews within that category)
          const isSelected = activeView === tab.id || 
            (tab.id === 'bonus' && ['daily-reward', 'spin-wheel', 'scratch-card', 'quiz', 'mystery-box', 'vip-status', 'achievements'].includes(activeView));

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all relative ${
                isSelected 
                  ? 'text-blue-500 scale-105 font-bold' 
                  : 'hover:text-slate-300'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              {isSelected && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-blue-500/10 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. Sliding Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeView={activeView}
            onSelectView={setActiveView}
            telegramId={user.telegramId}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}
      </AnimatePresence>

      {/* 5. Secret Admin Full-Screen Panel overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            users={users}
            onUpdateUser={handleUpdateUserInAdmin}
            tasks={tasks}
            onAddTask={handleAddTaskInAdmin}
            onDeleteTask={handleDeleteTaskInAdmin}
            onToggleTask={handleToggleTaskInAdmin}
            withdrawals={withdrawals}
            onUpdateWithdrawalStatus={handleUpdateWithdrawalStatusInAdmin}
            onClose={() => setIsAdminOpen(false)}
            announcement={announcement}
            onChangeAnnouncement={setAnnouncement}
            taskSubmissions={taskSubmissions}
            onApproveTaskSubmission={handleApproveTaskSubmissionInAdmin}
            onRejectTaskSubmission={handleRejectTaskSubmissionInAdmin}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
