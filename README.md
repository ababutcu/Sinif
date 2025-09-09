# Sinif - Sınıf Rehberlik Uygulaması

Ortaokul ve lise sınıf rehber öğretmenleri için geliştirilmiş kapsamlı öğrenci bilgi yönetim ve rehberlik sistemi.

## 🚀 Özellikler

### 📚 Temel Yönetim
- **Eğitim Yılı Yönetimi**: Farklı eğitim yılları için ayrı yönetim
- **Sınıf Yönetimi**: Her eğitim yılı için sınıf oluşturma ve yönetme
- **Öğrenci Kayıt**: Detaylı öğrenci bilgileri kaydetme
- **Veli Bilgileri**: Anne, baba ve diğer veli bilgileri
- **Fotoğraf Yükleme**: Öğrenci fotoğrafları

### 🎯 Rehberlik ve Takip
- **Rehberlik Planları**: Yıllık rehberlik planları oluşturma
- **Rehberlik Etkinlikleri**: Planlanan etkinlikleri takip etme
- **Takvim Görünümü**: Etkinlikleri takvimde görüntüleme
- **Dosya Yükleme**: Etkinlik belgelerini yükleme

### 📊 Raporlama ve Analiz
- **AI Destekli Raporlar**: Otomatik rapor oluşturma
- **PDF Raporları**: Öğrenci listesi ve detay raporları
- **Excel Dışa Aktarma**: Verileri Excel formatında dışa aktarma
- **Öğrenci Transfer**: Sınıflar arası öğrenci transferi

### 👥 Öğrenci Takibi
- **Yetenek Takibi**: Öğrenci yeteneklerini kaydetme
- **Gelişim Notları**: Yıl içi gelişim takibi
- **Değerlendirme Notları**: Öğrenci değerlendirme notları
- **BİLSEM Takibi**: BİLSEM öğrencilerini işaretleme
- **Sağlık Bilgileri**: Öğrenci sağlık durumu kayıtları
- **Özel Durumlar**: Öğrenci özel durumlarını kaydetme

### 📢 İletişim
- **Sınıf İlanları**: Sınıf duyuruları yayınlama
- **WhatsApp Entegrasyonu**: Veli iletişimi için WhatsApp desteği

## 🛠️ Teknolojiler

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Big Calendar** - Calendar component
- **jsPDF & html2canvas** - PDF generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 📦 Kurulum

1. **Repository'yi klonlayın:**
   ```bash
   git clone https://github.com/ababutcu/Sinif.git
   cd Sinif
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Backend sunucusunu başlatın:**
   ```bash
   npm run server
   ```

4. **Frontend geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## 🎯 Kullanım

### Eğitim Yılı Ekleme
1. Üst menüde "Eğitim Yılı" seçicisinin yanındaki + butonuna tıklayın
2. Yeni eğitim yılını girin (örn: 2025-2026)
3. "Ekle" butonuna tıklayın

### Sınıf Ekleme
1. Ana sayfada "Yeni Sınıf" butonuna tıklayın
2. Sınıf adını girin (örn: 5-A, 9-B)
3. "Ekle" butonuna tıklayın

### Öğrenci Ekleme
1. Sınıf sayfasında "Yeni Öğrenci" butonuna tıklayın
2. Öğrenci bilgilerini doldurun:
   - Temel bilgiler (ad, soyad, numara)
   - Fotoğraf (opsiyonel)
   - Sağlık durumu
   - Anne bilgileri
   - Baba bilgileri
   - Özel durumlar
3. "Öğrenci Ekle" butonuna tıklayın

### Rehberlik Planları
1. Sınıf sayfasında "Rehberlik Planları" sekmesine gidin
2. "Yeni Plan" butonuna tıklayın
3. Plan bilgilerini doldurun
4. Etkinlikler ekleyin ve dosya yükleyin

### AI Raporları
1. Sınıf sayfasında "AI Raporlar" sekmesine gidin
2. Rapor türünü seçin
3. "Rapor Oluştur" butonuna tıklayın

## 🗄️ Veritabanı Yapısı

Sistem aşağıdaki tabloları içerir:
- `education_years` - Eğitim yılları
- `classes` - Sınıflar
- `students` - Öğrenciler
- `mother_info` - Anne bilgileri
- `father_info` - Baba bilgileri
- `guardian_info` - Diğer veli bilgileri
- `talents` - Yetenekler
- `development_notes` - Gelişim notları
- `evaluation_notes` - Değerlendirme notları
- `announcements` - Sınıf ilanları
- `guidance_plans` - Rehberlik planları
- `guidance_events` - Rehberlik etkinlikleri

## 🔌 API Endpoints

### Eğitim Yılları
- `GET /api/education-years` - Tüm eğitim yıllarını listele
- `POST /api/education-years` - Yeni eğitim yılı ekle

### Sınıflar
- `GET /api/classes/:educationYearId` - Eğitim yılına ait sınıfları listele
- `POST /api/classes` - Yeni sınıf ekle

### Öğrenciler
- `GET /api/students/:classId` - Sınıftaki öğrencileri listele
- `POST /api/students` - Yeni öğrenci ekle
- `GET /api/students/detail/:studentId` - Öğrenci detaylarını getir
- `POST /api/students/transfer` - Öğrenci transferi

### Rehberlik
- `GET /api/guidance-plans/:classId` - Rehberlik planlarını listele
- `POST /api/guidance-plans` - Yeni rehberlik planı ekle
- `GET /api/guidance-events/:planId` - Etkinlikleri listele
- `POST /api/guidance-events` - Yeni etkinlik ekle

### Veli Bilgileri
- `GET /api/students/:studentId/guardians` - Veli bilgilerini listele
- `POST /api/students/:studentId/guardians` - Yeni veli ekle

## 📱 Özellikler

### 📊 Raporlama
- **Öğrenci Listesi PDF**: Sınıf öğrenci listesi
- **Öğrenci Detay PDF**: Tek öğrenci detay raporu
- **Rehberlik Raporu PDF**: Rehberlik planları ve etkinlikleri
- **AI Raporları**: Otomatik analiz raporları

### 📅 Takvim
- **Aylık Görünüm**: Rehberlik etkinliklerini takvimde görüntüleme
- **Etkinlik Detayları**: Etkinlik bilgilerini görüntüleme
- **Dosya Erişimi**: Etkinlik belgelerine erişim

### 🔄 Transfer
- **Sınıf Transferi**: Öğrencileri sınıflar arası taşıma
- **Eğitim Yılı Transferi**: Öğrencileri eğitim yılları arası taşıma

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**ababutcu** - [GitHub](https://github.com/ababutcu)

## 🙏 Teşekkürler

- React ekibine modern UI framework için
- Tailwind CSS ekibine utility-first CSS için
- Lucide ekibine güzel ikonlar için
- Tüm açık kaynak katkıda bulunanlara