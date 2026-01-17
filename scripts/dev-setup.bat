@echo off
REM VitalOps Development Setup Script for Windows
REM This script automates the setup process for development

echo ========================================
echo VitalOps Development Setup
echo ========================================
echo.

REM Check Node.js
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js installed

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)
echo [OK] npm installed
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
echo.

REM Setup backend
echo Setting up backend...
cd apps\backend-api

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo [WARNING] Please edit apps\backend-api\.env with your database credentials
    echo Press any key after you've configured the .env file...
    pause >nul
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npm run prisma:generate

REM Run migrations
echo Running database migrations...
call npm run prisma:migrate

REM Seed database
echo Seeding database...
call npm run prisma:seed

cd ..\..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend:    npm run backend
echo 2. Start admin web:  npm run admin
echo 3. Start mobile app: npm run mobile
echo.
echo Default credentials:
echo    Admin:      admin@vitalops.com / admin123
echo    Manager:    manager@vitalops.com / manager123
echo    Technician: tech@vitalops.com / tech123
echo.
echo URLs:
echo    Backend API: http://localhost:5000
echo    Admin Web:   http://localhost:3000
echo    Health:      http://localhost:5000/health
echo.
echo Happy coding!
echo.
pause



