# Install dependencies for both client and server

Write-Host "Installing dependencies for ChatFlow..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again." -ForegroundColor Red
    exit 1
}

# Check npm version
$npmVersion = (npm -v)
Write-Host "Using npm version: $npmVersion"

# Function to install dependencies in a directory
function Install-Dependencies($directory) {
    if (Test-Path $directory) {
        Write-Host "`nInstalling dependencies in $directory..." -ForegroundColor Cyan
        Set-Location -Path $directory
        
        # Remove node_modules if it exists to ensure a clean install
        if (Test-Path "node_modules") {
            Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
            Remove-Item -Recurse -Force node_modules
        }
        
        # Remove package-lock.json if it exists
        if (Test-Path "package-lock.json") {
            Remove-Item -Force package-lock.json
        }
        
        # Install dependencies
        npm install
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install dependencies in $directory" -ForegroundColor Red
            exit 1
        }
        
        Set-Location -Path $PSScriptRoot
        Write-Host "Successfully installed dependencies in $directory" -ForegroundColor Green
    } else {
        Write-Host "Directory $directory not found. Skipping..." -ForegroundColor Yellow
    }
}

# Install server dependencies
Install-Dependencies -directory "server"

# Install client dependencies
Install-Dependencies -directory "client"

Write-Host "`nAll dependencies installed successfully!" -ForegroundColor Green
Write-Host "You can now start the application using .\start.ps1" -ForegroundColor Cyan
