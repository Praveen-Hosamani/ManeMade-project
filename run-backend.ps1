# e:\ManeMade-project\run-backend.ps1
# This script runs the Spring Boot backend using the local Maven installation.

Write-Host "Starting ManeMade Backend..." -ForegroundColor Cyan

# Set local Maven path
$MAVEN_BIN = "e:\ManeMade-project\tools\maven\bin\mvn.cmd"

# Change directory to backend
Set-Location "e:\ManeMade-project\backend"

# Run Spring Boot
& $MAVEN_BIN spring-boot:run

# Go back to root
Set-Location "e:\ManeMade-project"
