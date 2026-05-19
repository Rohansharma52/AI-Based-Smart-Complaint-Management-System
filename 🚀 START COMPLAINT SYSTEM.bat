@echo off
title SmartComplaint AI - Starting...
color 0B
echo.
echo  ============================================================
echo    SmartComplaint AI - Complaint Management System
echo    B.Tech 4th Sem ESE Project
echo  ============================================================
echo.
echo  [1/3] Starting Backend (Port 5001)...
start "SmartComplaint - Backend" cmd /k "cd /d "%~dp0server" && color 0A && echo Backend Starting... && node server.js"
echo.
echo  [2/3] Waiting 8 seconds for backend...
timeout /t 8 /nobreak > nul
echo.
echo  [3/3] Starting Frontend (Port 5173)...
start "SmartComplaint - Frontend" cmd /k "cd /d "%~dp0client" && color 0D && echo Frontend Starting... && npm run dev"
echo.
echo  ============================================================
echo   Backend API : http://localhost:5001/api
echo   Frontend    : http://localhost:5173
echo  ============================================================
echo.
timeout /t 15 /nobreak > nul
start http://localhost:5173
echo.
echo  Website opened! Keep both windows running.
pause
