$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$portableJdk = Join-Path $projectRoot ".tools\jdk21\jdk-21.0.11+10"

if (-not (Test-Path (Join-Path $portableJdk "bin\java.exe"))) {
  throw "Portable JDK 21 not found at: $portableJdk"
}

$env:JAVA_HOME = $portableJdk
$env:Path = "$($env:JAVA_HOME)\bin;$($env:Path)"

Write-Host "Using JAVA_HOME=$env:JAVA_HOME"
& ".\mvnw.cmd" spring-boot:run
