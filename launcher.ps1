# =========================================================================
#  SISTEMA DE GESTIÓN HOTELERA - INICIADOR UNIVERSAL WINDOWS
#  Verifica, autodescarga dependencias ausentes y levanta ambos proyectos.
# =========================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Sistema de Gestión Hotelera - Iniciador Universal"

$Root = $PSScriptRoot
$ToolsDir = Join-Path $Root ".tools"
$BackendDir = Join-Path $Root "2026_II_SW_16046_backend"
$FrontendDir = Join-Path $Root "2026_II_SW_16046_frontend"

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "         SISTEMA DE GESTIÓN HOTELERA (UPN 2026-2)                " -ForegroundColor Cyan
Write-Host "              INICIADOR AUTOMÁTICO MULTI-ENTORNO                 " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $ToolsDir)) {
    New-Item -ItemType Directory -Path $ToolsDir -Force | Out-Null
}

# -------------------------------------------------------------------------
# 0. LIBERACIÓN AUTOMÁTICA DE PUERTOS EN CONFLICTO (4200 Y 9494)
# -------------------------------------------------------------------------
Write-Host "[0/5] Verificando y liberando puertos (9494 y 4200)..." -ForegroundColor Yellow
@(9494, 4200) | ForEach-Object {
    $targetPort = $_
    $connections = Get-NetTCPConnection -LocalPort $targetPort -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "  -> Puerto $targetPort ocupado por un proceso previo. Cerrándolo para evitar conflictos..." -ForegroundColor Cyan
        $connections | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
            try {
                Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
                Write-Host "     Proceso (PID $_) terminado." -ForegroundColor Green
            } catch {}
        }
    } else {
        Write-Host "  ✔ Puerto $targetPort libre." -ForegroundColor Green
    }
}

# -------------------------------------------------------------------------
# 0.5 DETECCIÓN INTELIGENTE DE BASE DE DATOS (H2 vs POSTGRESQL)
# -------------------------------------------------------------------------
$UsePostgres = $false
$PgClient = New-Object System.Net.Sockets.TcpClient
$PgRunning = $false
try {
    $asyncResult = $PgClient.BeginConnect("127.0.0.1", 5432, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(800, $false)
    if ($success -and $PgClient.Connected) {
        $PgRunning = $true
        $PgClient.EndConnect($asyncResult)
    }
} catch {}
finally {
    $PgClient.Close()
}

if ($PgRunning) {
    Write-Host ""
    Write-Host "  [BD] ¡Se detectó PostgreSQL activo en localhost:5432!" -ForegroundColor Cyan
    Write-Host "  ¿Deseas conectar a tu PostgreSQL local o usar H2 en memoria?" -ForegroundColor White
    Write-Host "  -> Presiona [P] para PostgreSQL | Presiona [H] o espera 4 seg para H2 (por defecto): " -NoNewline -ForegroundColor Yellow
    
    $timeout = 40
    $chosenKey = $null
    while ($timeout -gt 0) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            $chosenKey = $key.KeyChar.ToString().ToUpper()
            break
        }
        Start-Sleep -Milliseconds 100
        $timeout--
    }
    Write-Host ""
    if ($chosenKey -eq "P") {
        $UsePostgres = $true
        Write-Host "  ✔ Configurado para usar PostgreSQL local (localhost:5432/swapp16046)" -ForegroundColor Green
    } else {
        Write-Host "  ✔ Usando base de datos H2 en memoria (autocontenida y lista)" -ForegroundColor Green
    }
} else {
    Write-Host "  ✔ Usando base de datos H2 en memoria (autocontenida, no requiere PostgreSQL)" -ForegroundColor Green
}
Write-Host ""

# -------------------------------------------------------------------------
# 1. VERIFICACIÓN / DESCARGA AUTOMÁTICA DE JAVA (JDK 21+)
# -------------------------------------------------------------------------
Write-Host "[1/4] Verificando entorno Java (JDK)..." -ForegroundColor Yellow

$JavaCmd = $null
$JavaHome = $null

# Intentar detectar en PATH
try {
    $ver = java -version 2>&1
    if ($LASTEXITCODE -eq 0 -or $ver -match "version") {
        $JavaCmd = (Get-Command java -ErrorAction SilentlyContinue).Source
    }
} catch {}

# Si no está en PATH, buscar en rutas comunes
if (-not $JavaCmd) {
    $Candidates = @(
        "C:\Program Files\Android\Android Studio\jbr",
        "C:\Program Files\Eclipse Adoptium\jdk*",
        "C:\Program Files\Java\jdk*",
        "C:\Program Files\Microsoft\jdk*",
        "C:\Program Files\Amazon Corretto\jdk*",
        "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk*",
        (Join-Path $ToolsDir "jdk")
    )

    foreach ($pattern in $Candidates) {
        $found = Get-ChildItem -Path $pattern -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
        if ($found -and (Test-Path (Join-Path $found.FullName "bin\java.exe"))) {
            $JavaHome = $found.FullName
            $JavaCmd = Join-Path $JavaHome "bin\java.exe"
            break
        }
    }
} else {
    $JavaHome = (Get-Item (Get-Command java).Source).Directory.Parent.FullName
}

# Si no existe en la computadora, descargarlo automáticamente
if (-not $JavaCmd) {
    Write-Host "  -> Java JDK no encontrado en la computadora." -ForegroundColor Yellow
    Write-Host "  -> Descargando OpenJDK portable automáticamente (espera un momento)..." -ForegroundColor Cyan
    
    $JdkZip = Join-Path $ToolsDir "openjdk.zip"
    $JdkExtract = Join-Path $ToolsDir "jdk_temp"
    $JdkUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.6_7.zip"

    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        Invoke-WebRequest -Uri $JdkUrl -OutFile $JdkZip -UseBasicParsing
        Expand-Archive -Path $JdkZip -DestinationPath $JdkExtract -Force
        $inner = Get-ChildItem -Path $JdkExtract -Directory | Select-Object -First 1
        $TargetJdk = Join-Path $ToolsDir "jdk"
        if (Test-Path $TargetJdk) { Remove-Item $TargetJdk -Recurse -Force }
        Move-Item -Path $inner.FullName -Destination $TargetJdk
        Remove-Item $JdkZip, $JdkExtract -Recurse -Force -ErrorAction SilentlyContinue

        $JavaHome = $TargetJdk
        $JavaCmd = Join-Path $JavaHome "bin\java.exe"
        Write-Host "  -> OpenJDK instalado exitosamente en .tools\jdk" -ForegroundColor Green
    } catch {
        Write-Host "  -> Error al descargar OpenJDK automáticamente: $_" -ForegroundColor Red
        Write-Host "  -> Intentando instalar con winget..." -ForegroundColor Yellow
        winget install --id Microsoft.OpenJDK.21 -e --silent --accept-source-agreements --accept-package-agreements
    }
}

if ($JavaHome) {
    $env:JAVA_HOME = $JavaHome
    $env:PATH = (Join-Path $JavaHome "bin") + ";" + $env:PATH
    Write-Host "  ✔ Java listo: $JavaHome" -ForegroundColor Green
} else {
    Write-Host "  ✖ No se pudo inicializar Java JDK." -ForegroundColor Red
    pause
    exit 1
}

# -------------------------------------------------------------------------
# 2. VERIFICACIÓN / DESCARGA AUTOMÁTICA DE NODE.JS Y NPM
# -------------------------------------------------------------------------
Write-Host "[2/4] Verificando entorno Node.js y npm..." -ForegroundColor Yellow

$NodeCmd = $null
$NodeDir = $null

# Intentar detectar en PATH
try {
    $nver = node -v 2>&1
    if ($LASTEXITCODE -eq 0 -or $nver -match "v") {
        $NodeCmd = (Get-Command node -ErrorAction SilentlyContinue).Source
        $NodeDir = (Get-Item $NodeCmd).Directory.FullName
    }
} catch {}

# Si no está en PATH, buscar en rutas comunes
if (-not $NodeCmd) {
    $NodeCandidates = @(
        "C:\Program Files\Microsoft Visual Studio\*\*\MSBuild\Microsoft\VisualStudio\NodeJs",
        "C:\Program Files\nodejs",
        "C:\Program Files (x86)\nodejs",
        "$env:LOCALAPPDATA\Programs\node",
        (Join-Path $ToolsDir "node")
    )

    foreach ($pattern in $NodeCandidates) {
        $found = Get-ChildItem -Path $pattern -Directory -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
        if ($found -and (Test-Path (Join-Path $found.FullName "node.exe"))) {
            $NodeDir = $found.FullName
            $NodeCmd = Join-Path $NodeDir "node.exe"
            break
        }
    }
}

# Si no existe en la computadora, descargarlo automáticamente
if (-not $NodeCmd) {
    Write-Host "  -> Node.js no encontrado en la computadora." -ForegroundColor Yellow
    Write-Host "  -> Descargando Node.js portable automáticamente..." -ForegroundColor Cyan

    $NodeZip = Join-Path $ToolsDir "node.zip"
    $NodeExtract = Join-Path $ToolsDir "node_temp"
    $NodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"

    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
        Invoke-WebRequest -Uri $NodeUrl -OutFile $NodeZip -UseBasicParsing
        Expand-Archive -Path $NodeZip -DestinationPath $NodeExtract -Force
        $inner = Get-ChildItem -Path $NodeExtract -Directory | Select-Object -First 1
        $TargetNode = Join-Path $ToolsDir "node"
        if (Test-Path $TargetNode) { Remove-Item $TargetNode -Recurse -Force }
        Move-Item -Path $inner.FullName -Destination $TargetNode
        Remove-Item $NodeZip, $NodeExtract -Recurse -Force -ErrorAction SilentlyContinue

        $NodeDir = $TargetNode
        $NodeCmd = Join-Path $NodeDir "node.exe"
        Write-Host "  -> Node.js instalado exitosamente en .tools\node" -ForegroundColor Green
    } catch {
        Write-Host "  -> Error al descargar Node.js: $_" -ForegroundColor Red
        Write-Host "  -> Intentando instalar con winget..." -ForegroundColor Yellow
        winget install OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
    }
}

if ($NodeDir) {
    $env:PATH = $NodeDir + ";" + $env:PATH
    Write-Host "  ✔ Node.js listo: $NodeDir (Versión: $(& $NodeCmd -v))" -ForegroundColor Green
} else {
    Write-Host "  ✖ No se pudo inicializar Node.js." -ForegroundColor Red
    pause
    exit 1
}

# -------------------------------------------------------------------------
# 3. VERIFICAR DEPENDENCIAS DEL FRONTEND (NPM INSTALL)
# -------------------------------------------------------------------------
Write-Host "[3/4] Verificando dependencias de Angular (node_modules)..." -ForegroundColor Yellow

$FrontendModules = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $FrontendModules)) {
    Write-Host "  -> Dependencias de frontend no instaladas. Ejecutando 'npm install'..." -ForegroundColor Cyan
    Push-Location $FrontendDir
    & npm.cmd install
    Pop-Location
    Write-Host "  ✔ Dependencias del frontend instaladas." -ForegroundColor Green
} else {
    Write-Host "  ✔ Dependencias del frontend ya instaladas." -ForegroundColor Green
}

# -------------------------------------------------------------------------
# 5. LEVANTAR SERVICIOS (BACKEND Y FRONTEND)
# -------------------------------------------------------------------------
Write-Host "[5/5] Levantando servicios en paralelo..." -ForegroundColor Yellow

$SpringRunCmd = if ($UsePostgres) {
    ".\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=""--spring.datasource.url=jdbc:postgresql://localhost:5432/swapp16046 --spring.datasource.driver-class-name=org.postgresql.Driver --spring.datasource.username=postgres --spring.datasource.password=postgres --spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect"""
} else {
    ".\mvnw.cmd spring-boot:run"
}

$BackendScript = @"
`$Host.UI.RawUI.WindowTitle = '[Backend] Spring Boot API - Puerto 9494'
`$env:JAVA_HOME = '$JavaHome'
`$env:PATH = '$JavaHome\bin;' + `$env:PATH
Set-Location '$BackendDir'
Write-Host '=====================================================' -ForegroundColor Cyan
Write-Host '   Iniciando Backend Spring Boot en puerto 9494...   ' -ForegroundColor Cyan
Write-Host '=====================================================' -ForegroundColor Cyan
$SpringRunCmd
"@

$FrontendScript = @"
`$Host.UI.RawUI.WindowTitle = '[Frontend] Angular App - Puerto 4200'
`$env:PATH = '$NodeDir;' + `$env:PATH
Set-Location '$FrontendDir'
Write-Host '=====================================================' -ForegroundColor Green
Write-Host '      Iniciando Frontend Angular en puerto 4200...    ' -ForegroundColor Green
Write-Host '=====================================================' -ForegroundColor Green
npx ng serve --port 4200 --host 0.0.0.0
"@

# Iniciar Backend en ventana propia
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $BackendScript

# Iniciar Frontend en ventana propia
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", $FrontendScript

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "       ¡PROYECTO LEVANTADO CON ÉXITO!                             " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "  • Frontend:    http://localhost:4200/  (o http://127.0.0.1:4200/)" -ForegroundColor White
Write-Host "  • Backend API: http://localhost:9494/" -ForegroundColor White
Write-Host "  • Swagger UI:  http://localhost:9494/swagger-ui.html" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  [IMPORTANTE] Si tu navegador intenta forzar HTTPS por proyectos viejos:" -ForegroundColor Yellow
Write-Host "  -> Abre una ventana en MODO INCÓGNITO en: http://localhost:4200/" -ForegroundColor Cyan
Write-Host "  -> O ingresa directamente con la IP:     http://127.0.0.1:4200/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abriendo el navegador..." -ForegroundColor Cyan

Start-Sleep -Seconds 4
Start-Process "http://localhost:4200/"
