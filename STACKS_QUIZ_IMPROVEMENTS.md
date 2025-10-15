# Stacks Quiz Improvements - Random Questions & Share Modal

## ❌ **Masalah yang Ditemukan:**

### **1. Pertanyaan Tidak Acak:**
- **Semua pertanyaan** selalu sama urutannya
- **Tidak ada shuffle** pertanyaan
- **User experience** kurang menarik

### **2. Share Modal Tidak Ada:**
- **Game tidak memanggil** bridge.gameOver()
- **Share modal tidak muncul** setelah game selesai
- **Tidak bisa berbagi** skor ke feed

## ✅ **Fix yang Diterapkan:**

### **1. Random Questions System:**

#### **Shuffle Function:**
```typescript
// Function to shuffle questions
const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 10); // Take first 10 questions
};
```

#### **Questions State:**
```typescript
// OLD: Static questions array
const [currentQuestion, setCurrentQuestion] = useState(0);

// NEW: Dynamic questions state
const [questions, setQuestions] = useState<Question[]>([]);
const [currentQuestion, setCurrentQuestion] = useState(0);
```

#### **Start Game Logic:**
```typescript
const startGame = () => {
  const shuffledQuestions = shuffleQuestions(allQuestions);
  setQuestions(shuffledQuestions);
  setGameStarted(true);
  // ... rest of logic
};
```

### **2. Share Modal Integration:**

#### **Game Over Logic:**
```typescript
// OLD: No bridge.gameOver() call
setGameOver(true);

// NEW: Proper bridge.gameOver() call
setGameOver(true);
const finalCorrectAnswers = correctAnswers + (answerIndex === questions[currentQuestion].correct ? 1 : 0);
console.log('🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score:', score);
bridge?.gameOver(score, {
  questionsAnswered: questions.length,
  correctAnswers: finalCorrectAnswers,
  timeUp: false
});
```

#### **Timer Timeout:**
```typescript
// Timer timeout also calls bridge.gameOver()
if (prev <= 1) {
  setGameOver(true);
  console.log('🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score:', score);
  bridge?.gameOver(score, {
    questionsAnswered: currentQuestion + 1,
    correctAnswers: correctAnswers,
    timeUp: true
  });
  return 0;
}
```

## 🎯 **Hasil Akhir:**

### **1. Random Questions:**
- ✅ **Pertanyaan diacak** setiap kali main
- ✅ **10 pertanyaan** dipilih secara random
- ✅ **Urutan berbeda** setiap game
- ✅ **User experience** lebih menarik

### **2. Share Modal:**
- ✅ **Share modal muncul** setelah game selesai
- ✅ **Bridge.gameOver()** dipanggil dengan benar
- ✅ **Metadata lengkap** (questionsAnswered, correctAnswers, timeUp)
- ✅ **Bisa berbagi skor** ke feed

## 🧪 **Testing:**

### **1. Random Questions:**
1. **Start game** beberapa kali
2. **Expected**: Pertanyaan berbeda setiap kali
3. **Expected**: Urutan pertanyaan acak
4. **Expected**: 10 pertanyaan dipilih

### **2. Share Modal:**
1. **Complete game** atau **timeout**
2. **Expected**: Share modal muncul
3. **Expected**: Bisa berbagi skor ke feed
4. **Expected**: Metadata benar (questionsAnswered, correctAnswers)

### **3. Game Over Events:**
1. **Complete all questions**
2. **Expected**: Console log "Game Over! Calling bridge.gameOver"
3. **Expected**: Share modal muncul

4. **Let timer run out**
5. **Expected**: Console log "Time Up! Calling bridge.gameOver"
6. **Expected**: Share modal muncul

## 📊 **Expected Console Logs:**

### **Game Complete:**
```
🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score: [score]
```

### **Time Up:**
```
🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score: [score]
```

## 🎮 **Game Flow:**

### **1. Start Game:**
1. **Click "Start Quiz"**
2. **Questions shuffled** randomly
3. **First question** appears

### **2. Answering:**
1. **Click answer** or **timeout**
2. **Visual feedback** (green/red)
3. **Explanation** appears
4. **Next question** or **game over**

### **3. Game Over:**
1. **Complete** or **timeout**
2. **Bridge.gameOver()** called
3. **Share modal** appears
4. **Can share score** to feed

## 🔧 **Technical Details:**

### **Files Modified:**
1. **`apps/web/src/games/stacks-quiz/index.tsx`** - Added shuffle logic and share modal

### **New Features:**
- ✅ **Random question order** setiap game
- ✅ **Share modal integration** dengan BitgameBridge
- ✅ **Proper game over events** untuk semua skenario
- ✅ **Metadata tracking** untuk analytics

---

**✅ Stacks Quiz sekarang memiliki pertanyaan acak dan share modal! Game lebih menarik dan bisa berbagi skor! 🎮✨**

