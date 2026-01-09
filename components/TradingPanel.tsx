
import React, { useState, useMemo, useEffect } from 'react';
import { MarketData, UserState } from '../types';

interface TradingPanelProps {
  marketData: MarketData[];
  userState: UserState;
  onTrade: (type: 'BUY' | 'SELL', symbol: string, amount: number, price: number) => void;
  onDeposit: (amount: number) => void;
  selectedAsset: string;
  onAssetChange: (symbol: string) => void;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ 
  marketData, 
  userState, 
  onTrade, 
  onDeposit, 
  selectedAsset, 
  onAssetChange 
}) => {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState<string>('0');
  const [priceOverride, setPriceOverride] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(25);
  const [useRiskManagement, setUseRiskManagement] = useState(false);
  
  const activeMarket = marketData.find(m => m.symbol === selectedAsset);
  const currentPrice = activeMarket?.price || 0;
  const displayPrice = priceOverride !== null ? parseFloat(priceOverride) : currentPrice;
  const userAssetAmount = userState.assets.find(a => a.symbol === selectedAsset)?.amount || 0;
  
  const filteredMarkets = useMemo(() => {
    return marketData.filter(m => m.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [marketData, searchQuery]);

  // Sync price when market moves, if not overridden
  useEffect(() => {
    if (priceOverride === null && currentPrice > 0) {
      // Do nothing, UI uses currentPrice
    }
  }, [currentPrice]);

  const maxBuyAmount = userState.balance / (displayPrice || 1);
  const maxAmount = tradeType === 'BUY' ? maxBuyAmount : userAssetAmount;

  const handlePercentageClick = (p: number) => {
    setPercentage(p);
    const calculated = (maxAmount * (p / 100)).toFixed(6);
    setAmount(calculated);
  };

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    onTrade(tradeType, selectedAsset, numAmount, displayPrice);
    setAmount('0');
    setPriceOverride(null);
  };

  const totalCost = (parseFloat(amount) || 0) * displayPrice;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
        {/* Buy/Sell Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setTradeType('BUY')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tradeType === 'BUY' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Buy
          </button>
          <button 
            onClick={() => setTradeType('SELL')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tradeType === 'SELL' ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Sell
          </button>
        </div>

        <div className="space-y-5">
          {/* Asset Selector */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset</label>
              <span className="text-[10px] text-slate-400">Available: {tradeType === 'BUY' ? `${userState.balance.toLocaleString()} USDT` : `${userAssetAmount.toFixed(4)} ${selectedAsset.replace('USDT', '')}`}</span>
            </div>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 flex justify-between items-center transition-all hover:bg-slate-800"
            >
              <span className="font-bold">{selectedAsset}</span>
              <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-slate-700">
                  <input 
                    type="text" autoFocus placeholder="Search symbols..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredMarkets.map(m => (
                    <button 
                      key={m.symbol}
                      onClick={() => { onAssetChange(m.symbol); setIsDropdownOpen(false); }}
                      className="w-full text-left px-5 py-3 text-xs hover:bg-slate-700 flex justify-between"
                    >
                      <span className="font-bold">{m.symbol}</span>
                      <span className="text-slate-500">${m.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price (USDT)</label>
            <div className="relative">
              <input 
                type="number" 
                value={priceOverride !== null ? priceOverride : currentPrice}
                onChange={(e) => setPriceOverride(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
              {priceOverride !== null && (
                <button onClick={() => setPriceOverride(null)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-black uppercase">Auto</button>
              )}
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Amount ({selectedAsset.replace('USDT', '')})</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
          </div>

          {/* Percentage Slider */}
          <div className="space-y-3">
             <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
               <span>Allocation</span>
               <span className="text-emerald-500">{percentage}%</span>
             </div>
             <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map(p => (
                  <button 
                    key={p} onClick={() => handlePercentageClick(p)}
                    className={`py-2 text-[10px] font-black rounded-lg border transition-all ${percentage === p ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}%
                  </button>
                ))}
             </div>
          </div>

          {/* Risk Management Toggle */}
          <div className="pt-2">
            <button 
              onClick={() => setUseRiskManagement(!useRiskManagement)}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300"
            >
              <div className={`w-8 h-4 rounded-full relative transition-colors ${useRiskManagement ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${useRiskManagement ? 'left-4.5' : 'left-0.5'}`} />
              </div>
              Risk Management
            </button>
            {useRiskManagement && (
              <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-[9px] font-black text-slate-600 uppercase mb-1">Stop Loss</label>
                  <input type="text" placeholder="-5%" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-400 outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-600 uppercase mb-1">Take Profit</label>
                  <input type="text" placeholder="+10%" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Total Cost */}
          <div className="pt-4 border-t border-slate-800/50">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimated Total</span>
              <span className="text-xl font-black text-white">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button 
            onClick={handleTrade}
            disabled={totalCost > userState.balance && tradeType === 'BUY'}
            className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${tradeType === 'BUY' ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' : 'bg-rose-500 text-slate-950 shadow-rose-500/20'}`}
          >
            {tradeType} {selectedAsset.replace('USDT', '')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
