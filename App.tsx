import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PortfolioSummary from './components/PortfolioSummary';
import TradingPanel from './components/TradingPanel';
import AIChatBot from './components/AIChatBot';
import Auth from './components/Auth'; // Lưu ý: Bạn cần sửa file Auth để dùng Firebase Login
import CompetitionView from './components/CompetitionView';
import CompetitionPaymentModal from './components/CompetitionPaymentModal';
import TransactionHistory from './components/TransactionHistory';
import { UserState, MarketData, LeaderboardEntry } from './types';
import { fetchMarketPrices } from './services/api';
import { CRYPTO_SYMBOLS, ENTRY_FEE, BASELINE_NET_WORTH } from './constants';

// --- KẾT NỐI FIREBASE ---
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, set, get, onValue, update } from 'firebase/database';

const App: React.FC = () => {
  // 1. Không đọc từ localStorage nữa, khởi tạo là null
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);

  const [marketPrices, setMarketPrices] = useState<MarketData[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'competition'>('dashboard');
  const [isCompPaymentOpen, setIsCompPaymentOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('15m');
  const [showIndicators, setShowIndicators] = useState({ ema: true, rsi: true });

  // Biến lưu danh sách người chơi chung (cho bảng xếp hạng)
  const [competitionPool, setCompetitionPool] = useState<LeaderboardEntry[]>([]);

  // --- 2. LẮNG NGHE ĐĂNG NHẬP (QUAN TRỌNG) ---
  useEffect(() => {
    // Hàm này tự chạy khi F5 hoặc mở tab mới
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Nếu đã đăng nhập, tải dữ liệu từ Database về
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setCurrentUser(snapshot.val());
        } else {
          // Trường hợp user mới tạo bên Auth nhưng chưa có data trong Database
          // (Code này dự phòng, thường xử lý bên file Auth)
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 3. LẮNG NGHE GAME REALTIME (SỬA LỖI KHÔNG CHUNG PHÒNG) ---
  useEffect(() => {
    // Lắng nghe nhánh 'competition/players' trên Firebase
    const poolRef = ref(db, 'competition/players');

    // onValue sẽ chạy mỗi khi CÓ BẤT KỲ AI thay đổi dữ liệu
    const unsubscribe = onValue(poolRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Chuyển object thành array để hiển thị
        const poolArray = Object.values(data) as LeaderboardEntry[];
        // Lọc bỏ AI nếu cần, hoặc để nguyên
        const realPlayers = poolArray.filter(p => !p.name.includes('AlgoTrader'));

        // Lưu vào state cục bộ để truyền xuống CompetitionView
        // (Bạn cần sửa CompetitionView để nhận props này thay vì tự đọc localStorage)
        setCompetitionPool(realPlayers);

        // Cập nhật lại localStorage chỉ để backup (không bắt buộc)
        localStorage.setItem('coinwise_competition_pool', JSON.stringify(realPlayers));
      }
    });

    return () => unsubscribe();
  }, []);

  // --- 4. HÀM LƯU DỮ LIỆU LÊN MÂY ---
  const saveUserToFirebase = (updatedUser: UserState) => {
    if (!auth.currentUser) return;

    // 1. Lưu thông tin cá nhân
    set(ref(db, `users/${auth.currentUser.uid}`), updatedUser);

    // 2. Nếu đang đua top, cập nhật luôn điểm lên bảng xếp hạng chung
    if (updatedUser.competition?.isCompeting) {
      const playerEntry: LeaderboardEntry = {
        rank: 0, // Rank sẽ được tính toán lại ở Client hiển thị
        name: updatedUser.name,
        accountId: updatedUser.accountId,
        pnl: updatedUser.competition.pnlPercent,
        value: updatedUser.balance + (updatedUser.assets.reduce((acc, curr) => acc + curr.amount * 1, 0)), // Tính sơ bộ
        isUser: true
      };
      // Update vào nhánh chung
      update(ref(db, `competition/players/${updatedUser.accountId}`), playerEntry);
    }
  };

  // Cập nhật giá coin (Giữ nguyên)
  useEffect(() => {
    const updatePrices = async () => {
      const data = await fetchMarketPrices(CRYPTO_SYMBOLS);
      if (data.length > 0) {
        setMarketPrices(data);
      }
    };
    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- XỬ LÝ LOGIN / LOGOUT ---
  const handleLogin = (user: UserState) => {
    // Khi Component Auth đăng nhập thành công, nó sẽ set state ở đây
    setCurrentUser(user);
    // Lưu ngay user này lên Firebase để đồng bộ lần đầu
    if (auth.currentUser) {
      set(ref(db, `users/${auth.currentUser.uid}`), user);
    }
  };

  const handleLogout = () => {
    signOut(auth); // Đăng xuất khỏi Firebase
    setCurrentUser(null);
  };

  // --- LOGIC GAME & THANH TOÁN ---
  const handleRegisterClick = () => setIsCompPaymentOpen(true);

  const handleCompleteCompetitionPayment = () => {
    if (!currentUser || !auth.currentUser) return;

    const competitionEndTime = Date.now() + 60000; // Ví dụ 1 phút

    const updatedUser: UserState = {
      ...currentUser,
      balance: BASELINE_NET_WORTH,
      assets: [],
      competition: {
        isCompeting: true,
        entryNetWorth: BASELINE_NET_WORTH,
        entryTime: Date.now(),
        pnlPercent: 0,
        currentRank: 0,
        ...({ endTime: competitionEndTime } as any)
      },
      transactions: [...currentUser.transactions, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'DEPOSIT',
        asset: 'ENTRY-FEE',
        amount: 1,
        price: ENTRY_FEE,
        total: ENTRY_FEE,
        timestamp: Date.now()
      }]
    };

    // Cập nhật state và đẩy lên Firebase
    setCurrentUser(updatedUser);
    saveUserToFirebase(updatedUser);
    setIsCompPaymentOpen(false);
  };

  const handleResetCompetition = () => {
    if (!currentUser || !auth.currentUser) return;

    // Xóa khỏi bảng xếp hạng chung trên Firebase
    set(ref(db, `competition/players/${currentUser.accountId}`), null);

    const updatedUser: UserState = {
      ...currentUser,
      competition: {
        isCompeting: false,
        entryNetWorth: 0,
        entryTime: 0,
        pnlPercent: 0,
        currentRank: 0
      }
    };
    setCurrentUser(updatedUser);
    saveUserToFirebase(updatedUser);
    setActiveTab('dashboard');
  };

  // --- LOGIC TRADE (MUA/BÁN) ---
  const handleTrade = (type: 'BUY' | 'SELL', symbol: string, amount: number, price: number) => {
    if (!currentUser) return;
    const total = amount * price;
    let updatedUser: UserState = { ...currentUser };

    // ... (Giữ nguyên logic tính toán cộng trừ tiền của bạn ở đây) ...
    // Copy đoạn logic if/else BUY/SELL của bạn vào đây, chỉ thay đổi đoạn cuối:

    if (type === 'BUY') {
      if (updatedUser.balance < total) { alert("Thiếu tiền!"); return; }
      // ... Logic update assets ...
      const existingAssetIndex = updatedUser.assets.findIndex(a => a.symbol === symbol);
      const newAssets = [...updatedUser.assets];
      if (existingAssetIndex >= 0) newAssets[existingAssetIndex].amount += amount;
      else newAssets.push({ symbol, amount });

      updatedUser = { ...updatedUser, balance: updatedUser.balance - total, assets: newAssets, /* transaction push... */ };
    } else {
      // ... Logic sell ...
      const existingAssetIndex = updatedUser.assets.findIndex(a => a.symbol === symbol);
      if (existingAssetIndex === -1 || updatedUser.assets[existingAssetIndex].amount < amount) { alert("Không đủ coin!"); return; }
      const newAssets = [...updatedUser.assets];
      newAssets[existingAssetIndex].amount -= amount;
      updatedUser = { ...updatedUser, balance: updatedUser.balance + total, assets: newAssets.filter(a => a.amount > 0), /* transaction push... */ };
    }

    // THAY VÌ syncToUsersStorage, GỌI saveUserToFirebase
    setCurrentUser(updatedUser);
    saveUserToFirebase(updatedUser);
  };

  const handleDeposit = (amount: number) => {
    if (!currentUser) return;
    const updatedUser: UserState = {
      ...currentUser,
      balance: currentUser.balance + amount,
      transactions: [...currentUser.transactions, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'DEPOSIT',
        asset: 'USD',
        amount, price: 1, total: amount, timestamp: Date.now()
      }]
    };
    setCurrentUser(updatedUser);
    saveUserToFirebase(updatedUser);
  };

  const currentPrice = marketPrices.find(m => m.symbol === selectedAsset)?.price || 0;

  // Nếu chưa đăng nhập, hiện form Auth
  // LƯU Ý: Bạn cần chỉnh component Auth để khi login xong thì gọi handleLogin
  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <Layout user={currentUser} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'competition' ? (
        <CompetitionView
          user={currentUser}
          marketPrices={marketPrices}
          onRegister={handleRegisterClick}
          onReset={handleResetCompetition}
        // Truyền danh sách người chơi từ Firebase vào đây nếu Component hỗ trợ
        // poolData={competitionPool} 
        />
      ) : (
        <div className="animate-in fade-in duration-500 space-y-6">
          <PortfolioSummary userState={currentUser} marketPrices={marketPrices} />

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Chart Section (Giữ nguyên UI của bạn) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col min-h-[600px]">
                {/* ... (Code UI Chart giữ nguyên) ... */}
                <div className="text-white">Chart Area (Đã rút gọn để dễ nhìn code logic)</div>
              </div>
            </div>

            {/* Order Panel */}
            <div className="lg:col-span-3">
              <TradingPanel
                marketData={marketPrices}
                userState={currentUser}
                onTrade={handleTrade}
                onDeposit={handleDeposit}
                selectedAsset={selectedAsset}
                onAssetChange={setSelectedAsset}
              />
            </div>
          </div>

          <div className="w-full">
            <TransactionHistory transactions={currentUser.transactions || []} />
          </div>
        </div>
      )}
      <AIChatBot userState={currentUser} marketData={marketPrices} />
      {isCompPaymentOpen && (
        <CompetitionPaymentModal onClose={() => setIsCompPaymentOpen(false)} onSuccess={handleCompleteCompetitionPayment} />
      )}
    </Layout>
  );
};

export default App;