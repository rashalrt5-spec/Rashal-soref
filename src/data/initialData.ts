import { Task, AdSlot, LeaderboardEntry, QuizQuestion, Withdrawal } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_income_bot',
    name: 'income bot',
    reward: 0.5,
    link: 'https://t.me/income_earning_bot',
    isActive: true,
  },
  {
    id: 'task_officials_chanel',
    name: 'Officials Chanel',
    reward: 0.5,
    link: 'https://t.me/officials_channel',
    isActive: true,
  },
  {
    id: 'task_officials_income_chanel',
    name: 'Officials Income Chanel',
    reward: 0.5,
    link: 'https://t.me/officials_income_channel',
    isActive: true,
  },
  {
    id: 'task_join_group',
    name: 'Fast Money Public Group',
    reward: 0.8,
    link: 'https://t.me/fastmoney_group',
    isActive: true,
  }
];

export const INITIAL_AD_SLOTS: AdSlot[] = [
  {
    id: 'ad_slot_1',
    name: 'Ad Slot 1',
    reward: 0.5,
    maxViews: 50,
  },
  {
    id: 'ad_slot_2',
    name: 'Ad Slot 2',
    reward: 0.2,
    maxViews: 15,
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { username: 'Nipa', telegramId: '458923485', referralsCount: 45 },
  { username: 'Owner Sumit', telegramId: '849204325', referralsCount: 45 },
  { username: 'Eshrat Jahan', telegramId: '124958320', referralsCount: 31 },
  { username: 'স্বাধীন', telegramId: '904582319', referralsCount: 29 },
  { username: 'STRK OWNER 🇦🇷', telegramId: '459328405', referralsCount: 16 },
  { username: 'Queen(عربي)❤️❤️', telegramId: '849302148', referralsCount: 15 },
  { username: 'ইমরান হোসাইন', telegramId: '540321485', referralsCount: 14 },
  { username: '☠️☬Nirob Hasan☬☠️', telegramId: '349583201', referralsCount: 14 },
  { username: 'Md Rakib', telegramId: '749302145', referralsCount: 12 },
  { username: 'Ashikur Rahman', telegramId: '104938210', referralsCount: 10 }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '৫ + ৭ = কত?',
    options: ['১০', '১১', '১২', '১৩'],
    correctIndex: 2,
    reward: 0.3
  },
  {
    id: 'q2',
    question: 'কোনটি বাংলাদেশের জাতীয় ফুল?',
    options: ['গোলাপ', 'শাপলা', 'জবা', 'সূর্যমুখী'],
    correctIndex: 1,
    reward: 0.5
  },
  {
    id: 'q3',
    question: '১০ x ৫ = কত?',
    options: ['৪০', '৪৫', '৫০', '৫৫'],
    correctIndex: 2,
    reward: 0.3
  },
  {
    id: 'q4',
    question: 'কম্পিউটারের মস্তিস্ক কোনটি?',
    options: ['RAM', 'CPU', 'Hard Disk', 'Monitor'],
    correctIndex: 1,
    reward: 0.5
  },
  {
    id: 'q5',
    question: 'বাংলাদেশে প্রচলিত মোবাইল ব্যাংকিং সেবা কোনটি?',
    options: ['PayPal', 'Stripe', 'bKash', 'Payoneer'],
    correctIndex: 2,
    reward: 0.4
  }
];

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'withdraw_1',
    userId: 'user_dummy_1',
    username: 'Arif Ahmed',
    telegramId: '784234051',
    method: 'BKASH',
    accountNumber: '01712345678',
    amount: 150,
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'withdraw_2',
    userId: 'user_dummy_2',
    username: 'Sumaiya Akter',
    telegramId: '985423019',
    method: 'NAGAD',
    accountNumber: '01987654321',
    amount: 200,
    status: 'approved',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
  {
    id: 'withdraw_3',
    userId: 'user_dummy_3',
    username: 'Hasan Ali',
    telegramId: '450321948',
    method: 'ROCKET',
    accountNumber: '01511223344',
    amount: 100,
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
  }
];
