# 🚀 Quick XP Test Guide

## **Step 1: Start Servers**

### **Terminal 1 (API Server):**
```powershell
cd C:\Users\Administrator\Documents\bitgame\apps\api
npm start
```

### **Terminal 2 (Web Server):**
```powershell
cd C:\Users\Administrator\Documents\bitgame\apps\web  
npm run dev
```

## **Step 2: Test XP System**

### **Option A: Manual Test**
1. Buka `test-xp-manual.html` di browser
2. Klik "Check Stats" 
3. Klik "Add XP" beberapa kali
4. Lihat XP bertambah

### **Option B: Real Game Test**
1. Buka `http://localhost:5173` di browser
2. Connect wallet
3. Main game (penalty, snake, dll)
4. **PENTING**: Buka console browser (F12) untuk lihat log
5. Cek Profile page untuk XP update

## **Step 3: Debug**

### **Jika XP tidak bertambah:**
1. **Cek Console Browser (F12)** - harus ada log:
   ```
   🎮 PlayPage: Game Over event received!
   📈 Updating XP for player: [address]
   ✅ You gained [X] XP!
   ```

2. **Cek API Server** - buka `http://localhost:3001/health`

3. **Cek Network Tab** - pastikan tidak ada error

### **Jika masih tidak berfungsi:**
1. Restart kedua server
2. Clear browser cache
3. Cek console untuk error messages

## **Expected Results:**
- **Games Played**: Bertambah setiap main
- **Total Score**: Bertambah sesuai skor  
- **XP**: Bertambah minimal 15 XP per game
- **Alert**: Muncul notifikasi XP gained

---

**🎯 Focus: Cek console browser untuk debug!**

