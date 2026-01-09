
import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
        <div>
          <h4 className="font-black text-white uppercase tracking-widest text-sm">Transaction Ledger</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Real-time execution history</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total: {transactions.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/50 bg-slate-950/30">
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Execution Price</th>
              <th className="px-6 py-4 text-right">Total (USDT)</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium italic text-slate-500">No transactions recorded in this session.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-300">
                        {new Date(t.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(t.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${
                      t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' :
                      t.type === 'SELL' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-white">{t.asset.replace('USDT', '')}/USDT</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-mono font-bold text-slate-300">{t.amount.toFixed(6)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-mono text-slate-400">${t.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs font-black ${t.type === 'SELL' || t.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {t.type === 'SELL' ? '+' : ''}${Math.abs(t.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Filled</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-950/30 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <span>Blockchain Simulator ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        <span className="text-slate-600 italic">Historical data persisted locally</span>
      </div>
    </div>
  );
};

export default TransactionHistory;
