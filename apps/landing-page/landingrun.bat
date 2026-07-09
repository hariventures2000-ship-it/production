@echo off
title Mervi Platform - Landing Page Dev Env
echo ==========================================================
echo Starting Mervi Landing Page Dev Environment...
echo ==========================================================

:: Ensure we are running from the script's directory
cd /d "%~dp0"

:: Step 1: Ensure Docker containers are running (MongoDB, Redis, Kafka, Zookeeper)
echo Checking Docker dependencies...
pushd ..\..\legacy-backend
docker-compose up -d
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Failed to run docker-compose. Make sure Docker Desktop is running!
)
popd

:: Step 2: Start relatable backend services
echo Checking relatable backend services...

:: Check if jar files exist
set JAR_MISSING=0
if not exist "..\..\legacy-backend\api-gateway\target\mervi-api-gateway-1.0.0-SNAPSHOT.jar" set JAR_MISSING=1
if not exist "..\..\legacy-backend\auth-service\target\mervi-auth-service-1.0.0-SNAPSHOT.jar" set JAR_MISSING=1
if not exist "..\..\legacy-backend\user-service\target\mervi-user-service-1.0.0-SNAPSHOT.jar" set JAR_MISSING=1
if not exist "..\..\legacy-backend\tenant-service\target\mervi-tenant-service-1.0.0-SNAPSHOT.jar" set JAR_MISSING=1

if %JAR_MISSING% equ 1 (
    echo [ERROR] One or more backend JAR files are missing!
    echo Please build the backend first by running:
    echo   cd ..\..\legacy-backend
    echo   mvn clean package -DskipTests
    echo.
    pause
    exit /b 1
)

:: Start services in separate minimized windows
echo Launching API Gateway...
start "Mervi - API Gateway" /min java -Xmx128m -jar "..\..\legacy-backend\api-gateway\target\mervi-api-gateway-1.0.0-SNAPSHOT.jar"

echo Launching Auth Service...
start "Mervi - Auth Service" /min java -Xmx128m -jar "..\..\legacy-backend\auth-service\target\mervi-auth-service-1.0.0-SNAPSHOT.jar"

echo Launching User Service...
start "Mervi - User Service" /min java -Xmx128m -jar "..\..\legacy-backend\user-service\target\mervi-user-service-1.0.0-SNAPSHOT.jar"

echo Launching Tenant Service...
start "Mervi - Tenant Service" /min java -Xmx128m -jar "..\..\legacy-backend\tenant-service\target\mervi-tenant-service-1.0.0-SNAPSHOT.jar"

echo Waiting for backend services to initialize...
ping 127.0.0.1 -n 6 >nul

:: Step 3: Run frontend portal on port 3001
echo Starting Landing Page Frontend on http://localhost:3001...
echo Press Ctrl+C in this window to stop the frontend.
echo.
call npm run dev -- -p 3001
