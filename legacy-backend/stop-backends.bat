@echo off
title Stop Mervi Backends
echo ==========================================================
echo Stopping all running Mervi backend services...
echo ==========================================================

powershell -Command "Get-CimInstance Win32_Process -Filter \"CommandLine like '%%mervi-%%'\" | Foreach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host 'Stopped process' $_.ProcessId -ForegroundColor Yellow }"

echo Done.
ping 127.0.0.1 -n 4 >nul
