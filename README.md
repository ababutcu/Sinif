# Siniff - Öğrenci Bilgi Yönetim Sistemi

Ortaokul ve lise sınıf rehber öğretmenleri için geliştirilmiş öğrenci bilgi yönetim sistemi.

## Özellikler

- **Eğitim Yılı Yönetimi**: Farklı eğitim yılları için ayrı yönetim
- **Sınıf Yönetimi**: Her eğitim yılı için sınıf oluşturma ve yönetme
- **Öğrenci Kayıt**: Detaylı öğrenci bilgileri kaydetme
- **Veli Bilgileri**: Anne, baba ve diğer veli bilgileri
- **Fotoğraf Yükleme**: Öğrenci fotoğrafları
- **Yetenek Takibi**: Öğrenci yeteneklerini kaydetme
- **Gelişim Notları**: Yıl içi gelişim takibi
- **Değerlendirme Notları**: Öğrenci değerlendirme notları
- **BİLSEM Takibi**: BİLSEM öğrencilerini işaretleme
- **Sağlık Bilgileri**: Öğrenci sağlık durumu kayıtları
- **Özel Durumlar**: Öğrenci özel durumlarını kaydetme

## Teknolojiler

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Veritabanı**: SQLite
- **Dosya Yükleme**: Multer
- **İkonlar**: Lucide React

## Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Backend sunucusunu başlatın:**
   ```bash
   npm run server
   ```

3. **Frontend geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

## Kullanım

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

### Öğrenci Detayları
1. Öğrenci kartına tıklayarak detay sayfasına gidin
2. Farklı sekmelerde:
   - **Bilgiler**: Tüm öğrenci ve veli bilgileri
   - **Yetenekler**: Öğrenci yeteneklerini ekleyin
   - **Gelişim Notları**: Yıl içi gelişim notları
   - **Değerlendirme Notları**: Değerlendirme notları

## Veritabanı Yapısı

Sistem aşağıdaki tabloları içerir:
- `education_years`: Eğitim yılları
- `classes`: Sınıflar
- `students`: Öğrenciler
- `mother_info`: Anne bilgileri
- `father_info`: Baba bilgileri
- `guardian_info`: Diğer veli bilgileri
- `talents`: Yetenekler
- `development_notes`: Gelişim notları
- `evaluation_notes`: Değerlendirme notları

## API Endpoints

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

### Yetenekler
- `GET /api/students/:studentId/talents` - Öğrenci yeteneklerini listele
- `POST /api/students/:studentId/talents` - Yeni yetenek ekle

### Notlar
- `GET /api/students/:studentId/development-notes` - Gelişim notlarını listele
- `POST /api/students/:studentId/development-notes` - Yeni gelişim notu ekle
- `GET /api/students/:studentId/evaluation-notes` - Değerlendirme notlarını listele
- `POST /api/students/:studentId/evaluation-notes` - Yeni değerlendirme notu ekle

## Lisans

MIT License 