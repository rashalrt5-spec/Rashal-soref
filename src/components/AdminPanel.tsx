import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Wallet, Check, X, ShieldAlert, Award, Play, AlertCircle, Plus, Trash2, Edit3, Settings, 
  ArrowLeft, RefreshCw, Sparkles, TrendingUp, DollarSign
} from 'lucide-react';
import { User, Task, Withdrawal, AdSlot, TaskSubmission } from '../types';

interface AdminPanelProps {
  users: User[];
  onUpdateUser: (userId: string, updatedFields: Partial<User>) => void;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  withdrawals: Withdrawal[];
  onUpdateWithdrawalStatus: (withdrawalId: string, status: 'approved' | 'rejected') => void;
  onClose: () => void;
  announcement: string;
  onChangeAnnouncement: (text: string) => void;
  taskSubmissions?: TaskSubmission[];
  onApproveTaskSubmission: (submissionId: string) => void;
  onRejectTaskSubmission: (submissionId: string) => void;
}

export default function AdminPanel({
  users,
  onUpdateUser,
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleTask,
  withdrawals,
  onUpdateWithdrawalStatus,
  onClose,
  announcement,
  onChangeAnnouncement,
  taskSubmissions = [],
  onApproveTaskSubmission,
  onRejectTaskSubmission,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'withdrawals' | 'submissions' | 'users' | 'tasks' | 'settings'>('stats');
  const [searchUser, setSearchUser] = useState('');
  
  // States for adding a new task
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('0.5');
  const [newTaskLink, setNewTaskLink] = useState('https://t.me/');

  // State for editing a user's balance
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newBalanceValue, setNewBalanceValue] = useState('');
  const [newReferralsValue, setNewReferralsValue] = useState('');

  // Calculations
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const totalPaid = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);
  const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName || !newTaskReward || !newTaskLink) return;
    
    const task: Task = {
      id: 'task_' + Date.now(),
      name: newTaskName,
      reward: parseFloat(newTaskReward) || 0.5,
      link: newTaskLink,
      isActive: true,
    };
    onAddTask(task);
    setNewTaskName('');
    setNewTaskReward('0.5');
    setNewTaskLink('https://t.me/');
  };

  const handleSaveUserEdit = (userId: string) => {
    const updatedFields: Partial<User> = {};
    if (newBalanceValue !== '') {
      updatedFields.balance = parseFloat(newBalanceValue) || 0;
    }
    if (newReferralsValue !== '') {
      updatedFields.referralsCount = parseInt(newReferralsValue) || 0;
    }
    onUpdateUser(userId, updatedFields);
    setEditingUserId(null);
    setNewBalanceValue('');
    setNewReferralsValue('');
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.telegramId.includes(searchUser)
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-slate-100 overflow-y-auto font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-10 bg-[#1e293b] border-b border-slate-700 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            id="admin-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-500 animate-pulse" /> সিক্রেট গেটওয়ে
            </h1>
            <p className="text-xs text-slate-400">Control & system overview</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-slate-300 font-mono">Rashal Mode Active</span>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="bg-[#111827] border-b border-slate-800 px-4 overflow-x-auto whitespace-nowrap scrollbar-none py-2 flex gap-2">
        {(['stats', 'withdrawals', 'submissions', 'users', 'tasks', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            id={`admin-tab-${tab}`}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab === 'stats' && '📊 Stats'}
            {tab === 'withdrawals' && `💸 Withdrawals (${pendingWithdrawals.length})`}
            {tab === 'submissions' && `📝 Submissions (${taskSubmissions.filter(s => s.status === 'pending').length})`}
            {tab === 'users' && '👥 Users'}
            {tab === 'tasks' && '🛠️ Tasks'}
            {tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main className="flex-1 p-4 max-w-5xl mx-auto w-full pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-slate-400">
                      <span className="text-xs font-medium">Total Users</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold font-mono">{users.length}</span>
                      <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> Live & active
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-slate-400">
                      <span className="text-xs font-medium">Pending Requests</span>
                      <Wallet className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold font-mono text-amber-400">{pendingWithdrawals.length}</span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Amount: <span className="font-mono text-yellow-500 font-bold">৳{totalPendingAmount.toFixed(1)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-slate-400">
                      <span className="text-xs font-medium">Total Paid Out</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold font-mono text-emerald-400">৳{totalPaid.toFixed(1)}</span>
                      <p className="text-[10px] text-slate-400 mt-1">Processed successfully</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-slate-400">
                      <span className="text-xs font-medium">Active Tasks</span>
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold font-mono">{tasks.filter(t => t.isActive).length}</span>
                      <p className="text-[10px] text-slate-400 mt-1">Earning programs active</p>
                    </div>
                  </div>
                </div>

                {/* System Notice */}
                <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-300">Admin Control Guidance</h4>
                    <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">
                      This Admin Console controls all live variables inside the app. Updates made here are applied instantly to local cache storage. 
                      You can simulate withdrawals and instantly approve them, which moves funds from pending status to successfully paid status.
                    </p>
                  </div>
                </div>

                {/* Pending Withdrawal Summary Table */}
                <div className="bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Pending Withdrawals</h3>
                    <button onClick={() => setActiveTab('withdrawals')} className="text-[11px] text-blue-400 hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-slate-800">
                    {pendingWithdrawals.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">No pending requests at the moment.</div>
                    ) : (
                      pendingWithdrawals.slice(0, 3).map((w) => (
                        <div key={w.id} className="p-3 flex justify-between items-center text-xs hover:bg-slate-800/20 transition-all">
                          <div>
                            <p className="font-semibold">{w.username} ({w.method})</p>
                            <p className="text-[10px] text-slate-400 font-mono">No: {w.accountNumber}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-amber-400 font-mono">৳{w.amount}</span>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => onUpdateWithdrawalStatus(w.id, 'approved')}
                                className="p-1 bg-emerald-600/80 hover:bg-emerald-600 rounded text-white"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => onUpdateWithdrawalStatus(w.id, 'rejected')}
                                className="p-1 bg-rose-600/80 hover:bg-rose-600 rounded text-white"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* WITHDRAWALS TAB */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Withdrawal Management</h3>
                <div className="bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                  {withdrawals.length === 0 ? (
                    <div className="p-10 text-center text-xs text-slate-500">No withdrawal records found.</div>
                  ) : (
                    withdrawals.map((w) => (
                      <div key={w.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-200">{w.username}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">ID: {w.telegramId}</span>
                          </div>
                          <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span>Method: <strong className="text-blue-400">{w.method}</strong></span>
                            <span>Number: <strong className="font-mono text-slate-200">{w.accountNumber}</strong></span>
                            <span>Time: <span className="font-mono text-[10px]">{new Date(w.timestamp).toLocaleTimeString()} {new Date(w.timestamp).toLocaleDateString()}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/50">
                          <div className="text-right">
                            <p className="text-sm font-bold font-mono text-emerald-400">৳{w.amount} TK</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              w.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {w.status}
                            </span>
                          </div>

                          {w.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => onUpdateWithdrawalStatus(w.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => onUpdateWithdrawalStatus(w.id, 'rejected')}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUBMISSIONS TAB */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Task Verification & Screenshots</h3>
                <div className="bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                  {taskSubmissions.length === 0 ? (
                    <div className="p-10 text-center text-xs text-slate-500">No task submissions found.</div>
                  ) : (
                    taskSubmissions.map((s) => (
                      <div key={s.id} className="p-4 flex flex-col md:flex-row justify-between gap-4 hover:bg-slate-800/20 transition-all">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-200">{s.username}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">ID: {s.telegramId}</span>
                          </div>
                          <div className="text-xs text-slate-400 space-y-1">
                            <p>টাস্ক: <strong className="text-blue-400">{s.taskName}</strong></p>
                            <p>রিওয়ার্ড: <strong className="text-emerald-400 font-mono">৳{s.reward.toFixed(2)} TK</strong></p>
                            <p>সময়: <span className="font-mono text-[10px]">{new Date(s.timestamp).toLocaleTimeString()} {new Date(s.timestamp).toLocaleDateString()}</span></p>
                            <p>স্ট্যাটাস: <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              s.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>{s.status}</span></p>
                          </div>
                        </div>

                        {/* Screenshot Visualizer and Zoom */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start md:items-center">
                          {s.screenshot && (
                            <div className="relative group border border-slate-700 rounded-lg overflow-hidden bg-slate-900 w-full sm:w-44 h-28 flex items-center justify-center">
                              <img 
                                src={s.screenshot} 
                                alt="Proof screenshot" 
                                className="w-full h-full object-contain max-h-28"
                              />
                              <a 
                                href={s.screenshot} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition-opacity"
                              >
                                ক্লিক করে বড় করুন
                              </a>
                            </div>
                          )}

                          {s.status === 'pending' && (
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => onApproveTaskSubmission(s.id)}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => onRejectTaskSubmission(s.id)}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Directory ({users.length})</h3>
                  <div className="w-full sm:w-64">
                    <input 
                      type="text"
                      placeholder="Search username or telegramId..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                  {filteredUsers.length === 0 ? (
                    <div className="p-10 text-center text-xs text-slate-500">No users match your search.</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="p-4 space-y-3 hover:bg-slate-800/10 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{user.username}</span>
                              {user.vipStatus && (
                                <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.2 rounded font-bold">VIP</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {user.telegramId}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Balance</p>
                            <p className="text-sm font-bold font-mono text-blue-400">৳{user.balance.toFixed(2)} TK</p>
                          </div>
                        </div>

                        {/* Edit Section / Stats */}
                        {editingUserId === user.id ? (
                          <div className="bg-[#1e293b]/60 p-3 rounded-lg border border-slate-700 flex flex-wrap gap-3 items-end">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block font-medium">New Balance (TK)</label>
                              <input 
                                type="number" 
                                step="0.01"
                                placeholder={user.balance.toString()}
                                value={newBalanceValue}
                                onChange={(e) => setNewBalanceValue(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block font-medium">New Referrals Count</label>
                              <input 
                                type="number" 
                                placeholder={user.referralsCount.toString()}
                                value={newReferralsValue}
                                onChange={(e) => setNewReferralsValue(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => handleSaveUserEdit(user.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingUserId(null)}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
                            <div className="flex gap-x-4">
                              <span>Referrals: <strong className="text-slate-200">{user.referralsCount}</strong></span>
                              <span>Streak: <strong className="text-slate-200">{user.streak}</strong></span>
                              <span>Completed Tasks: <strong className="text-slate-200">{user.completedTasks.length}</strong></span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setNewBalanceValue(user.balance.toString());
                                setNewReferralsValue(user.referralsCount.toString());
                              }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit Stats
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                {/* Add New Task Form */}
                <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-blue-500" /> Create Earning Task
                  </h4>
                  <form onSubmit={handleAddTaskSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 block font-medium">Task Name</label>
                      <input 
                        type="text"
                        placeholder="e.g., Join Channel XYZ"
                        required
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 block font-medium">Earning Reward (TK)</label>
                      <input 
                        type="number"
                        step="0.1"
                        required
                        value={newTaskReward}
                        onChange={(e) => setNewTaskReward(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 block font-medium">Telegram/Invite Link</label>
                      <input 
                        type="url"
                        required
                        value={newTaskLink}
                        onChange={(e) => setNewTaskLink(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                    </div>
                  </form>
                </div>

                {/* Active Tasks Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Live Tasks</h3>
                  <div className="bg-slate-800/30 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/10 transition-all">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-200 truncate">{task.name}</span>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold font-mono text-blue-400">
                              ৳{task.reward.toFixed(2)} TK
                            </span>
                          </div>
                          <a 
                            href={task.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-slate-400 truncate block hover:underline mt-0.5"
                          >
                            {task.link}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleTask(task.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              task.isActive 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {task.isActive ? 'Active' : 'Disabled'}
                          </button>

                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-blue-500" /> General Announcement settings
                  </h4>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-medium">Home Page Announcement Banner Text</label>
                    <textarea 
                      rows={3}
                      value={announcement}
                      onChange={(e) => onChangeAnnouncement(e.target.value)}
                      placeholder="Enter banner announcement in Bengali or English..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      This text appears inside the animated sliding banner at the top of the homepage (e.g. "আপনার চ্যানেল বটে এড করতে চাইলে এখানে ক্লিক করুন").
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Payment Gateway Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
                      <p className="font-bold text-xs text-white">bKash Integration</p>
                      <p className="text-[10px] text-slate-400 mt-1">Minimum withdraw: ৳100. Status: Active</p>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
                      <p className="font-bold text-xs text-white">Nagad Integration</p>
                      <p className="text-[10px] text-slate-400 mt-1">Minimum withdraw: ৳100. Status: Active</p>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
                      <p className="font-bold text-xs text-white">Rocket Integration</p>
                      <p className="text-[10px] text-slate-400 mt-1">Minimum withdraw: ৳100. Status: Active</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
