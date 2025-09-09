@echo off
echo Sinif - Sınıf Rehberlik Uygulaması
echo ===================================
echo.
echo Production build başlatılıyor...
echo.

REM Node.js yüklü mü kontrol et
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Node.js yüklü değil!
    echo Lütfen https://nodejs.org adresinden Node.js'i indirin ve yükleyin.
    pause
    exit /b 1
)

REM npm yüklü mü kontrol et
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: npm yüklü değil!
    pause
    exit /b 1
)

REM Bağımlılıkları yükle
echo Bağımlılıklar yükleniyor...
call npm install
if %errorlevel% neq 0 (
    echo HATA: Bağımlılıklar yüklenemedi!
    pause
    exit /b 1
)

REM Production build oluştur
echo Production build oluşturuluyor...
call npm run build
if %errorlevel% neq 0 (
    echo HATA: Build oluşturulamadı!
    pause
    exit /b 1
)

REM Sunucuyu başlat
echo.
echo Sunucu başlatılıyor...
echo Tarayıcınızda http://localhost:5000 adresini açın
echo.
echo Sunucuyu durdurmak için Ctrl+C tuşlarına basın
echo.
call npm start