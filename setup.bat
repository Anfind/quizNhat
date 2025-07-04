@echo off
echo ================================
echo Quiz Nhat - Setup Script
echo ================================
echo.

echo [1/4] Installing dependencies...
call npm install
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo [2/4] Setting up database...
echo Please make sure MySQL is running and execute these commands:
echo.
echo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS quiz_nhat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo mysql -u root -p quiz_nhat_db ^< database/init.sql
echo mysql -u root -p quiz_nhat_db ^< database/sample_data.sql
echo.
pause

echo.
echo [3/4] Update .env file if needed...
echo Please check backend/.env file and update database credentials if needed.
echo.
pause

echo.
echo [4/4] Starting the application...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
call npm run dev
