@echo off
setlocal
cd /d "%~dp0"
title Sistema de Gestion Hotelera - Iniciador Universal

echo Iniciando comprobacion de dependencias y arranque...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0launcher.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar el sistema.
    pause
)
