# Math Quiz Timer Fix - Share Feed Saat Waktu Habis

## 🐛 **Masalah:**
Share modal hanya muncul saat kuis selesai (10 pertanyaan), tapi tidak muncul saat waktu habis.

## ✅ **Fix yang Diterapkan:**

### **Math Quiz Timer useEffect:**
```typescript
// OLD: Hanya set gameOver, tidak memanggil bridge.gameOver
if (prev <= 1) {
  setGameOver(true);
  return 0;
}

// NEW: Set gameOver DAN panggil bridge.gameOver
if (prev <= 1) {
  setGameOver(true);
  // Call bridge.gameOver when time runs out
  console.log('🧮 Math Quiz: Time Up! Calling bridge.gameOver with score:', score);
  bridge.gameOver(score, { 
    questionsAnswered: questionNumber,
    correctAnswers: Math.floor(score / 10),
    timeUp: true
  });
  return 0;
}
```

## 🧪 **Testing:**

### **Test Case 1: Kuis Selesai (10 Pertanyaan)**
1. Main Math Quiz
2. Jawab 10 pertanyaan dengan benar
3. **Expected**: Share modal muncul
4. **Console**: "Math Quiz: Game Over! Calling bridge.gameOver"

### **Test Case 2: Waktu Habis**
1. Main Math Quiz
2. Biarkan waktu habis (5 detik per pertanyaan)
3. **Expected**: Share modal muncul
4. **Console**: "Math Quiz: Time Up! Calling bridge.gameOver"

## 📊 **Expected Console Logs:**

### **Saat Kuis Selesai:**
```
🧮 Math Quiz: Game Over! Calling bridge.gameOver with score: [score]
🎮 PlayPage: Game Over event received!
✅ Wallet connected, showing share modal
🎯 ShareModal rendering: { gameOver: true, showShareModal: true, slug: "math-quiz", gameName: "Math Quiz", finalScore: [score] }
```

### **Saat Waktu Habis:**
```
🧮 Math Quiz: Time Up! Calling bridge.gameOver with score: [score]
🎮 PlayPage: Game Over event received!
✅ Wallet connected, showing share modal
🎯 ShareModal rendering: { gameOver: true, showShareModal: true, slug: "math-quiz", gameName: "Math Quiz", finalScore: [score] }
```

## 🎯 **Perbedaan Metadata:**

### **Kuis Selesai:**
```javascript
{
  questionsAnswered: 10,
  correctAnswers: [score/10],
  timeUp: false
}
```

### **Waktu Habis:**
```javascript
{
  questionsAnswered: [currentQuestion],
  correctAnswers: [score/10],
  timeUp: true
}
```

## 🛠️ **Troubleshooting:**

### **Jika Share Modal Masih Tidak Muncul:**
1. **Cek console** - harus ada log "Time Up! Calling bridge.gameOver"
2. **Cek wallet** - harus terhubung
3. **Cek timer** - biarkan waktu habis (5 detik)
4. **Cek score** - harus ada score yang tersimpan

### **Jika Timer Tidak Bekerja:**
1. **Cek useEffect** - harus ada dependency yang benar
2. **Cek gameStarted** - harus true
3. **Cek gameOver** - harus false saat timer berjalan

## 🎮 **Cara Test:**

### **Test Waktu Habis:**
1. Buka Math Quiz
2. **Jangan jawab pertanyaan** - biarkan waktu habis
3. Tunggu 5 detik
4. Share modal harus muncul
5. Cek console untuk log "Time Up!"

### **Test Kuis Selesai:**
1. Buka Math Quiz
2. Jawab 10 pertanyaan dengan benar
3. Share modal harus muncul
4. Cek console untuk log "Game Over!"

---

**✅ Fix selesai! Share modal sekarang muncul baik saat kuis selesai maupun waktu habis! 🎮✨**

