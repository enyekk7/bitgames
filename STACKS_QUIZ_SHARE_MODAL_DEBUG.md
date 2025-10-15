# Stacks Quiz Share Modal Debug

## ❌ **Masalah yang Ditemukan:**

### **Share Modal Tidak Muncul:**
- **Game Stacks Quiz** tidak menampilkan share modal
- **Bridge.gameOver()** dipanggil tapi share modal tidak muncul
- **Perlu debug** untuk melihat apa yang terjadi

## 🔍 **Debug yang Ditambahkan:**

### **1. Enhanced Console Logs:**

#### **Game Complete:**
```typescript
console.log('🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score:', score);
console.log('🧠 Stacks Quiz: Bridge instance:', bridge);
console.log('🧠 Stacks Quiz: Final correct answers:', finalCorrectAnswers);
console.log('🧠 Stacks Quiz: Questions answered:', questions.length);

if (bridge) {
  bridge.gameOver(score, {
    questionsAnswered: questions.length,
    correctAnswers: finalCorrectAnswers,
    timeUp: false
  });
  console.log('🧠 Stacks Quiz: bridge.gameOver() called successfully');
} else {
  console.error('🧠 Stacks Quiz: Bridge is null!');
}
```

#### **Timer Timeout:**
```typescript
console.log('🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score:', score);
console.log('🧠 Stacks Quiz: Bridge instance:', bridge);
console.log('🧠 Stacks Quiz: Current question:', currentQuestion);
console.log('🧠 Stacks Quiz: Correct answers so far:', correctAnswers);

if (bridge) {
  bridge.gameOver(score, {
    questionsAnswered: currentQuestion + 1,
    correctAnswers: correctAnswers,
    timeUp: true
  });
  console.log('🧠 Stacks Quiz: bridge.gameOver() called successfully (timeout)');
} else {
  console.error('🧠 Stacks Quiz: Bridge is null! (timeout)');
}
```

## 🧪 **Testing Steps:**

### **1. Test Game Complete:**
1. **Start Stacks Quiz**
2. **Answer all questions** (or let timer run out)
3. **Check console logs:**
   - `🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score: [score]`
   - `🧠 Stacks Quiz: Bridge instance: [object]`
   - `🧠 Stacks Quiz: bridge.gameOver() called successfully`

### **2. Test Timer Timeout:**
1. **Start Stacks Quiz**
2. **Let timer run out** (10 seconds)
3. **Check console logs:**
   - `🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score: [score]`
   - `🧠 Stacks Quiz: Bridge instance: [object]`
   - `🧠 Stacks Quiz: bridge.gameOver() called successfully (timeout)`

### **3. Check PlayPage Logs:**
1. **Look for PlayPage logs:**
   - `🎮 PlayPage: Game Over event received!`
   - `✅ Wallet connected, showing share modal`
   - `🎯 ShareModal rendering: { gameOver: true, showShareModal: true }`

## 🔍 **Possible Issues:**

### **1. Bridge Instance:**
- **Bridge is null** - tidak ada bridge instance
- **Bridge not initialized** - bridge belum di-setup

### **2. Event Listener:**
- **Event not fired** - bridge.gameOver() tidak memicu event
- **Event listener not set** - PlayPage tidak mendengarkan event

### **3. Wallet Connection:**
- **Wallet not connected** - share modal hanya muncul jika wallet connected
- **Wallet address null** - tidak bisa update XP

## 📊 **Expected Console Flow:**

### **Complete Game:**
```
🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score: [score]
🧠 Stacks Quiz: Bridge instance: [object]
🧠 Stacks Quiz: Final correct answers: [number]
🧠 Stacks Quiz: Questions answered: 10
🧠 Stacks Quiz: bridge.gameOver() called successfully
🎮 PlayPage: Game Over event received!
✅ Wallet connected, showing share modal
🎯 ShareModal rendering: { gameOver: true, showShareModal: true }
```

### **Timer Timeout:**
```
🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score: [score]
🧠 Stacks Quiz: Bridge instance: [object]
🧠 Stacks Quiz: Current question: [number]
🧠 Stacks Quiz: Correct answers so far: [number]
🧠 Stacks Quiz: bridge.gameOver() called successfully (timeout)
🎮 PlayPage: Game Over event received!
✅ Wallet connected, showing share modal
🎯 ShareModal rendering: { gameOver: true, showShareModal: true }
```

## 🎯 **Next Steps:**

### **1. Test dengan Debug Logs:**
1. **Run game** dan lihat console logs
2. **Identify** di mana masalahnya
3. **Fix** berdasarkan error yang ditemukan

### **2. Common Fixes:**
- **Bridge initialization** - pastikan bridge dibuat dengan benar
- **Event listener** - pastikan PlayPage mendengarkan event
- **Wallet connection** - pastikan wallet connected

---

**✅ Debug logs ditambahkan! Sekarang bisa melihat apa yang terjadi dengan share modal di Stacks Quiz! 🎮✨**

