import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC99-9BwaZ9aPJgFiLeeD3UU8XEoFMGodA",
    authDomain: "gen-lang-client-0742583847.firebaseapp.com",
    projectId: "gen-lang-client-0742583847",
    storageBucket: "gen-lang-client-0742583847.firebasestorage.app",
    messagingSenderId: "301938695654",
    appId: "1:301938695654:web:dea9534c8338e87729ca27",
    databaseURL: "https://gen-lang-client-0742583847-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// 1. Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// 2. Xuất công cụ xác thực (Đăng nhập/Đăng ký)
export const auth = getAuth(app);

// 3. Xuất công cụ cơ sở dữ liệu (Lưu game/Phòng chơi)
export const db = getDatabase(app);