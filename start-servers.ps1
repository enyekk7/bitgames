# PowerShell script to start both servers
Write-Host "🚀 Starting BitGame Servers..." -ForegroundColor Green

# Start API server in background
Write-Host "📡 Starting API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\api; npm start"

# Wait a bit for API to start
Start-Sleep -Seconds 3

# Start Web server in background  
Write-Host "🌐 Starting Web server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\web; npm run dev"

Write-Host "✅ Servers started!" -ForegroundColor Green
Write-Host "📡 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Web: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🧪 Test: Open test-xp-manual.html in browser" -ForegroundColor Magenta

