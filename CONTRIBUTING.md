# Katkıda Bulunma Rehberi

Bu projeye katkıda bulunduğunuz için teşekkür ederiz! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🚀 Başlamadan Önce

1. **Fork yapın**: Bu repository'yi fork edin
2. **Clone edin**: Fork ettiğiniz repository'yi local olarak clone edin
3. **Branch oluşturun**: Yeni bir feature branch oluşturun

```bash
git clone https://github.com/YOUR_USERNAME/Sinif.git
cd Sinif
git checkout -b feature/amazing-feature
```

## 🛠️ Geliştirme Ortamı Kurulumu

1. **Bağımlılıkları yükleyin**:
   ```bash
   npm install
   ```

2. **Backend sunucusunu başlatın**:
   ```bash
   npm run server
   ```

3. **Frontend geliştirme sunucusunu başlatın**:
   ```bash
   npm run dev
   ```

## 📝 Katkı Türleri

### 🐛 Bug Düzeltmeleri
- Mevcut bir hatayı düzeltmek
- Performans iyileştirmeleri
- Güvenlik açıklarını kapatmak

### ✨ Yeni Özellikler
- Yeni fonksiyonaliteler eklemek
- UI/UX iyileştirmeleri
- Yeni API endpoint'leri

### 📚 Dokümantasyon
- README güncellemeleri
- Kod yorumları
- API dokümantasyonu

### 🧪 Testler
- Unit testler
- Integration testler
- E2E testler

## 📋 Katkı Süreci

### 1. Issue Oluşturun
- Yeni bir özellik veya bug için issue oluşturun
- Mevcut issue'ları kontrol edin
- Issue'yu detaylı açıklayın

### 2. Kod Yazın
- Temiz ve okunabilir kod yazın
- TypeScript kullanın
- Tailwind CSS ile styling yapın
- Mevcut kod stilini takip edin

### 3. Test Edin
- Kodunuzu test edin
- Mevcut özelliklerin bozulmadığından emin olun
- Farklı tarayıcılarda test edin

### 4. Commit Yapın
- Anlamlı commit mesajları yazın
- Küçük ve odaklanmış commit'ler yapın

```bash
git add .
git commit -m "feat: add new student transfer feature"
```

### 5. Push Edin
```bash
git push origin feature/amazing-feature
```

### 6. Pull Request Oluşturun
- Detaylı açıklama yazın
- Hangi değişiklikleri yaptığınızı belirtin
- Screenshot'lar ekleyin (UI değişiklikleri için)
- İlgili issue'ları linkleyin

## 🎨 Kod Stili

### TypeScript
- Strict mode kullanın
- Interface'leri tanımlayın
- Type safety'yi koruyun

### React
- Functional component'ler kullanın
- Hooks'ları doğru şekilde kullanın
- Props'ları type'layın

### CSS
- Tailwind CSS utility class'larını kullanın
- Responsive design uygulayın
- Consistent spacing kullanın

### API
- RESTful endpoint'ler oluşturun
- Error handling ekleyin
- Response format'ını standardize edin

## 📁 Proje Yapısı

```
src/
├── components/          # React component'leri
│   ├── Dashboard.tsx
│   ├── StudentList.tsx
│   └── ...
├── utils/              # Utility fonksiyonları
│   ├── pdfGenerator.ts
│   └── aiReportGenerator.ts
├── types.ts            # TypeScript type tanımları
└── App.tsx             # Ana uygulama

server/
└── index.js            # Backend server
```

## 🐛 Bug Raporlama

Bug raporu oluştururken şunları ekleyin:

1. **Açıklama**: Bug'ın ne olduğunu açıklayın
2. **Adımlar**: Bug'ı reproduce etmek için adımlar
3. **Beklenen Davranış**: Ne olması gerektiği
4. **Gerçek Davranış**: Ne olduğu
5. **Screenshot'lar**: Varsa görsel kanıtlar
6. **Sistem Bilgileri**: OS, tarayıcı, versiyon

## ✨ Özellik İstekleri

Yeni özellik önerirken:

1. **Problem**: Hangi problemi çözecek
2. **Çözüm**: Önerdiğiniz çözüm
3. **Alternatifler**: Diğer olası çözümler
4. **Ek Bilgiler**: Ek context veya bilgiler

## 📞 İletişim

- **Issues**: GitHub Issues kullanın
- **Discussions**: GitHub Discussions kullanın
- **Email**: ababutcu@example.com

## 📄 Lisans

Bu projeye katkıda bulunarak, katkılarınızın MIT lisansı altında lisanslanacağını kabul etmiş olursunuz.

## 🙏 Teşekkürler

Katkıda bulunan herkese teşekkür ederiz! Bu proje açık kaynak topluluğunun desteğiyle gelişmektedir.