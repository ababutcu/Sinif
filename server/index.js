const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// SQLite veritabanı bağlantısı
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
  } else {
    console.log('SQLite veritabanına bağlandı');
    initDatabase();
  }
});

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Veritabanı tablolarını oluştur
function initDatabase() {
  db.serialize(() => {
    // Eğitim yılları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS education_years (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT 1
    )`);

    // Sınıflar tablosu
    db.run(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      education_year_id INTEGER,
      FOREIGN KEY (education_year_id) REFERENCES education_years (id)
    )`);

    // Öğrenciler tablosu
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      student_number TEXT NOT NULL,
      birth_date TEXT,
      class_id INTEGER,
      education_year_id INTEGER,
      is_active BOOLEAN DEFAULT 1,
      health_info TEXT,
      parents_together BOOLEAN,
      is_bilsem BOOLEAN DEFAULT 0,
      special_conditions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (education_year_id) REFERENCES education_years (id)
    )`);

    // Anne bilgileri tablosu
    db.run(`CREATE TABLE IF NOT EXISTS mother_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      job TEXT,
      work_address TEXT,
      address TEXT,
      is_guardian BOOLEAN DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Baba bilgileri tablosu
    db.run(`CREATE TABLE IF NOT EXISTS father_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      job TEXT,
      work_address TEXT,
      address TEXT,
      is_guardian BOOLEAN DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Veli bilgileri tablosu (anne/baba dışındaki veliler için)
    db.run(`CREATE TABLE IF NOT EXISTS guardian_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      relationship TEXT,
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Yetenekler tablosu
    db.run(`CREATE TABLE IF NOT EXISTS talents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      talent_name TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Gelişim notları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS development_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      note TEXT NOT NULL,
      date TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // Değerlendirme notları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS evaluation_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      note TEXT NOT NULL,
      date TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (student_id) REFERENCES students (id)
    )`);

    // İlanlar tablosu
    db.run(`CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      education_year_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      event_date TEXT,
      is_shared BOOLEAN DEFAULT 0,
      shared_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (education_year_id) REFERENCES education_years (id)
    )`);

    // Rehberlik planları tablosu
    db.run(`CREATE TABLE IF NOT EXISTS guidance_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      education_year_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      topic TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (education_year_id) REFERENCES education_years (id)
    )`);

    // Rehberlik etkinlikleri tablosu
    db.run(`CREATE TABLE IF NOT EXISTS guidance_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      event_name TEXT NOT NULL,
      description TEXT,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES guidance_plans (id)
    )`);

    // Varsayılan eğitim yılı ekle
    db.run(`INSERT OR IGNORE INTO education_years (year) VALUES ('2025-2026')`);

    // Mevcut duplicate kayıtları temizle
    db.run(`DELETE FROM mother_info WHERE id NOT IN (
      SELECT MIN(id) FROM mother_info GROUP BY student_id
    )`);
    
    db.run(`DELETE FROM father_info WHERE id NOT IN (
      SELECT MIN(id) FROM father_info GROUP BY student_id
    )`);
  });
}

// API Routes

// Eğitim yılları
app.get('/api/education-years', (req, res) => {
  db.all('SELECT * FROM education_years ORDER BY year DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/education-years', (req, res) => {
  const { year } = req.body;
  db.run('INSERT INTO education_years (year) VALUES (?)', [year], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, year });
  });
});

// Sınıflar
app.get('/api/classes/:educationYearId', (req, res) => {
  const { educationYearId } = req.params;
  db.all('SELECT * FROM classes WHERE education_year_id = ? ORDER BY name', [educationYearId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/classes', (req, res) => {
  const { name, education_year_id } = req.body;
  db.run('INSERT INTO classes (name, education_year_id) VALUES (?, ?)', [name, education_year_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, education_year_id });
  });
});

// Öğrenciler
app.get('/api/students/:classId', (req, res) => {
  const { classId } = req.params;
  db.all(`
    SELECT s.*, 
           m.name as mother_name, m.phone as mother_phone, m.email as mother_email,
           f.name as father_name, f.phone as father_phone, f.email as father_email
    FROM students s
    LEFT JOIN mother_info m ON s.id = m.student_id
    LEFT JOIN father_info f ON s.id = f.student_id
    WHERE s.class_id = ? AND s.is_active = 1
    ORDER BY s.last_name, s.first_name
  `, [classId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students', upload.single('photo'), (req, res) => {
  const {
    first_name, last_name, student_number, birth_date, class_id, education_year_id,
    health_info, parents_together, is_bilsem, special_conditions,
    mother_name, mother_phone, mother_email, mother_job, mother_work_address, mother_address, mother_is_guardian,
    father_name, father_phone, father_email, father_job, father_work_address, father_address, father_is_guardian
  } = req.body;

  // Telefon numarası validasyonu
  const phoneRegex = /^[0-9+\s\-\(\)]*$/;
  if (mother_phone && !phoneRegex.test(mother_phone)) {
    return res.status(400).json({ error: 'Anne telefon numarası sadece rakam, +, -, (, ) ve boşluk içerebilir' });
  }
  if (father_phone && !phoneRegex.test(father_phone)) {
    return res.status(400).json({ error: 'Baba telefon numarası sadece rakam, +, -, (, ) ve boşluk içerebilir' });
  }

  const photo = req.file ? req.file.filename : null;

  db.serialize(() => {
    db.run(`
      INSERT INTO students (photo, first_name, last_name, student_number, birth_date, class_id, education_year_id, 
                           health_info, parents_together, is_bilsem, special_conditions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [photo, first_name, last_name, student_number, birth_date, class_id, education_year_id,
        health_info, parents_together, is_bilsem, special_conditions], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const studentId = this.lastID;

      // Anne bilgilerini ekle
      if (mother_name) {
        db.run(`
          INSERT INTO mother_info (student_id, name, phone, email, job, work_address, address, is_guardian)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [studentId, mother_name, mother_phone, mother_email, mother_job, mother_work_address, mother_address, mother_is_guardian || 0]);
      }

      // Baba bilgilerini ekle
      if (father_name) {
        db.run(`
          INSERT INTO father_info (student_id, name, phone, email, job, work_address, address, is_guardian)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [studentId, father_name, father_phone, father_email, father_job, father_work_address, father_address, father_is_guardian || 0]);
      }

      res.json({ id: studentId, message: 'Öğrenci başarıyla eklendi' });
    });
  });
});

app.get('/api/students/detail/:studentId', (req, res) => {
  const { studentId } = req.params;
  db.get(`
    SELECT s.*, 
           m.name as mother_name, m.phone as mother_phone, m.email as mother_email, 
           m.job as mother_job, m.work_address as mother_work_address, m.address as mother_address, m.is_guardian as mother_is_guardian,
           f.name as father_name, f.phone as father_phone, f.email as father_email,
           f.job as father_job, f.work_address as father_work_address, f.address as father_address, f.is_guardian as father_is_guardian
    FROM students s
    LEFT JOIN mother_info m ON s.id = m.student_id
    LEFT JOIN father_info f ON s.id = f.student_id
    WHERE s.id = ?
  `, [studentId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Yetenekler
app.get('/api/students/:studentId/talents', (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM talents WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students/:studentId/talents', (req, res) => {
  const { studentId } = req.params;
  const { talent_name } = req.body;
  db.run('INSERT INTO talents (student_id, talent_name) VALUES (?, ?)', [studentId, talent_name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, talent_name });
  });
});

// Gelişim notları
app.get('/api/students/:studentId/development-notes', (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM development_notes WHERE student_id = ? ORDER BY date DESC', [studentId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students/:studentId/development-notes', (req, res) => {
  const { studentId } = req.params;
  const { note } = req.body;
  const currentDate = new Date().toISOString();
  db.run('INSERT INTO development_notes (student_id, note, date) VALUES (?, ?, ?)', [studentId, note, currentDate], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, note, date: currentDate });
  });
});

// Değerlendirme notları
app.get('/api/students/:studentId/evaluation-notes', (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM evaluation_notes WHERE student_id = ? ORDER BY date DESC', [studentId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students/:studentId/evaluation-notes', (req, res) => {
  const { studentId } = req.params;
  const { note } = req.body;
  const currentDate = new Date().toISOString();
  db.run('INSERT INTO evaluation_notes (student_id, note, date) VALUES (?, ?, ?)', [studentId, note, currentDate], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, note, date: currentDate });
  });
});

// İlanlar (Announcements)
app.get('/api/announcements/:classId', (req, res) => {
  const { classId } = req.params;
  const { educationYearId } = req.query;

  let query = 'SELECT * FROM announcements WHERE class_id = ?';
  const params = [classId];

  if (educationYearId) {
    query += ' AND education_year_id = ?';
    params.push(educationYearId);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/announcements', (req, res) => {
  const { class_id, education_year_id, title, event_date, notes } = req.body;
  db.run(
    'INSERT INTO announcements (class_id, education_year_id, title, event_date, notes) VALUES (?, ?, ?, ?, ?)',
    [class_id, education_year_id, title, event_date, notes],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, class_id, education_year_id, title, event_date, notes });
    }
  );
});

app.put('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const { title, event_date, is_shared, shared_date, notes } = req.body;

  const isSharedBool = is_shared === true || is_shared === 1 || is_shared === 'true';

  db.run(
    `UPDATE announcements 
     SET title = ?, event_date = ?, is_shared = ?, shared_date = ?, notes = ? 
     WHERE id = ?`,
    [title, event_date, isSharedBool, shared_date, notes, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'İlan güncellendi', changes: this.changes });
    }
  );
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM announcements WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'İlan silindi', changes: this.changes });
  });
});

// Rehberlik Planları
app.get('/api/guidance-plans/:classId', (req, res) => {
  const { classId } = req.params;
  const { educationYearId } = req.query;

  let query = 'SELECT * FROM guidance_plans WHERE class_id = ?';
  const params = [classId];

  if (educationYearId) {
    query += ' AND education_year_id = ?';
    params.push(educationYearId);
  }

  query += ' ORDER BY date ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/guidance-plans', (req, res) => {
  const { class_id, education_year_id, date, topic, description } = req.body;
  db.run(
    'INSERT INTO guidance_plans (class_id, education_year_id, date, topic, description) VALUES (?, ?, ?, ?, ?)',
    [class_id, education_year_id, date, topic, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, class_id, education_year_id, date, topic, description });
    }
  );
});

app.put('/api/guidance-plans/:id', (req, res) => {
  const { id } = req.params;
  const { date, topic, description } = req.body;

  db.run(
    `UPDATE guidance_plans 
     SET date = ?, topic = ?, description = ? 
     WHERE id = ?`,
    [date, topic, description, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Rehberlik planı güncellendi', changes: this.changes });
    }
  );
});

app.delete('/api/guidance-plans/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guidance_plans WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Rehberlik planı silindi', changes: this.changes });
  });
});

// Rehberlik Etkinlikleri
app.get('/api/guidance-events/:planId', (req, res) => {
  const { planId } = req.params;
  db.all('SELECT * FROM guidance_events WHERE plan_id = ? ORDER BY date ASC', [planId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/guidance-events', upload.single('file'), (req, res) => {
  const { plan_id, date, event_name, description } = req.body;
  const file_path = req.file ? req.file.filename : null;

  db.run(
    'INSERT INTO guidance_events (plan_id, date, event_name, description, file_path) VALUES (?, ?, ?, ?, ?)',
    [plan_id, date, event_name, description, file_path],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, plan_id, date, event_name, description, file_path });
    }
  );
});

app.put('/api/guidance-events/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { date, event_name, description } = req.body;
  const file_path = req.file ? req.file.filename : null;

  let updateQuery = 'UPDATE guidance_events SET date = ?, event_name = ?, description = ?';
  let updateParams = [date, event_name, description];

  if (file_path) {
    updateQuery += ', file_path = ?';
    updateParams.push(file_path);
  }

  updateQuery += ' WHERE id = ?';
  updateParams.push(id);

  db.run(updateQuery, updateParams, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Etkinlik güncellendi', changes: this.changes });
  });
});

app.delete('/api/guidance-events/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guidance_events WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Etkinlik silindi', changes: this.changes });
  });
});

// Guardian Management (Non-parent guardians)
app.get('/api/students/:studentId/guardians', (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM guardian_info WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students/:studentId/guardians', (req, res) => {
  const { studentId } = req.params;
  const { name, phone, email, relationship } = req.body;
  
  db.run(
    'INSERT INTO guardian_info (student_id, name, phone, email, relationship) VALUES (?, ?, ?, ?, ?)',
    [studentId, name, phone, email, relationship],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, student_id: studentId, name, phone, email, relationship });
    }
  );
});

app.put('/api/guardians/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, email, relationship } = req.body;

  db.run(
    'UPDATE guardian_info SET name = ?, phone = ?, email = ?, relationship = ? WHERE id = ?',
    [name, phone, email, relationship, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Veli bilgisi güncellendi', changes: this.changes });
    }
  );
});

app.delete('/api/guardians/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guardian_info WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Veli bilgisi silindi', changes: this.changes });
  });
});

// Öğrenci Transfer (Devir Modülü)
app.post('/api/students/transfer', (req, res) => {
  const { student_ids, target_class_id, target_education_year_id } = req.body;

  if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
    return res.status(400).json({ error: 'Öğrenci ID\'leri gerekli' });
  }

  if (!target_class_id || !target_education_year_id) {
    return res.status(400).json({ error: 'Hedef sınıf ve eğitim yılı gerekli' });
  }

  db.serialize(() => {
    const stmt = db.prepare('UPDATE students SET class_id = ?, education_year_id = ? WHERE id = ?');
    
    student_ids.forEach((studentId) => {
      stmt.run([target_class_id, target_education_year_id, studentId], function(err) {
        if (err) {
          console.error(`Öğrenci ${studentId} transfer edilirken hata:`, err);
        }
      });
    });
    
    stmt.finalize((err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        message: `${student_ids.length} öğrenci başarıyla transfer edildi`,
        transferred_count: student_ids.length
      });
    });
  });
});

// Öğrenci güncelleme
app.put('/api/students/:studentId', upload.single('photo'), (req, res) => {
  const { studentId } = req.params;
  const {
    first_name, last_name, student_number, birth_date, class_id, education_year_id,
    health_info, parents_together, is_bilsem, special_conditions, is_active,
    mother_name, mother_phone, mother_email, mother_job, mother_work_address, mother_address, mother_is_guardian,
    father_name, father_phone, father_email, father_job, father_work_address, father_address, father_is_guardian
  } = req.body;

  // Telefon numarası validasyonu
  const phoneRegex = /^[0-9+\s\-\(\)]*$/;
  if (mother_phone && !phoneRegex.test(mother_phone)) {
    return res.status(400).json({ error: 'Anne telefon numarası sadece rakam, +, -, (, ) ve boşluk içerebilir' });
  }
  if (father_phone && !phoneRegex.test(father_phone)) {
    return res.status(400).json({ error: 'Baba telefon numarası sadece rakam, +, -, (, ) ve boşluk içerebilir' });
  }

  const photo = req.file ? req.file.filename : null;

  db.serialize(() => {
    // Öğrenci bilgilerini güncelle
    let updateQuery = `
      UPDATE students SET 
        first_name = ?, last_name = ?, student_number = ?, birth_date = ?, class_id = ?, education_year_id = ?,
        health_info = ?, parents_together = ?, is_bilsem = ?, special_conditions = ?, is_active = ?
    `;
    let updateParams = [first_name, last_name, student_number, birth_date, class_id, education_year_id,
                       health_info, parents_together, is_bilsem, special_conditions, is_active];

    if (photo) {
      updateQuery += ', photo = ?';
      updateParams.push(photo);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(studentId);

    db.run(updateQuery, updateParams, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Anne bilgilerini güncelle/ekle
      if (mother_name) {
        // Önce mevcut kaydı kontrol et
        db.get('SELECT id FROM mother_info WHERE student_id = ?', [studentId], (err, row) => {
          if (err) {
            console.error('Anne bilgileri kontrol edilirken hata:', err);
            return;
          }
          
          if (row) {
            // Mevcut kaydı güncelle
            db.run(`
              UPDATE mother_info SET 
                name = ?, phone = ?, email = ?, job = ?, work_address = ?, address = ?, is_guardian = ?
              WHERE student_id = ?
            `, [mother_name, mother_phone, mother_email, mother_job, mother_work_address, mother_address, mother_is_guardian || 0, studentId]);
          } else {
            // Yeni kayıt ekle
            db.run(`
              INSERT INTO mother_info 
              (student_id, name, phone, email, job, work_address, address, is_guardian)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [studentId, mother_name, mother_phone, mother_email, mother_job, mother_work_address, mother_address, mother_is_guardian || 0]);
          }
        });
      } else {
        db.run('DELETE FROM mother_info WHERE student_id = ?', [studentId]);
      }

      // Baba bilgilerini güncelle/ekle
      if (father_name) {
        // Önce mevcut kaydı kontrol et
        db.get('SELECT id FROM father_info WHERE student_id = ?', [studentId], (err, row) => {
          if (err) {
            console.error('Baba bilgileri kontrol edilirken hata:', err);
            return;
          }
          
          if (row) {
            // Mevcut kaydı güncelle
            db.run(`
              UPDATE father_info SET 
                name = ?, phone = ?, email = ?, job = ?, work_address = ?, address = ?, is_guardian = ?
              WHERE student_id = ?
            `, [father_name, father_phone, father_email, father_job, father_work_address, father_address, father_is_guardian || 0, studentId]);
          } else {
            // Yeni kayıt ekle
            db.run(`
              INSERT INTO father_info 
              (student_id, name, phone, email, job, work_address, address, is_guardian)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [studentId, father_name, father_phone, father_email, father_job, father_work_address, father_address, father_is_guardian || 0]);
          }
        });
      } else {
        db.run('DELETE FROM father_info WHERE student_id = ?', [studentId]);
      }

      res.json({ message: 'Öğrenci başarıyla güncellendi' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

// Uygulama kapatıldığında veritabanı bağlantısını kapat
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Veritabanı bağlantısı kapatıldı.');
    process.exit(0);
  });
});
 