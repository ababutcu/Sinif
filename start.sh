#!/bin/bash

echo "Sinif - Sınıf Rehberlik Uygulaması"
echo "==================================="
echo ""
echo "Production build başlatılıyor..."
echo ""

# Node.js yüklü mü kontrol et
if ! command -v node &> /dev/null; then
    echo "HATA: Node.js yüklü değil!"
    echo "Lütfen https://nodejs.org adresinden Node.js'i indirin ve yükleyin."
    exit 1
fi

# npm yüklü mü kontrol et
if ! command -v npm &> /dev/null; then
    echo "HATA: npm yüklü değil!"
    exit 1
fi

# Bağımlılıkları yükle
echo "Bağımlılıklar yükleniyor..."
npm install
if [ $? -ne 0 ]; then
    echo "HATA: Bağımlılıklar yüklenemedi!"
    exit 1
fi

# Production build oluştur
echo "Production build oluşturuluyor..."
npm run build
if [ $? -ne 0 ]; then
    echo "HATA: Build oluşturulamadı!"
    exit 1
fi

# Sunucuyu başlat
echo ""
echo "Sunucu başlatılıyor..."
echo "Tarayıcınızda http://localhost:5000 adresini açın"
echo ""
echo "Sunucuyu durdurmak için Ctrl+C tuşlarına basın"
echo ""
npm start