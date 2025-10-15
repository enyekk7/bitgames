# Sistem XP BitGame - Dokumentasi (Updated)

## 🎯 **Fitur Utama**

### **1. XP Stabil & Tidak Bisa Berkurang**
- ✅ XP hanya bisa bertambah, tidak pernah berkurang
- ✅ Data tersimpan permanen di database MongoDB
- ✅ Backup otomatis ke localStorage
- ✅ Sistem fallback jika API tidak tersedia

### **2. Perhitungan XP (Fokus pada Frekuensi Bermain)**
- **Base XP**: 15 XP untuk setiap game yang dimainkan (terlepas dari skor!)
- **Consistency Bonus**: 
  - 10+ games: +5 XP
  - 25+ games: +10 XP total
  - 50+ games: +20 XP total
  - 100+ games: +35 XP total
- **Score Bonus**: Maksimal 10 XP dari skor (tidak terlalu besar)
- **Game Multipliers** (dikurangi karena fokus pada partisipasi):
  - Penalty: 1.1x (Sports games)
  - Snake: 1.0x (Standard)
  - Tic Tac Toe: 1.05x (Strategy)
  - Math Quiz: 1.15x (Educational)
  - Bitcoin Quiz: 1.2x (Educational)

### **3. Level System**
- **Level 1**: 0-999 XP
- **Level 2**: 1000-1999 XP
- **Level 3**: 2000-2999 XP
- Dan seterusnya...

### **5. Streak System (Sistem Konsistensi)**
- **Current Streak**: Hari berturut-turut bermain
- **Longest Streak**: Streak terpanjang yang pernah dicapai
- **Streak Calculation**: 
  - Main hari ini = streak tetap
  - Main kemarin = streak +1
  - Tidak main kemarin = streak reset ke 1
- **Streak Bonus**: Semakin konsisten main, semakin banyak XP

### **4. Achievements (Fokus pada Frekuensi Bermain)**
- **Frequent Player Achievements**:
  - 🎮 First Game (1 game)
  - 🔥 Regular Player (5 games)
  - ⭐ Active Gamer (10 games)
  - 🏆 Dedicated Player (25 games)
  - 🎯 Frequent Player (50 games)
  - 🏅 Veteran Player (100 games)
  - 👑 Game Master (200 games)

- **Streak Achievements**:
  - 🔥 3-Day Streak
  - ⭐ Weekly Streak (7 days)
  - 🏆 2-Week Streak (14 days)
  - 👑 Monthly Streak (30 days)
  - 📅 Consistent Player (7+ longest streak)
  - 🎯 Streak Master (30+ longest streak)

- **Level Achievements** (tetap ada tapi tidak terlalu fokus):
  - 🌟 Rising Star (Level 3)
  - 💫 Level Master (Level 5)
  - ⭐ High Level Player (Level 10)

## 🏗️ **Arsitektur Sistem**

### **Database (MongoDB)**
```typescript
interface IUserXP {
  playerAddress: string;
  totalXP: number;        // XP total (hanya bertambah)
  level: number;          // Level saat ini
  totalGamesPlayed: number;
  totalScore: number;
  achievements: string[];
  currentStreak: number;   // Streak hari berturut-turut
  longestStreak: number;  // Streak terpanjang
  lastPlayedDate: string; // Tanggal terakhir main (YYYY-MM-DD)
  lastUpdated: Date;
}
```

### **API Endpoints**
- `GET /api/xp/:playerAddress` - Ambil data XP user
- `POST /api/xp/:playerAddress/add` - Tambah XP
- `GET /api/xp/leaderboard/top` - Leaderboard XP
- `GET /api/xp/:playerAddress/progress` - Progress level

### **Frontend Integration**
- **BitgameBridge**: Menghitung dan mengupdate XP
- **PlayPage**: Menangani XP update saat game selesai
- **ProfilePage**: Menampilkan statistik XP user
- **localStorage**: Backup data XP

## 🔒 **Keamanan & Stabilitas**

### **1. XP Protection**
- XP tidak bisa berkurang (min: 0)
- Level tidak bisa turun (min: 1)
- Validasi input di API
- Error handling yang robust

### **2. Data Persistence**
- Primary: MongoDB database
- Backup: localStorage
- Fallback: Default values jika semua gagal

### **3. Error Handling**
- API error → localStorage fallback
- localStorage error → Default values
- Network error → Retry mechanism

## 🚀 **Cara Penggunaan**

### **Untuk Developer**
```typescript
// Di game component
const bridge = useGameBridge();

// Saat game selesai
bridge.gameOver(score, metadata);

// XP akan otomatis diupdate
```

### **Untuk User**
1. Main game → Dapat XP otomatis
2. Level up → Notifikasi achievement
3. Lihat progress di Profile page
4. Data tersimpan permanen

## 📊 **Monitoring**

### **XP Leaderboard**
- Top players berdasarkan total XP
- Real-time updates
- Cached untuk performa

### **User Progress**
- Current level
- XP to next level
- Achievement progress
- Game statistics

## 🔧 **Maintenance**

### **Database Indexes**
- `playerAddress` (unique)
- `totalXP` (descending)
- `level` (descending)

### **Performance**
- Cached leaderboard
- Optimized queries
- Background sync

---

**Sistem XP BitGame telah siap dan stabil! 🎉**
