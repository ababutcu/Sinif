# Production Kurulum Rehberi

Bu rehber, Sinif uygulamasını production ortamında çalıştırmak için gerekli adımları açıklar.

## 🚀 Hızlı Başlangıç

### Windows Kullanıcıları
1. `start.bat` dosyasına çift tıklayın
2. Tarayıcınızda `http://localhost:5000` adresini açın

### Linux/Mac Kullanıcıları
```bash
./start.sh
```

## 📋 Gereksinimler

- **Node.js**: v16.0.0 veya üzeri
- **npm**: v8.0.0 veya üzeri
- **İşletim Sistemi**: Windows, macOS, Linux

## 🛠️ Manuel Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Production Build Oluşturun
```bash
npm run build
```

### 3. Sunucuyu Başlatın
```bash
npm start
```

## 🌐 Erişim

Uygulama başlatıldıktan sonra:
- **URL**: http://localhost:5000
- **Port**: 5000 (değiştirilebilir)

## 📁 Dosya Yapısı

```
Sinif/
├── dist/                 # Production build dosyaları
│   ├── index.html       # Ana HTML dosyası
│   └── assets/          # CSS, JS ve diğer asset'ler
├── server/
│   └── index.js         # Express.js sunucusu
├── uploads/             # Yüklenen dosyalar
├── database.sqlite      # SQLite veritabanı
├── start.bat           # Windows başlatma script'i
├── start.sh            # Linux/Mac başlatma script'i
└── package.json        # Proje konfigürasyonu
```

## ⚙️ Konfigürasyon

### Port Değiştirme
`server/index.js` dosyasında `PORT` değişkenini değiştirin:
```javascript
const PORT = 3000; // Varsayılan: 5000
```

### Veritabanı Konumu
Veritabanı dosyası proje kök dizininde `database.sqlite` olarak saklanır.

## 🔧 Sorun Giderme

### Port Zaten Kullanımda
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMARASI> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Node.js Bulunamadı
- Node.js'in yüklü olduğundan emin olun
- PATH değişkenini kontrol edin
- Terminal'i yeniden başlatın

### Bağımlılık Hataları
```bash
# node_modules klasörünü silin ve yeniden yükleyin
rm -rf node_modules
npm install
```

### Build Hataları
```bash
# TypeScript hatalarını kontrol edin
npm run build
```

## 📊 Performans

### Önerilen Sistem Gereksinimleri
- **RAM**: 2GB minimum, 4GB önerilen
- **Disk**: 500MB boş alan
- **CPU**: 2 çekirdek minimum

### Optimizasyon İpuçları
- Büyük dosya yüklemeleri için disk alanını kontrol edin
- Veritabanı yedeklerini düzenli olarak alın
- Log dosyalarını temizleyin

## 🔒 Güvenlik

### Production Ortamı İçin
1. **HTTPS Kullanın**: SSL sertifikası ekleyin
2. **Firewall**: Gerekli portları açın
3. **Yedekleme**: Veritabanını düzenli yedekleyin
4. **Güncelleme**: Bağımlılıkları güncel tutun

### Veritabanı Yedekleme
```bash
# SQLite veritabanını yedekleyin
cp database.sqlite database_backup_$(date +%Y%m%d_%H%M%S).sqlite
```

## 🚀 Deployment

### PM2 ile Production
```bash
# PM2 yükleyin
npm install -g pm2

# Uygulamayı başlatın
pm2 start server/index.js --name "sinif"

# Otomatik başlatma
pm2 startup
pm2 save
```

### Docker ile Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Destek

Sorunlarınız için:
- GitHub Issues: https://github.com/ababutcu/Sinif/issues
- Dokümantasyon: README.md dosyasını inceleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.