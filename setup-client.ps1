# Setup script for the client application
Write-Host "Setting up the ChatFlow client..." -ForegroundColor Green

# Navigate to client directory
Set-Location -Path "$PSScriptRoot\client"

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again." -ForegroundColor Red
    exit 1
}

# Check npm version
$npmVersion = (npm -v)
Write-Host "Using npm version: $npmVersion"

# Install dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Cyan
npm install

# Check if installation was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host "`nClient setup completed successfully!" -ForegroundColor Green
Write-Host "To start the development server, run: npm run dev" -ForegroundColor Cyan
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Cyan
