# 🔗 Setup GitHub Repository

Untuk deploy ke Netlify, Anda perlu membuat GitHub repository terlebih dahulu.

## 📋 Langkah-langkah Setup GitHub

### 1. Buat Repository di GitHub

1. Login ke [github.com](https://github.com)
2. Klik **"New repository"** atau **"+"** → **"New repository"**
3. Isi form:
   - **Repository name:** `bitgame` (atau nama yang Anda inginkan)
   - **Description:** `Web3 gaming platform on Stacks blockchain`
   - **Visibility:** Public (untuk Netlify gratis)
   - **Initialize:** ❌ Jangan centang (kita sudah ada kode)
4. Klik **"Create repository"**

### 2. Connect Local Repository ke GitHub

Setelah repository dibuat, GitHub akan memberikan URL. Jalankan perintah berikut:

```bash
# Ganti YOUR_USERNAME dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/bitgame.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

### 3. Verifikasi

Setelah push berhasil, refresh halaman GitHub repository Anda. Anda akan melihat semua file project sudah ada.

## 🚀 Langkah Selanjutnya

Setelah repository GitHub siap, Anda bisa:

1. **Deploy ke Netlify:**
   - Login ke [netlify.com](https://netlify.com)
   - New site from Git → Pilih repository GitHub Anda
   - Netlify akan auto-deploy

2. **Set Environment Variables** di Netlify dashboard

3. **Deploy Smart Contracts** ke Stacks testnet

## 📝 Catatan

- Repository harus **Public** untuk Netlify free tier
- Pastikan semua file sudah di-commit dan di-push
- Netlify akan auto-deploy setiap kali Anda push ke main branch

---

**Ready to deploy! 🎉**
