
import { Module, Level } from '../types';

export const BUNDLES = [
  {
    id: 'beginner',
    title: 'Beginner: Foundations of Survival',
    goal: 'Shift focus from profits to risk containment.',
    moneyRule: 'Demo account only. 100 successful trades before $1.',
    mindset: 'You are a student, not a trader. Your job is to learn the software and stay alive.'
  },
  {
    id: 'intermediate',
    title: 'Intermediate: Execution Discipline',
    goal: 'Master one setup within one session.',
    moneyRule: 'Micro account only. Maximum 1% risk per trade.',
    mindset: 'Precision is your only metric. PnL is irrelevant.'
  },
  {
    id: 'advanced',
    title: 'Advanced: Scaling Expectancy',
    goal: 'Handle larger capital with psychological neutrality.',
    moneyRule: 'Standard account. R-multiple management.',
    mindset: 'You are an execution machine. Emotions are data points to be observed.'
  }
];

export const MODULES: Module[] = [
  {
    id: 'm1',
    title: 'The BTC-Only Philosophy',
    level: 'beginner',
    order: 1,
    objective: 'Understand why specializing in one instrument is the only path to mastery.',
    whyItMatters: 'Context is everything. Every pair has a "personality." By trading only BTC, you learn its nuances, liquidity patterns, and manipulation cycles.',
    explanation: 'Most traders fail because they jump from pair to pair looking for "setups." Mastery comes from depth, not breadth.',
    btcExample: 'BTCUSDT has unique volatility profiles during the London open that differ significantly from legacy FX pairs.',
    commonMistakes: ['Checking altcoins for signals', 'Comparing BTC to ETH for confirmation', 'Diversifying across too many pairs'],
    rulesSummary: ['BTCUSDT Perpetual ONLY', 'No other tabs open', 'Study historical BTC price action for 2 hours daily'],
    journalTask: 'Observe BTC for 3 hours without taking a trade. Write down 5 things you noticed about how it moves near major round numbers.'
  },
  {
    id: 'm2',
    title: 'Risk as a Function of R',
    level: 'beginner',
    order: 2,
    objective: 'Decouple emotional attachment to money from trading decisions.',
    whyItMatters: 'When you think in dollars, you hesitate. When you think in R, you execute.',
    explanation: '1R is your predefined unit of risk. Whether you trade with $10 or $10,000, 1R remains 1R.',
    btcExample: 'A 500-point stop loss on BTC is 1R. If you hit your target at 1500 points, you gained 3R.',
    commonMistakes: ['Calculating profits in USD during a trade', 'Increasing risk to "recover" losses', 'Thinking in percentages rather than fixed R'],
    rulesSummary: ['Every trade is 1R', 'Never move your stop loss once set', 'Max loss per day = 2R'],
    journalTask: 'Define your 1R value for a demo account and record 5 simulated trades using only R-multiples for results.'
  },
  {
    id: 'm3',
    title: 'The Time Box: 5–9 PM PKT',
    level: 'beginner',
    order: 3,
    objective: 'Limit market exposure to peak volatility.',
    whyItMatters: 'Trading outside high-volume sessions leads to "chop" and overtrading. The London-NY overlap is when the big players move.',
    explanation: 'Restrict your environment to the 4 hours where the most significant moves happen.',
    btcExample: 'Volatility typically peaks around 5:30 PM PKT as London and NY participants both hunt liquidity.',
    commonMistakes: ['Trading at 2 AM', 'Leaving trades open overnight', 'Staring at charts all day'],
    rulesSummary: ['Charts closed before 5 PM', 'Charts closed after 9 PM', 'No exceptions'],
    journalTask: 'Mark the 5-9 PM PKT window on your charts for the last 5 days. Compare the volume inside versus outside this window.'
  }
];

export const CHECKPOINTS = {
  beginner: [
    'Can explain the "personality" of BTC liquidity',
    'Minimum 50 demo trades logged in R-multiples',
    'Zero violations of the 5-9 PM session rule for 10 consecutive days',
    'Can calculate position size in 15 seconds'
  ],
  intermediate: [
    'Positive expectancy over 100 micro-account trades',
    'No "revenge trades" recorded in journal',
    'Emotional state stays neutral during drawdown'
  ]
};
