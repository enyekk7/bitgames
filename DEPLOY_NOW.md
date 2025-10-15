# 🚀 Deploy Bitgame ke Netlify - Langkah Cepat

Project Bitgame sudah siap untuk deploy! Ikuti langkah-langkah berikut:

## ✅ Yang Sudah Siap

- ✅ Konfigurasi Netlify (`netlify.toml`)
- ✅ Netlify Functions untuk API
- ✅ Build scripts yang berfungsi
- ✅ Environment variables template
- ✅ Dokumentasi lengkap

## 🎯 Langkah Deploy (5 Menit)

### 1. Upload ke GitHub (2 menit)

**Option A: Manual Upload**
1. Buat repository baru di [github.com](https://github.com)
2. Upload semua file project (drag & drop)
3. Commit dengan message: "Initial commit"

**Option B: Git Command (jika sudah ada GitHub CLI)**
```bash
gh repo create bitgame --public
git remote add origin https://github.com/YOUR_USERNAME/bitgame.git
git push -u origin main
```

### 2. Deploy ke Netlify (2 menit)

1. **Login ke Netlify:** [netlify.com](https://netlify.com)
2. **New site from Git:** Klik tombol "New site from Git"
3. **Connect GitHub:** Pilih GitHub sebagai provider
4. **Select Repository:** Pilih repository `bitgame` Anda
5. **Deploy:** Klik "Deploy site"

Netlify akan otomatis:
- Detect konfigurasi dari `netlify.toml`
- Build project dengan command yang sudah disiapkan
- Deploy frontend dan API functions

### 3. Set Environment Variables (1 menit)

1. **Site Settings:** Di dashboard Netlify, klik "Site settings"
2. **Environment Variables:** Klik "Environment variables"
3. **Add Variables:** Tambahkan variables berikut:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bitgame
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so
NODE_ENV=production
```

4. **Redeploy:** Klik "Trigger deploy" untuk apply variables

## 🌐 Hasil Deployment

Setelah deploy selesai, Anda akan mendapatkan:

- **Frontend URL:** `https://your-site-name.netlify.app`
- **API Endpoints:** `https://your-site-name.netlify.app/api/*`
- **Global CDN:** Website akan cepat di seluruh dunia
- **Auto-deploy:** Setiap push ke GitHub akan auto-deploy

## 🎮 Test Deployment

### Test Frontend
- Buka URL Netlify Anda
- Pastikan website load dengan benar
- Test navigation dan games

### Test API
- Test: `https://your-site.netlify.app/api/games`
- Harus return JSON dengan daftar games

### Test Functions
- Test: `https://your-site.netlify.app/api/health`
- Harus return: `{"status":"ok","timestamp":"..."}`

## 🔧 Troubleshooting

### Build Failed?
- Check logs di Netlify dashboard
- Pastikan `netlify.toml` ada di root
- Pastikan `pnpm` bisa diakses

### API Not Working?
- Check environment variables
- Verify MongoDB connection string
- Check function logs

### Frontend Not Loading?
- Check build logs
- Verify `publish` directory = `apps/web/dist`
- Check for JavaScript errors

## 📊 Monitoring

### Netlify Dashboard
- **Deploys:** Lihat deployment status
- **Functions:** Monitor API calls
- **Analytics:** Website traffic

### Logs
- **Build logs:** Lihat proses build
- **Function logs:** Debug API issues
- **Error tracking:** Monitor errors

## 🎉 Congratulations!

Project Bitgame Anda sekarang live di internet!

### Next Steps:
1. **Custom Domain:** Setup custom domain di Netlify
2. **Smart Contracts:** Deploy ke Stacks testnet
3. **Database:** Setup MongoDB Atlas
4. **Monitoring:** Setup alerts dan monitoring

---

**Your Bitgame is now live! 🚀🎮**
