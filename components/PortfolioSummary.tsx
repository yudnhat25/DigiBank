
import React from 'react';
import { UserState, MarketData } from '../types';

interface PortfolioSummaryProps {
  userState: UserState;
  marketPrices: MarketData[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ userState, marketPrices }) => {
  const getAssetValue = () => {
    return userState.assets.reduce((acc, asset) => {
      const marketPrice = marketPrices.find(m => m.symbol === asset.symbol)?.price || 0;
      return acc + (asset.amount * marketPrice);
    }, 0);
  };

  const assetValue = getAssetValue();
  const totalValue = userState.balance + assetValue;
  const initialValue = 1000000; // Starting capital
  const pnlPercent = ((totalValue - initialValue) / initialValue) * 100;
  
  // Calculate unrealized loss (drawdown) - for demo we sum negative PNLs of individual assets
  const totalLoss = userState.assets.reduce((acc, asset) => {
    const marketPrice = marketPrices.find(m => m.symbol === asset.symbol)?.price || 0;
    // We assume entry price for loss calculation is baseline or use transaction history
    const entryPrice = userState.transactions.find(t => t.asset === asset.symbol)?.price || marketPrice;
    const loss = (marketPrice < entryPrice) ? (entryPrice - marketPrice) * asset.amount : 0;
    return acc + loss;
  }, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* PNL Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-2 ${pnlPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={pnlPercent >= 0 ? "M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-9-9-4 4-6-6"} />
          </svg>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">PNL %</p>
        <h3 className={`text-2xl font-black ${pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
        </h3>
        <p className="text-[10px] text-slate-500 mt-1">Relative to Entry</p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available Balance</p>
        <h3 className="text-2xl font-black text-white">
          ${userState.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-[10px] text-slate-500 mt-1">USDT Wallet</p>
      </div>

      {/* Drawdown Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Unrealized Loss</p>
        <h3 className="text-2xl font-black text-rose-500">
          -${totalLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-[10px] text-slate-500 mt-1">Current Drawdown</p>
      </div>

      {/* Metric Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Positions</p>
        <h3 className="text-2xl font-black text-white">{userState.assets.length}</h3>
        <p className="text-[10px] text-slate-500 mt-1">Open Orders: 0</p>
      </div>
    </div>
  );
};

export default PortfolioSummary;
