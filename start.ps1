# Start both the client and server in development mode

# Function to check if a process is running
function Test-ProcessRunning($processName) {
    return Get-Process -Name $processName -ErrorAction SilentlyContinue
}

# Start the server
Write-Host "Starting the server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev" -WindowStyle Normal

# Wait a bit for the server to start
Start-Sleep -Seconds 5

# Start the client
Write-Host "Starting the client..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal

# Open the browser to the client
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host "`nBoth client and server are starting..." -ForegroundColor Green
Write-Host "- Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "`nPress any key to stop both servers..." -ForegroundColor Yellow

# Wait for user input to stop
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop any running Node.js processes
Write-Host "`nStopping servers..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "node" -or $_.ProcessName -eq "npm" } | Stop-Process -Force

Write-Host "Servers stopped." -ForegroundColor Green
