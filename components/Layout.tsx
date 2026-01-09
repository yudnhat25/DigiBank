
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; accountId: string; competition?: { isCompeting: boolean } };
  onLogout: () => void;
  activeTab: 'dashboard' | 'competition';
  setActiveTab: (tab: 'dashboard' | 'competition') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">CW</div>
          <h1 className="text-xl font-black tracking-tighter">CoinWise</h1>
        </div>
        
        <nav className="flex-1 py-8">
          <ul className="space-y-3 px-4">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 font-black shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"></path></svg>
                Terminal
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('competition')}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all relative ${activeTab === 'competition' ? 'bg-emerald-500/10 text-emerald-400 font-black shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                Arena
                {user.competition?.isCompeting && <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black uppercase text-emerald-500">
                {user.name.substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">{user.name}</p>
                <p className="text-[10px] text-slate-600 truncate uppercase font-bold tracking-tighter">{user.accountId}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
