# Simple XP System - 1 Score = 1 XP

## 🎯 **Sistem XP Baru (Sederhana)**

### **Perhitungan XP:**
- **1 Score = 1 XP** (sistem sederhana)
- **Minimum 1 XP** bahkan untuk score 0
- **Tidak ada bonus kompleks** - langsung dari skor

### **Contoh:**
- Score 5 → 5 XP
- Score 10 → 10 XP  
- Score 0 → 1 XP (minimum)
- Score 100 → 100 XP

## 🔧 **Perubahan yang Dibuat:**

### **1. BitgameBridge.ts**
```typescript
// OLD: Complex XP calculation
calculateXP(score, gameSlug, totalGamesPlayed) {
  // Complex calculation with bonuses...
}

// NEW: Simple XP calculation
calculateXP(score, gameSlug, totalGamesPlayed) {
  return Math.max(1, score); // 1 score = 1 XP
}
```

### **2. ProfilePage.tsx**
- **Auto-refresh setiap 2 detik** (real-time updates)
- **Manual refresh button** di Games Played card
- **Real-time data dari database**

### **3. PlayPage.tsx**
- **Alert notification** saat XP bertambah
- **Debug logging** yang lebih detail
- **Error handling** yang lebih baik

## 🧪 **Testing:**

### **1. Test Manual:**
1. Buka `test-simple-xp.html` di browser
2. Klik "Add XP" dengan score berbeda
3. Lihat XP bertambah sesuai skor

### **2. Test Real Game:**
1. Buka aplikasi web
2. Connect wallet
3. Main game (math quiz, penalty, dll)
4. Lihat alert "You gained X XP!"
5. Cek Profile page - data harus update real-time

## 📊 **Expected Results:**

### **Setelah Main Game:**
- **Alert**: "You gained X XP!" (X = skor game)
- **Games Played**: +1
- **Total Score**: +skor game
- **XP**: +skor game (1:1 ratio)
- **Profile**: Update real-time setiap 2 detik

### **Console Logs:**
```
🎮 PlayPage: Game Over event received!
📈 Updating XP for player: [address]
📈 Score: [score]
✅ You gained [score] XP!
```

## 🛠️ **Troubleshooting:**

### **Problem: XP tidak bertambah**
1. Cek console browser untuk log XP
2. Pastikan wallet terhubung
3. Pastikan API server berjalan (port 3001)

### **Problem: Profile tidak update**
1. Klik refresh button manual
2. Cek auto-refresh setiap 2 detik
3. Cek console untuk log "Auto-refreshing user stats"

### **Problem: Math quiz tidak muncul share feed**
1. Pastikan wallet terhubung
2. Cek console untuk log "Wallet connected, showing share modal"
3. Pastikan game memanggil bridge.gameOver()

## 🎯 **Quick Commands:**

### **Start Servers:**
```powershell
# Terminal 1
cd apps\api
npm start

# Terminal 2  
cd apps\web
npm run dev
```

### **Test API:**
```bash
curl http://localhost:3001/health
```

---

**Sistem XP sekarang sederhana: 1 Score = 1 XP! 🎮✨**

