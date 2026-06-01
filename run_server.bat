@echo off
title AETHER EAL - Servidor Local
color 0b

echo =======================================================================
echo      A E T H E R E A L   //   S E R V I D O R   D E   A R T E   3 D
echo =======================================================================
echo.
echo Iniciando servidor HTTP local para renderizar la obra procedural...
echo.

set PORT=8080

:: Abrir navegador de inmediato en segundo plano
echo [Navegador] Abriendo http://localhost:%PORT% ...
start http://localhost:%PORT%

:: 1. Comprobar si Python está instalado (Método recomendado en Windows)
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [Servidor] Servidor iniciado usando Python 3 en puerto %PORT%...
    echo [Info] Presiona Ctrl+C para cerrar el servidor.
    python -m http.server %PORT%
    goto end
)

:: 2. Comprobar si Node.js/npx está instalado
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [Servidor] Servidor iniciado usando Node.js (http-server) en puerto %PORT%...
    echo [Info] Presiona Ctrl+C para cerrar el servidor.
    npx -y http-server -p %PORT%
    goto end
)

:: 3. Servidor de Emergencia NATIVO de Windows usando PowerShell (MIME Type strict para ES Modules)
echo.
echo [AVISO] No se detecto Python ni Node.js en las variables de entorno de Windows.
echo [Servidor] Iniciando Servidor Web Nativo con PowerShell en puerto %PORT%...
echo [Info] Para cerrar este servidor de emergencia, cierra esta ventana de comandos.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "& { ^
    Write-Host 'Servidor HTTP activo en puerto %PORT%. Sirviendo archivos locales...' -ForegroundColor Cyan; ^
    $listener = New-Object System.Net.HttpListener; ^
    $listener.Prefixes.Add('http://localhost:%PORT%/'); ^
    try { ^
        $listener.Start(); ^
        while ($listener.IsListening) { ^
            $context = $listener.GetContext(); ^
            $req = $context.Request; ^
            $res = $context.Response; ^
            $file = $req.Url.LocalPath.TrimStart('/'); ^
            if ($file -eq '') { $file = 'index.html' }; ^
            if (Test-Path $file) { ^
                $bytes = [System.IO.File]::ReadAllBytes($file); ^
                if ($file.EndsWith('.html')) { $res.ContentType = 'text/html; charset=utf-8' } ^
                elseif ($file.EndsWith('.css')) { $res.ContentType = 'text/css; charset=utf-8' } ^
                elseif ($file.EndsWith('.js')) { $res.ContentType = 'text/javascript; charset=utf-8' } ^
                $res.OutputStream.Write($bytes, 0, $bytes.Length); ^
            } else { ^
                $res.StatusCode = 404; ^
            } ^
            $res.Close(); ^
        } ^
    } catch { ^
        Write-Host 'Error iniciando el puerto. Es posible que el puerto %PORT% ya este en uso.' -ForegroundColor Red; ^
    } ^
}"

:end
pause
