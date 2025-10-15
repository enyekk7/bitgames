# Stacks Quiz Final Fixes - Shuffle Options & Share Modal

## ❌ **Masalah yang Ditemukan:**

### **1. Jawaban Tidak Diacak:**
- **Hanya pertanyaan** yang diacak
- **Pilihan jawaban** tetap sama urutannya
- **Jawaban benar** selalu di posisi yang sama

### **2. Share Modal Tidak Muncul:**
- **Game tidak memanggil** bridge.gameOver() dengan benar
- **Dependency array** di useEffect menyebabkan infinite loop
- **Share modal tidak muncul** setelah game selesai

### **3. Timer Terlalu Lama:**
- **30 detik per pertanyaan** terlalu lama
- **User experience** kurang menantang

## ✅ **Fix yang Diterapkan:**

### **1. Shuffle Options (Jawaban Diacak):**

#### **Enhanced Shuffle Function:**
```typescript
// Function to shuffle questions and options
const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Shuffle options for each question
  return shuffled.slice(0, 10).map(question => {
    const options = [...question.options];
    const correctAnswer = options[question.correct];
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Find new correct index
    const newCorrectIndex = options.findIndex(option => option === correctAnswer);
    
    return {
      ...question,
      options,
      correct: newCorrectIndex
    };
  });
};
```

#### **How It Works:**
1. **Shuffle questions** - urutan pertanyaan acak
2. **Shuffle options** - pilihan jawaban acak
3. **Update correct index** - cari jawaban benar di posisi baru
4. **Return shuffled data** - pertanyaan dan jawaban acak

### **2. Share Modal Fix:**

#### **Fixed useEffect Dependencies:**
```typescript
// OLD: Too many dependencies causing infinite loop
}, [gameStarted, gameOver, timeLeft, score, currentQuestion, correctAnswers, bridge]);

// NEW: Minimal dependencies
}, [gameStarted, gameOver, bridge]);
```

#### **Game Over Logic:**
```typescript
// Complete game
setGameOver(true);
const finalCorrectAnswers = correctAnswers + (answerIndex === questions[currentQuestion].correct ? 1 : 0);
bridge?.gameOver(score, {
  questionsAnswered: questions.length,
  correctAnswers: finalCorrectAnswers,
  timeUp: false
});

// Timeout
setGameOver(true);
bridge?.gameOver(score, {
  questionsAnswered: currentQuestion + 1,
  correctAnswers: correctAnswers,
  timeUp: true
});
```

### **3. Timer Optimization:**

#### **10 Seconds Per Question:**
```typescript
// OLD: 30 seconds
const [timeLeft, setTimeLeft] = useState(30);
setTimeLeft(30);

// NEW: 10 seconds
const [timeLeft, setTimeLeft] = useState(10);
setTimeLeft(10);
```

#### **Updated Scoring:**
```typescript
// OLD: 30 - timeLeft
const points = Math.max(10, 30 - timeLeft);

// NEW: 10 - timeLeft
const points = Math.max(10, 10 - timeLeft);
```

#### **Updated Rules:**
```typescript
// OLD: 30 seconds per question
<li>30 seconds per question</li>

// NEW: 10 seconds per question
<li>10 seconds per question</li>
```

#### **Updated Timer Color:**
```typescript
// OLD: Red at 10 seconds
color: timeLeft <= 10 ? '#ff4444' : '#E67E22'

// NEW: Red at 3 seconds
color: timeLeft <= 3 ? '#ff4444' : '#E67E22'
```

## 🎯 **Hasil Akhir:**

### **1. Shuffled Options:**
- ✅ **Pertanyaan diacak** setiap game
- ✅ **Pilihan jawaban diacak** setiap pertanyaan
- ✅ **Jawaban benar** di posisi berbeda setiap kali
- ✅ **User experience** lebih menantang

### **2. Share Modal:**
- ✅ **Share modal muncul** setelah game selesai
- ✅ **Bridge.gameOver()** dipanggil dengan benar
- ✅ **No infinite loops** di useEffect
- ✅ **Bisa berbagi skor** ke feed

### **3. Optimized Timer:**
- ✅ **10 detik per pertanyaan** - lebih menantang
- ✅ **Scoring system** disesuaikan
- ✅ **Timer color** berubah di 3 detik terakhir
- ✅ **Game rules** diupdate

## 🧪 **Testing:**

### **1. Shuffled Options:**
1. **Start game** beberapa kali
2. **Expected**: Pertanyaan berbeda setiap kali
3. **Expected**: Pilihan jawaban diacak
4. **Expected**: Jawaban benar di posisi berbeda

### **2. Share Modal:**
1. **Complete game** atau **timeout**
2. **Expected**: Share modal muncul
3. **Expected**: Bisa berbagi skor ke feed
4. **Expected**: No infinite loops

### **3. Timer:**
1. **Start game**
2. **Expected**: 10 detik per pertanyaan
3. **Expected**: Timer berubah merah di 3 detik terakhir
4. **Expected**: Auto-submit saat waktu habis

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
2. **Questions & options shuffled** randomly
3. **First question** appears with 10-second timer

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
1. **`apps/web/src/games/stacks-quiz/index.tsx`** - Enhanced shuffle logic and share modal

### **New Features:**
- ✅ **Shuffled options** untuk setiap pertanyaan
- ✅ **10-second timer** per pertanyaan
- ✅ **Share modal integration** yang benar
- ✅ **No infinite loops** di useEffect
- ✅ **Optimized scoring** system

---

**✅ Stacks Quiz sekarang memiliki jawaban acak, share modal, dan timer 10 detik! Game lebih menantang dan bisa berbagi skor! 🎮✨**

