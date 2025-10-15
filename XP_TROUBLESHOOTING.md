# XP System Troubleshooting Guide

## 🔧 **Masalah yang Ditemukan & Solusi**

### **1. API Server Berjalan dengan Baik ✅**
- API server di `http://localhost:3001` berfungsi normal
- Endpoint XP berfungsi dengan baik
- Database MongoDB terhubung

### **2. Masalah yang Mungkin Terjadi**

#### **A. Environment Variables**
- **Masalah**: `REACT_APP_API_URL` tidak ter-set
- **Solusi**: Hardcoded API URL ke `http://localhost:3001`

#### **B. CORS Issues**
- **Masalah**: Frontend tidak bisa akses API
- **Solusi**: API sudah memiliki CORS enabled

#### **C. Wallet Connection**
- **Masalah**: XP tidak ter-update karena wallet tidak terhubung
- **Solusi**: Pastikan wallet terhubung sebelum main game

## 🧪 **Testing Steps**

### **Step 1: Test API Server**
```bash
# Test API health
curl http://localhost:3001/health

# Test XP endpoint
curl http://localhost:3001/api/xp/test-user
```

### **Step 2: Test Frontend**
1. Buka `test-frontend-xp.html` di browser
2. Klik "Test Direct API" - harus berhasil
3. Klik "Simulate Game Over" - harus berhasil
4. Klik "Check User Stats" - harus menampilkan data

### **Step 3: Test Real Game**
1. Buka aplikasi web di browser
2. Connect wallet
3. Main game (penalty, snake, dll)
4. Lihat console browser untuk log XP update
5. Cek Profile page untuk melihat XP

## 🔍 **Debug Console Logs**

### **Yang Harus Terlihat di Console:**
```
🔧 PlayPage: Game Over event received!
🔧 PlayPage: Score: [score]
🔧 BitgameBridge: Starting XP update for: [playerAddress, score, gameSlug]
🔧 BitgameBridge: Using API URL: http://localhost:3001
🔧 BitgameBridge: XP update result: [result]
🔧 ProfilePage: Loading user stats for: [walletAddress]
```

### **Jika Tidak Ada Log:**
1. Pastikan wallet terhubung
2. Pastikan game memanggil `bridge.gameOver()`
3. Pastikan API server berjalan
4. Cek network tab di browser dev tools

## 🚀 **Quick Fix Commands**

### **Start API Server:**
```bash
cd apps/api
npm start
```

### **Start Web Server:**
```bash
cd apps/web
npm run dev
```

### **Test XP System:**
```bash
node debug-xp.js
```

## 📊 **Expected Results**

### **Setelah Main Game:**
- **Games Played**: Bertambah 1
- **Total Score**: Bertambah sesuai skor
- **XP**: Bertambah minimal 15 XP
- **Achievements**: Muncul achievement baru jika memenuhi syarat

### **XP Calculation:**
- **Base XP**: 15 XP per game
- **Consistency Bonus**: +5 XP (10+ games), +10 XP (25+ games), dll
- **Score Bonus**: Max 10 XP dari skor
- **Game Multiplier**: 1.0x - 1.2x tergantung game

## 🎯 **Next Steps**

1. **Test dengan wallet terhubung**
2. **Main game dan lihat console logs**
3. **Cek Profile page untuk XP update**
4. **Jika masih tidak berfungsi, cek network errors**

---

**Sistem XP sudah diperbaiki dan siap untuk testing! 🎉**

