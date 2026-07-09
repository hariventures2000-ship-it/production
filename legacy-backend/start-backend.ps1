$services = @(
    "api-gateway",
    "auth-service",
    "user-service",
    "tenant-service",
    "hr-service",
    "employee-service",
    "client-service",
    "analytics-service",
    "notification-service",
    "ai-service"
)

# Ensure logs directory exists
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

Write-Host "Starting Mervi Backend Services (limited to 128MB heap)..." -ForegroundColor Cyan

$processes = @()
foreach ($service in $services) {
    Write-Host "Launching $service..." -ForegroundColor Green
    $jarPath = "$service/target/mervi-$service-1.0.0-SNAPSHOT.jar"
    if (Test-Path $jarPath) {
        $absoluteJar = (Resolve-Path $jarPath).Path
        $logDir = (Resolve-Path "logs").Path
        $outFile = Join-Path $logDir "$service.log"
        $errFile = Join-Path $logDir "$service-err.log"
        # Start the java process in the background and pass process back
        $p = Start-Process java -ArgumentList "-Xmx128m", "-jar", "`"$absoluteJar`"" -RedirectStandardOutput $outFile -RedirectStandardError $errFile -NoNewWindow -PassThru
        $processes += $p
    } else {
        Write-Warning "Could not find jar for $service at $jarPath"
    }
}

Write-Host "All backend services launched. Monitoring processes. Kill task to stop." -ForegroundColor Cyan

try {
    while ($true) {
        Start-Sleep 2
    }
} finally {
    Write-Host "Stopping all backend processes..." -ForegroundColor Yellow
    foreach ($p in $processes) {
        if ($p -and -not $p.HasExited) {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
