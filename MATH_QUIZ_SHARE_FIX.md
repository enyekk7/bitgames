# Math Quiz Share Feed Fix

## 🐛 **Masalah:**
Math Quiz tidak muncul share feed seperti game lainnya.

## 🔍 **Debug yang Ditambahkan:**

### **1. PlayPage.tsx**
- ✅ **Enhanced logging** untuk share modal
- ✅ **Debug info** untuk game slug dan score
- ✅ **Console logs** untuk troubleshooting

### **2. Math Quiz Game**
- ✅ **Sudah memanggil** `bridge.gameOver()` dengan benar
- ✅ **Sudah terdaftar** di PlayPage
- ✅ **Sudah ada** di fallback games

## 🧪 **Testing Steps:**

### **1. Test Manual:**
1. Buka `test-math-quiz-share.html` di browser
2. Ikuti instruksi testing
3. Cek console logs yang diharapkan

### **2. Test Real Game:**
1. Buka `http://localhost:5173`
2. **Connect wallet dulu!**
3. Main Math Quiz sampai selesai
4. **Buka console browser (F12)**
5. Cek log yang muncul

## 📊 **Expected Console Logs:**

### **Jika Share Modal Muncul:**
```
🎮 PlayPage: Game Over event received!
📈 Updating XP for player: [wallet-address]
✅ Wallet connected, showing share modal
✅ Game slug: math-quiz
✅ Final score: [score]
🎯 ShareModal rendering: { gameOver: true, showShareModal: true, slug: "math-quiz", gameName: "Math Quiz", finalScore: [score] }
```

### **Jika Share Modal Tidak Muncul:**
```
⚠️ Wallet not connected, cannot share score
⚠️ Wallet address: null
```

## 🛠️ **Troubleshooting:**

### **Problem 1: Share Modal Tidak Muncul**
**Causes:**
- Wallet tidak terhubung
- Game tidak memanggil `bridge.gameOver()`
- State `gameOver` atau `showShareModal` false

**Solutions:**
1. **Pastikan wallet terhubung** - cek console untuk log wallet
2. **Cek console logs** - harus ada "Game Over event received!"
3. **Cek state** - `gameOver` dan `showShareModal` harus true

### **Problem 2: Game Over Event Tidak Terpicu**
**Causes:**
- Math quiz tidak memanggil `bridge.gameOver()`
- Event listener tidak terpasang

**Solutions:**
1. **Cek console** - harus ada log "Math Quiz: Game Over!"
2. **Cek bridge.gameOver()** - harus dipanggil dengan score
3. **Cek event listener** - harus ada di PlayPage

### **Problem 3: State Tidak Update**
**Causes:**
- `setGameOver(true)` tidak dipanggil
- `setShowShareModal(true)` tidak dipanggil

**Solutions:**
1. **Cek console** - harus ada log "Game Over event received!"
2. **Cek state update** - `gameOver` dan `showShareModal` harus true
3. **Cek ShareModal render** - harus ada log "ShareModal rendering"

## 🎯 **Quick Fix Commands:**

### **Check API:**
```bash
curl http://localhost:3001/health
```

### **Check Web:**
```bash
curl http://localhost:5173
```

### **Debug Console:**
1. Buka browser dev tools (F12)
2. Cek console tab
3. Main math quiz
4. Lihat logs yang muncul

## 📋 **Checklist:**

- [ ] Wallet terhubung
- [ ] API server berjalan (port 3001)
- [ ] Web server berjalan (port 5173)
- [ ] Console log "Game Over event received!"
- [ ] Console log "Wallet connected, showing share modal"
- [ ] Console log "ShareModal rendering"
- [ ] Share modal muncul di layar

---

**🔧 Debug info sudah ditambahkan! Cek console browser untuk troubleshooting! 🎮✨**

