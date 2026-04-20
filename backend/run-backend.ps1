# e:\ManeMade-project\backend\run-backend.ps1
# This script runs the Spring Boot backend using the local Maven installation.

Write-Host "Starting ManeMade Backend..." -ForegroundColor Cyan

# Set local Maven path
$MAVEN_BIN = "$PSScriptRoot\..\tools\maven\bin\mvn.cmd"

# Run Spring Boot from the script's directory
& $MAVEN_BIN spring-boot:run
