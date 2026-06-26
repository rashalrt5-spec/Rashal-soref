export interface User {
  id: string;
  username: string;
  telegramId: string;
  balance: number;
  earned: number;
  referralsCount: number;
  streak: number;
  lastDailyRewardClaimed: string | null; // ISO string
  vipStatus: boolean;
  completedTasks: string[]; // List of task IDs
  adViews: { [slotId: string]: number }; // Maps slotId to watched count for today
  lastAdWatched: { [slotId: string]: string | null }; // Maps slotId to last watched time
  referrals: string[]; // List of referred user names
  streakLastUpdated: string | null; // ISO string
  spinTokens?: number; // Spin wheel tokens ("চরকা")
  lastBonusClaims?: { [gameId: string]: string | null }; // Maps game/bonus ID to last claimed ISO string
}

export interface TaskSubmission {
  id: string;
  userId: string;
  username: string;
  telegramId: string;
  taskId: string;
  taskName: string;
  reward: number;
  screenshot: string; // base64 representation of uploaded image
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string; // ISO string
}

export interface Task {
  id: string;
  name: string;
  reward: number;
  link: string;
  isActive: boolean;
}

export interface AdSlot {
  id: string;
  name: string;
  reward: number;
  maxViews: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  telegramId: string;
  method: 'BKASH' | 'NAGAD' | 'ROCKET';
  accountNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string; // ISO string
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'withdraw_pending' | 'withdraw_approved' | 'withdraw_rejected' | 'bonus' | 'referral';
  description: string;
  timestamp: string; // ISO string
}

export interface LeaderboardEntry {
  username: string;
  telegramId: string;
  referralsCount: number;
  avatarUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  reward: number;
}
