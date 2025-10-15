# Stacks Quiz Game - Documentation

## ✅ **Game Overview:**

### **Game Details:**
- **Name**: Stacks Quiz
- **Slug**: `stacks-quiz`
- **Category**: Education
- **Type**: React Component
- **Description**: Test your knowledge about Stacks blockchain and Bitcoin Layer 2 technology!

### **Game Features:**
- ✅ **10 Questions** about Stacks blockchain
- ✅ **30 seconds per question** timer
- ✅ **Score based on speed and accuracy**
- ✅ **Educational explanations** for each answer
- ✅ **BitgameBridge integration** for XP and sharing
- ✅ **Responsive design** with Stacks branding

## 🎯 **Game Content:**

### **Questions Cover:**
1. **What is Stacks?** - Bitcoin Layer 2 blockchain
2. **What is sBTC?** - Bitcoin-backed asset on Stacks
3. **Programming Language** - Clarity
4. **Proof of Transfer (PoX)** - Consensus mechanism
5. **Nakamoto Upgrade** - Bitcoin finality
6. **Stacking** - Earning rewards through consensus
7. **BNS (Bitcoin Name Service)** - Naming system
8. **Main Advantage** - Bitcoin security and network effects
9. **Clarity Features** - Security-first programming
10. **Ecosystem Focus** - Activating Bitcoin's latent capital

### **Educational Value:**
- ✅ **Learn about Stacks blockchain**
- ✅ **Understand Bitcoin Layer 2 technology**
- ✅ **Learn about sBTC and Bitcoin integration**
- ✅ **Understand Clarity programming language**
- ✅ **Learn about Proof of Transfer consensus**

## 🎮 **Game Mechanics:**

### **Scoring System:**
- **Base Points**: 10 points per correct answer
- **Speed Bonus**: Additional points based on remaining time
- **Formula**: `Math.max(10, 30 - timeLeft)`
- **Maximum Score**: 300 points (10 questions × 30 seconds)

### **Timer System:**
- **30 seconds per question**
- **Visual countdown** with color change at 10 seconds
- **Auto-submit** when time runs out
- **Bridge.gameOver()** called on timeout

### **Answer System:**
- **Multiple choice** (4 options per question)
- **Visual feedback** (green for correct, red for wrong)
- **Explanation display** after each answer
- **2-second delay** before next question

## 🔧 **Technical Implementation:**

### **Files Created:**
1. **`apps/web/src/games/stacks-quiz/index.tsx`** - Main game component
2. **`apps/web/src/games/stacks-quiz/manifest.json`** - Game metadata
3. **`apps/web/public/games/stacks-quiz-thumb.svg`** - Game thumbnail

### **Integration:**
- ✅ **Added to GamesPage.tsx** - Game list
- ✅ **Added to PlayPage.tsx** - Game routing
- ✅ **BitgameBridge integration** - XP and sharing
- ✅ **ShareModal support** - Score sharing

### **Dependencies:**
- **BitgameBridge** - For game over events and XP
- **React hooks** - useState, useEffect
- **TypeScript** - Type safety

## 🧪 **Testing:**

### **1. Game Start:**
1. Navigate to games page
2. Click "Stacks Quiz"
3. **Expected**: Game intro screen with rules
4. **Expected**: "Start Quiz" button

### **2. Gameplay:**
1. Click "Start Quiz"
2. **Expected**: First question appears
3. **Expected**: 30-second timer starts
4. **Expected**: 4 answer options

### **3. Answering:**
1. Click an answer
2. **Expected**: Visual feedback (green/red)
3. **Expected**: Explanation appears
4. **Expected**: 2-second delay before next question

### **4. Timer:**
1. Let timer run out
2. **Expected**: Auto-submit with current answer
3. **Expected**: Bridge.gameOver() called
4. **Expected**: Share modal appears

### **5. Game End:**
1. Complete all 10 questions
2. **Expected**: Final score display
3. **Expected**: Correct answers count
4. **Expected**: "Play Again" button

## 📊 **Expected Console Logs:**

### **Game Start:**
```
🧠 Stacks Quiz: Game started
```

### **Game Over (Complete):**
```
🧠 Stacks Quiz: Game Over! Calling bridge.gameOver with score: [score]
```

### **Game Over (Timeout):**
```
🧠 Stacks Quiz: Time Up! Calling bridge.gameOver with score: [score]
```

## 🎨 **Visual Design:**

### **Color Scheme:**
- **Primary**: #E67E22 (Orange)
- **Accent**: #F39C12 (Gold)
- **Background**: Black gradient
- **Text**: White/Gray

### **Typography:**
- **Title**: 48px, bold, gradient
- **Questions**: 20px, white
- **Options**: 16px, white
- **Explanations**: 14px, gray

### **Layout:**
- **Centered design** with max-width 800px
- **Card-based** with rounded corners
- **Gradient borders** and shadows
- **Responsive** for mobile and desktop

## 🚀 **Deployment:**

### **Files to Deploy:**
1. **Game component** - `apps/web/src/games/stacks-quiz/`
2. **Thumbnail** - `apps/web/public/games/stacks-quiz-thumb.svg`
3. **Updated routing** - `apps/web/src/routes/PlayPage.tsx`
4. **Updated games list** - `apps/web/src/routes/GamesPage.tsx`

### **No Additional Dependencies:**
- ✅ **Uses existing BitgameBridge**
- ✅ **Uses existing ShareModal**
- ✅ **Uses existing API integration**
- ✅ **Uses existing XP system**

---

**✅ Stacks Quiz game siap untuk dimainkan! Game edukatif tentang Stacks blockchain dengan 10 pertanyaan pilihan ganda! 🎮✨**

