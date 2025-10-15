# 🚀 Deploy Bitgame ke Netlify

Panduan lengkap untuk deploy project Bitgame ke Netlify dengan frontend dan API sekaligus.

## 📋 Prerequisites

- GitHub repository dengan project Bitgame
- Akun Netlify (gratis)
- MongoDB Atlas database
- Stacks wallet dengan testnet STX

## 🔧 Step 1: Persiapan Repository

1. **Commit semua perubahan:**
```bash
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

2. **Pastikan file-file berikut ada:**
- `netlify.toml` ✅
- `netlify/functions/api.js` ✅
- `netlify-env-example.txt` ✅

## 🌐 Step 2: Setup Netlify

### A. Buat Site Baru

1. Login ke [netlify.com](https://netlify.com)
2. Klik **"New site from Git"**
3. Pilih **"GitHub"** sebagai provider
4. Pilih repository Bitgame Anda
5. Klik **"Deploy site"**

### B. Konfigurasi Build Settings

Netlify akan otomatis detect konfigurasi dari `netlify.toml`, tapi pastikan:

- **Base directory:** `.` (root)
- **Build command:** `pnpm install && pnpm build:netlify`
- **Publish directory:** `apps/web/dist`

## 🔑 Step 3: Environment Variables

1. Di dashboard Netlify, buka **Site settings**
2. Klik **Environment variables**
3. Tambahkan variables berikut:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bitgame
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here
```

## 📦 Step 4: Deploy Smart Contracts

### Deploy ke Stacks Testnet

```bash
cd apps/contracts

# Install Clarinet (jika belum)
# Windows: winget install clarinet
# macOS: brew install clarinet
# Linux: curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar -xz

# Deploy contracts
clarinet deploy --testnet

# Catat contract addresses yang dihasilkan
```

### Update Environment Variables

Setelah deploy, update environment variables di Netlify dengan contract addresses yang baru.

## 🎮 Step 5: Setup Database

### MongoDB Atlas Setup

1. Buat cluster di [MongoDB Atlas](https://cloud.mongodb.com)
2. Buat database user
3. Whitelist IP address (atau 0.0.0.0/0 untuk testing)
4. Dapatkan connection string
5. Update `MONGODB_URI` di Netlify

### Seed Database

```bash
# Lokal untuk testing
pnpm seed

# Atau jalankan di production setelah deploy
```

## 🚀 Step 6: Deploy

1. **Manual Deploy:**
   - Push ke GitHub, Netlify akan auto-deploy
   - Atau klik **"Deploy site"** di dashboard

2. **Monitor Deployment:**
   - Lihat logs di **Deploys** tab
   - Pastikan build berhasil

## ✅ Step 7: Testing

### Test Frontend
- Buka URL Netlify yang diberikan
- Pastikan website load dengan benar
- Test game loading

### Test API
- Test endpoint: `https://your-site.netlify.app/api/games`
- Pastikan response JSON valid

### Test Wallet Connection
- Connect wallet ke testnet
- Pastikan transaksi berjalan

## 🔧 Troubleshooting

### Build Errors

**Error: pnpm not found**
```bash
# Pastikan NODE_VERSION = "18" di netlify.toml
# Netlify akan install pnpm otomatis
```

**Error: Build timeout**
```bash
# Optimize build dengan mengurangi dependencies
# Atau upgrade ke Netlify Pro untuk build time lebih lama
```

### API Errors

**Error: MongoDB connection failed**
- Check MongoDB URI format
- Verify IP whitelist
- Check database user permissions

**Error: Stacks API timeout**
- Verify STACKS_API_URL
- Check network connectivity
- Update to latest Stacks API version

### Function Errors

**Error: Function not found**
- Check `netlify/functions/api.js` exists
- Verify `netlify.toml` configuration
- Check function logs di Netlify dashboard

## 📊 Monitoring

### Netlify Analytics
- Lihat traffic di **Analytics** tab
- Monitor function invocations
- Check error rates

### MongoDB Monitoring
- Monitor connections di MongoDB Atlas
- Check query performance
- Set up alerts

### Stacks Monitoring
- Track transactions di [Stacks Explorer](https://explorer.stacks.co)
- Monitor contract interactions
- Check wallet balances

## 🔄 Updates & Maintenance

### Deploy Updates
```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Netlify auto-deploys
```

### Database Updates
```bash
# Run migrations
pnpm seed

# Update environment variables if needed
```

### Contract Updates
```bash
cd apps/contracts
clarinet deploy --testnet

# Update contract addresses in Netlify env vars
```

## 💰 Pricing

### Netlify Free Tier
- 100GB bandwidth/month
- 300 build minutes/month
- 100GB storage
- 1 concurrent build

### Upgrade Options
- **Pro ($19/month):** Unlimited bandwidth, priority support
- **Business ($99/month):** Team management, advanced features
- **Enterprise:** Custom pricing

## 🎯 Next Steps

1. **Custom Domain:** Setup custom domain di Netlify
2. **SSL Certificate:** Otomatis included
3. **CDN:** Global CDN included
4. **Monitoring:** Setup alerts dan monitoring
5. **Backup:** Setup database backup strategy

## 📞 Support

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Stacks Docs:** [docs.stacks.co](https://docs.stacks.co)
- **MongoDB Docs:** [docs.mongodb.com](https://docs.mongodb.com)

---

**Happy Deploying! 🎉**
