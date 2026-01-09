
export interface Asset {
  symbol: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT';
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: number;
}

export interface CompetitionStats {
  isCompeting: boolean;
  entryNetWorth: number;
  entryTime: number;
  pnlPercent: number;
  currentRank: number;
}

export interface UserState {
  balance: number;
  assets: Asset[];
  transactions: Transaction[];
  name: string;
  accountId: string;
  password?: string;
  competition?: CompetitionStats;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  accountId?: string; // Added for matching real users
  pnl: number;
  value: number;
  isUser?: boolean;
}

export interface UsersMap {
  [accountId: string]: UserState;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
