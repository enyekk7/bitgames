# Stacks Quiz Thumbnail Update - Using stacks.jpg

## ✅ **Perubahan yang Dibuat:**

### **1. Thumbnail Baru dengan stacks.jpg:**

#### **Background Image:**
- **Menggunakan** `stacks.jpg` sebagai background
- **SVG format** dengan image reference
- **Overlay gradient** untuk readability
- **Stacks branding** yang konsisten

#### **SVG Thumbnail Features:**
```svg
<!-- Background Image -->
<image href="/games/images/stacks.jpg" x="0" y="0" width="300" height="200" preserveAspectRatio="xMidYMid slice"/>

<!-- Overlay -->
<rect width="300" height="200" fill="url(#overlay)"/>

<!-- Title -->
<text x="150" y="80" text-anchor="middle" fill="url(#text)" font-family="Arial, sans-serif" font-size="28" font-weight="bold">Stacks Quiz</text>

<!-- Subtitle -->
<text x="150" y="110" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="16">Bitcoin Layer 2</text>

<!-- Quiz Icon -->
<text x="150" y="140" text-anchor="middle" fill="#E67E22" font-family="Arial, sans-serif" font-size="20">🧠</text>
```

### **2. Visual Design:**

#### **Background:**
- ✅ **stacks.jpg** sebagai background image
- ✅ **Preserve aspect ratio** dengan slice
- ✅ **300x200** dimensions

#### **Overlay:**
- ✅ **Dark gradient overlay** untuk readability
- ✅ **Semi-transparent** black overlay
- ✅ **Text visibility** ensured

#### **Typography:**
- ✅ **"Stacks Quiz"** - 28px, bold, gradient
- ✅ **"Bitcoin Layer 2"** - 16px, white
- ✅ **🧠 Quiz icon** - 20px, orange

### **3. File Structure:**

#### **Source Image:**
- **Location**: `apps/web/public/games/images/stacks.jpg`
- **Format**: JPG
- **Usage**: Background image in SVG

#### **Generated Thumbnail:**
- **Location**: `apps/web/public/games/stacks-quiz-thumb.svg`
- **Format**: SVG
- **Size**: 300x200px

## 🎯 **Hasil Akhir:**

### **Thumbnail Features:**
- ✅ **stacks.jpg background** - menggunakan gambar yang sudah ada
- ✅ **Professional overlay** - dark gradient untuk readability
- ✅ **Stacks branding** - konsisten dengan tema
- ✅ **Quiz indicator** - 🧠 icon untuk menunjukkan game type
- ✅ **Bitcoin Layer 2** - subtitle yang informatif

### **Visual Consistency:**
- ✅ **Orange gradient** text (E67E22 → F39C12)
- ✅ **White subtitle** untuk kontras
- ✅ **Quiz icon** untuk game type
- ✅ **Professional look** dengan background image

## 🧪 **Testing:**

### **1. Games Page:**
1. **Navigate to `/games`**
2. **Expected**: Stacks Quiz thumbnail tampil dengan stacks.jpg background
3. **Expected**: Text readable dengan overlay
4. **Expected**: Professional appearance

### **2. Game Detail:**
1. **Click Stacks Quiz**
2. **Expected**: Thumbnail consistent di game detail
3. **Expected**: Background image visible
4. **Expected**: Text overlay readable

## 📊 **Before vs After:**

### **Before:**
```
Thumbnail: Simple SVG dengan gradient background
Background: Linear gradient (black → orange)
Text: Basic styling
```

### **After:**
```
Thumbnail: SVG dengan stacks.jpg background
Background: stacks.jpg image dengan overlay
Text: Professional overlay dengan readability
```

## 🔧 **Technical Details:**

### **Files Modified:**
1. **`apps/web/public/games/stacks-quiz-thumb.svg`** - Updated thumbnail
2. **Uses existing**: `apps/web/public/games/images/stacks.jpg`

### **SVG Features:**
- ✅ **Image reference** ke stacks.jpg
- ✅ **Preserve aspect ratio** dengan slice
- ✅ **Gradient overlay** untuk readability
- ✅ **Responsive text** positioning

---

**✅ Stacks Quiz thumbnail sudah diupdate dengan stacks.jpg background! Thumbnail lebih profesional dan menggunakan gambar yang sudah ada! 🎮✨**

