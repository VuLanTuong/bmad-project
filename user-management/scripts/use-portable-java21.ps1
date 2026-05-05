$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$portableJdk = Join-Path $projectRoot ".tools\jdk21\jdk-21.0.11+10"
$javaExe = Join-Path $portableJdk "bin\java.exe"

if (-not (Test-Path $javaExe)) {
  throw "Portable JDK 21 not found at: $portableJdk"
}

$env:JAVA_HOME = $portableJdk
$env:Path = "$($env:JAVA_HOME)\bin;$($env:Path)"

Write-Host "JAVA_HOME set to $env:JAVA_HOME"
& java -version
