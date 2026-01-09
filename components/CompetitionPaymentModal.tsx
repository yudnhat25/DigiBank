
import React, { useState } from 'react';
import { ENTRY_FEE } from '../constants';

interface CompetitionPaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CompetitionPaymentModal: React.FC<CompetitionPaymentModalProps> = ({ onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        {/* Stripe Branded Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-[#635BFF]" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36.364C10.963 36.364 3.636 29.037 3.636 20S10.963 3.636 20 3.636 36.364 10.963 36.364 20s-7.327 16.364-16.364 16.364z"/>
            </svg>
            <span className="font-bold text-2xl tracking-tight text-[#635BFF]">Stripe <span className="text-slate-400 font-medium text-sm">Competition Entry</span></span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">Total Due</p>
          <p className="text-4xl font-black text-slate-900">${ENTRY_FEE.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Card Details</label>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <input readOnly value="4242 4242 4242 4242" className="bg-transparent border-none p-0 focus:ring-0 text-slate-700 font-medium flex-1" />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                   <input readOnly value="12 / 26" className="bg-transparent border-none p-0 focus:ring-0 text-slate-700 font-medium w-full" />
                </div>
                <div className="flex items-center gap-2 w-16">
                   <input readOnly value="CVC" className="bg-transparent border-none p-0 focus:ring-0 text-slate-400 font-medium w-full text-right" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A3.333 3.333 0 0121 12c0 1.237-.47 2.364-1.243 3.208a3.333 3.333 0 01-1.238 3.208c-.844.773-1.971 1.243-3.208 1.243a3.333 3.333 0 01-3.208 1.243c-1.237 0-2.364-.47-3.208-1.243a3.333 3.333 0 01-3.208-1.243C1.47 16.364 1 15.237 1 14c0-1.237.47-2.364 1.243-3.208A3.333 3.333 0 013.481 7.584c.844-.773 1.971-1.243 3.208-1.243a3.333 3.333 0 013.208-1.243c1.237 0 2.364.47 3.208 1.243a3.333 3.333 0 013.208 1.243z"></path></svg>
            <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
              Secured simulation payment. Your actual CoinWise balance will not be deducted for this specific contest entry.
            </p>
          </div>

          <button 
            disabled={isProcessing}
            className="w-full bg-[#635BFF] hover:bg-[#5851e0] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[#635BFF]/20 disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing Payment...
              </>
            ) : (
              `Pay $${ENTRY_FEE.toFixed(2)} & Enter Arena`
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 font-medium">
            By paying, you agree to the Competition Terms and PNL Calculation Rules.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompetitionPaymentModal;
