# XP System Testing Instructions

## 🚀 **Quick Start**

### **1. Start Servers (PowerShell)**
```powershell
# Terminal 1 - API Server
cd apps\api
npm start

# Terminal 2 - Web Server  
cd apps\web
npm run dev
```

### **2. Test XP System**
1. Buka `test-xp-manual.html` di browser
2. Klik "Check Stats" untuk melihat data user
3. Klik "Add XP" untuk menambah XP
4. Klik "Check Stats" lagi untuk melihat perubahan

## 🎮 **Test dengan Game Real**

### **Step 1: Buka Aplikasi**
1. Buka browser ke `http://localhost:5173` (atau port yang ditampilkan)
2. Connect wallet (Stacks wallet)

### **Step 2: Main Game**
1. Pilih game (penalty, snake, dll)
2. Main game sampai selesai
3. **PENTING**: Lihat console browser (F12) untuk log XP

### **Step 3: Cek Profile**
1. Buka Profile page
2. Lihat "Games Played" dan "Total Score"
3. Data harus bertambah

## 🔍 **Debug Console Logs**

### **Yang Harus Terlihat di Console:**
```
🎮 PlayPage: Game Over event received!
📈 Updating XP for player: [wallet-address]
🔧 BitgameBridge: Starting XP update for: [playerAddress, score, gameSlug]
🔧 BitgameBridge: XP update result: [result]
✅ You gained [X] XP!
```

### **Jika Tidak Ada Log:**
1. Pastikan wallet terhubung
2. Pastikan API server berjalan di port 3001
3. Cek network tab di browser dev tools

## 🛠️ **Troubleshooting**

### **Problem: XP tidak bertambah**
**Solution:**
1. Cek console browser untuk error
2. Pastikan API server berjalan: `http://localhost:3001/health`
3. Test manual dengan `test-xp-manual.html`

### **Problem: Games Played tetap 0**
**Solution:**
1. Pastikan game memanggil `bridge.gameOver(score)`
2. Cek console untuk log "Game Over event received"
3. Pastikan wallet terhubung

### **Problem: Profile tidak update**
**Solution:**
1. Refresh halaman profile
2. Cek auto-refresh (setiap 5 detik)
3. Cek console untuk log "Auto-refreshing user stats"

## 📊 **Expected Results**

### **Setelah Main Game:**
- **Games Played**: +1
- **Total Score**: +skor game
- **XP**: +15 XP (minimal)
- **Alert**: "You gained X XP!"

### **XP Calculation:**
- **Base XP**: 15 XP per game
- **Consistency Bonus**: +5 XP (10+ games), +10 XP (25+ games)
- **Score Bonus**: Max 10 XP dari skor
- **Total**: 15-60 XP per game

## 🎯 **Quick Test Commands**

### **Test API:**
```bash
# Test health
curl http://localhost:3001/health

# Test XP
curl http://localhost:3001/api/xp/test-user
```

### **Test Frontend:**
1. Buka `test-xp-manual.html`
2. Klik "Add XP" beberapa kali
3. Lihat XP bertambah

---

**Jika masih tidak berfungsi, cek console browser untuk error messages! 🔧**

