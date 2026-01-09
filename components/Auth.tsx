
import React, { useState } from 'react';
import { UserState, UsersMap } from '../types';
import { INITIAL_STATE } from '../constants';

interface AuthProps {
  onLogin: (user: UserState) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedUsers = localStorage.getItem('coinwise_users');
    const users: UsersMap = savedUsers ? JSON.parse(savedUsers) : {};

    if (isLogin) {
      const user = users[accountId];
      if (user && user.password === password) {
        onLogin(user);
      } else {
        setError('Invalid account ID or password.');
      }
    } else {
      if (!accountId || !password || !name) {
        setError('Please fill in all fields.');
        return;
      }
      if (users[accountId]) {
        setError('Account ID already exists.');
        return;
      }

      const newUser: UserState = {
        ...INITIAL_STATE,
        name,
        accountId,
        password,
      };

      users[accountId] = newUser;
      localStorage.setItem('coinwise_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-slate-950 text-3xl mx-auto mb-4 shadow-xl shadow-emerald-500/20">CW</div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">CoinWise AI</h1>
          <p className="text-slate-400">Master Digital Assets. Risk-Free.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex bg-slate-800/50 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="Alex Thompson"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Account ID</label>
              <input 
                type="text" 
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                placeholder="CW-USER-123"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-medium text-center">{error}</p>}

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              {isLogin ? 'Enter Dashboard' : 'Create My Account'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Protected by CoinWise Security Protocols
        </p>
      </div>
    </div>
  );
};

export default Auth;
