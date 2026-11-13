@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ================================================
echo   GoXpert - terbit laman ke goxpert.my
echo  ================================================
echo.
echo  Kali pertama di PC ini, pelayar akan terbuka dan
echo  minta kebenaran. Klik "Allow", pastu balik ke sini.
echo.
pause
echo.
call npx --yes wrangler@4.159.0 deploy
set RC=%ERRORLEVEL%
echo.
if "%RC%"=="0" goto ok

echo  ================================================
echo   GAGAL - laman TIDAK berubah
echo  ================================================
echo.
echo  Baca mesej ERROR di atas.
echo.
echo  "API timed out"  = masalah rangkaian.
echo                     Cuba lagi. Kalau gagal lagi,
echo                     guna hotspot telefon.
echo.
echo  "not recognized" = Node.js belum dipasang,
echo                     atau PC belum restart.
echo.
echo  "Authentication" = jalankan semula, klik Allow
echo                     dalam pelayar.
echo.
goto habis

:ok
echo  ================================================
echo   BERJAYA - buka https://goxpert.my
echo  ================================================
echo.
echo  Kalau laman nampak sama, tekan Ctrl+Shift+R
echo  dalam pelayar untuk muat semula tanpa cache.
echo.

:habis
pause
