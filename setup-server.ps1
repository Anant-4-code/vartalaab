# Setup script for the server application
Write-Host "Setting up the ChatFlow server..." -ForegroundColor Green

# Navigate to server directory
Set-Location -Path "$PSScriptRoot\server"

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again." -ForegroundColor Red
    exit 1
}

# Check npm version
$npmVersion = (npm -v)
Write-Host "Using npm version: $npmVersion"

# Install dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
npm install

# Check if installation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    @"
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "Please update the .env file with your Gemini API key." -ForegroundColor Yellow
}

Write-Host "`nServer setup completed successfully!" -ForegroundColor Green
Write-Host "To start the server, run: npm run dev" -ForegroundColor Cyan
Write-Host "The server will be available at http://localhost:3001" -ForegroundColor Cyan
