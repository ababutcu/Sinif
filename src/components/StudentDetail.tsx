import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Star, Plus, Trash2, Edit, Shield, FileText } from 'lucide-react';
import { StudentDetail as StudentDetailType, Talent, DevelopmentNote, EvaluationNote, Guardian } from '../types';
import WhatsAppPopup from './WhatsAppPopup';
import { generateStudentDetailPDF } from '../utils/pdfGenerator';

const StudentDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetailType | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [developmentNotes, setDevelopmentNotes] = useState<DevelopmentNote[]>([]);
  const [evaluationNotes, setEvaluationNotes] = useState<EvaluationNote[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [newTalent, setNewTalent] = useState('');
  const [newDevelopmentNote, setNewDevelopmentNote] = useState('');
  const [newEvaluationNote, setNewEvaluationNote] = useState('');
  const [newGuardian, setNewGuardian] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });
  const [whatsappPopup, setWhatsappPopup] = useState<{
    isOpen: boolean;
    phoneNumber: string;
    contactName: string;
    studentName: string;
  }>({
    isOpen: false,
    phoneNumber: '',
    contactName: '',
    studentName: ''
  });

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [studentRes, talentsRes, devNotesRes, evalNotesRes, guardiansRes] = await Promise.all([
        fetch(`/api/students/detail/${studentId}`),
        fetch(`/api/students/${studentId}/talents`),
        fetch(`/api/students/${studentId}/development-notes`),
        fetch(`/api/students/${studentId}/evaluation-notes`),
        fetch(`/api/students/${studentId}/guardians`)
      ]);

      const [studentData, talentsData, devNotesData, evalNotesData, guardiansData] = await Promise.all([
        studentRes.json(),
        talentsRes.json(),
        devNotesRes.json(),
        evalNotesRes.json(),
        guardiansRes.json()
      ]);

      setStudent(studentData);
      setTalents(talentsData);
      setDevelopmentNotes(devNotesData);
      setEvaluationNotes(evalNotesData);
      setGuardians(guardiansData);
    } catch (error) {
      console.error('Öğrenci bilgileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTalent = async () => {
    if (!newTalent.trim()) return;

    try {
      const response = await fetch(`/api/students/${studentId}/talents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talent_name: newTalent.trim() })
      });

      if (response.ok) {
        const newTalentData = await response.json();
        setTalents([...talents, newTalentData]);
        setNewTalent('');
      }
    } catch (error) {
      console.error('Yetenek eklenirken hata:', error);
    }
  };

  const addDevelopmentNote = async () => {
    if (!newDevelopmentNote.trim()) return;

    try {
      const response = await fetch(`/api/students/${studentId}/development-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newDevelopmentNote.trim() })
      });

      if (response.ok) {
        const newNote = await response.json();
        setDevelopmentNotes([newNote, ...developmentNotes]);
        setNewDevelopmentNote('');
      }
    } catch (error) {
      console.error('Gelişim notu eklenirken hata:', error);
    }
  };

  const addEvaluationNote = async () => {
    if (!newEvaluationNote.trim()) return;

    try {
      const response = await fetch(`/api/students/${studentId}/evaluation-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newEvaluationNote.trim() })
      });

      if (response.ok) {
        const newNote = await response.json();
        setEvaluationNotes([newNote, ...evaluationNotes]);
        setNewEvaluationNote('');
      }
    } catch (error) {
      console.error('Değerlendirme notu eklenirken hata:', error);
    }
  };

  const addGuardian = async () => {
    if (!newGuardian.name.trim()) return;

    try {
      const response = await fetch(`/api/students/${studentId}/guardians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuardian)
      });

      if (response.ok) {
        const newGuardianData = await response.json();
        setGuardians([...guardians, newGuardianData]);
        setNewGuardian({ name: '', phone: '', email: '', relationship: '' });
      }
    } catch (error) {
      console.error('Veli eklenirken hata:', error);
    }
  };

  const deleteGuardian = async (guardianId: number) => {
    if (!confirm('Bu veli bilgisini silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/guardians/${guardianId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGuardians(guardians.filter(guardian => guardian.id !== guardianId));
      }
    } catch (error) {
      console.error('Veli silinirken hata:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // SQLite'dan gelen tarih formatını parse et
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Eğer geçersiz tarih ise, orijinal string'i döndür
        return dateString;
      }
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };

  const handlePhoneClick = (phoneNumber: string, contactName: string) => {
    setWhatsappPopup({
      isOpen: true,
      phoneNumber,
      contactName,
      studentName: `${student?.first_name} ${student?.last_name}`
    });
  };

  const closeWhatsAppPopup = () => {
    setWhatsappPopup({
      isOpen: false,
      phoneNumber: '',
      contactName: '',
      studentName: ''
    });
  };

  const handleToggleActiveStatus = async () => {
    if (!student) return;

    try {
      const updatedStatus = !student.is_active;
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: updatedStatus }),
      });

      if (response.ok) {
        setStudent(prevStudent => prevStudent ? { ...prevStudent, is_active: updatedStatus } : null);
      } else {
        throw new Error('Durum güncellenirken hata oluştu.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Durum güncellenirken hata oluştu.');
    }
  };

  const handleExportPDF = () => {
    if (student) {
      generateStudentDetailPDF(student);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">Öğrenci bulunamadı</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-4">
                {student.photo ? (
                  <img
                    src={`/uploads/${student.photo}`}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {student.first_name} {student.last_name}
                    </h1>
                    {student.is_bilsem && (
                      <Star className="h-6 w-6 text-yellow-500" title="BİLSEM Öğrencisi" />
                    )}
                  </div>
                  <p className="text-gray-600">Öğrenci No: {student.student_number}</p>
                <div className="flex items-center mt-2">
                  <label htmlFor="toggle-active" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="toggle-active"
                        className="sr-only"
                        checked={student.is_active}
                        onChange={handleToggleActiveStatus}
                      />
                      <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                      {student.is_active ? 'Aktif' : 'Pasif'}
                    </div>
                  </label>
                </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => navigate(`/edit-student/${student.id}`)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Düzenle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Bilgiler' },
              { id: 'guardians', label: 'Veli Bilgileri' },
              { id: 'talents', label: 'Yetenekler' },
              { id: 'development', label: 'Gelişim Notları' },
              { id: 'evaluation', label: 'Değerlendirme Notları' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Öğrenci Bilgileri */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl border border-primary-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Öğrenci Bilgileri
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{student.first_name} {student.last_name}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Öğrenci Numarası</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{student.student_number}</p>
                    </div>
                    {student.birth_date && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Doğum Tarihi</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(student.birth_date)}</p>
                      </div>
                    )}
                    {student.health_info && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Sağlık Durumu</label>
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed">{student.health_info}</p>
                      </div>
                    )}
                    {student.special_conditions && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Özel Durumlar</label>
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed">{student.special_conditions}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Anne-Baba Durumu</label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {student.parents_together ? 'Beraber' : 'Ayrı'}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">BİLSEM</label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {student.is_bilsem ? 'Evet' : 'Hayır'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anne Bilgileri */}
              {student.mother_name && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-xl border border-pink-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-pink-600" />
                      Anne Bilgileri
                      {student.mother_is_guardian && (
                        <Shield className="h-4 w-4 ml-2 text-green-600" title="Veli" />
                      )}
                    </h2>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{student.mother_name}</p>
                      </div>
                                             {student.mother_phone && (
                         <div className="bg-white p-3 rounded-lg shadow-sm">
                           <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                             <Phone className="h-3 w-3 mr-1" />
                             Telefon
                           </label>
                           <button
                             onClick={() => handlePhoneClick(student.mother_phone!, student.mother_name!)}
                             className="mt-1 text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                           >
                             <span>{student.mother_phone}</span>
                             <Phone className="h-3 w-3" />
                           </button>
                         </div>
                       )}
                      {student.mother_email && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            E-posta
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.mother_email}</p>
                        </div>
                      )}
                      {student.mother_job && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Meslek
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.mother_job}</p>
                        </div>
                      )}
                      {student.mother_work_address && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            İş Adresi
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.mother_work_address}</p>
                        </div>
                      )}
                      {student.mother_address && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Adres</label>
                          <p className="mt-1 text-sm text-gray-700 leading-relaxed">{student.mother_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Baba Bilgileri */}
              {student.father_name && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Baba Bilgileri
                      {student.father_is_guardian && (
                        <Shield className="h-4 w-4 ml-2 text-green-600" title="Veli" />
                      )}
                    </h2>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{student.father_name}</p>
                      </div>
                                             {student.father_phone && (
                         <div className="bg-white p-3 rounded-lg shadow-sm">
                           <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                             <Phone className="h-3 w-3 mr-1" />
                             Telefon
                           </label>
                           <button
                             onClick={() => handlePhoneClick(student.father_phone!, student.father_name!)}
                             className="mt-1 text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                           >
                             <span>{student.father_phone}</span>
                             <Phone className="h-3 w-3" />
                           </button>
                         </div>
                       )}
                      {student.father_email && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            E-posta
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.father_email}</p>
                        </div>
                      )}
                      {student.father_job && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Meslek
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.father_job}</p>
                        </div>
                      )}
                      {student.father_work_address && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            İş Adresi
                          </label>
                          <p className="mt-1 text-sm text-gray-700">{student.father_work_address}</p>
                        </div>
                      )}
                      {student.father_address && (
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Adres</label>
                          <p className="mt-1 text-sm text-gray-700 leading-relaxed">{student.father_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guardians' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Veli Bilgileri</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newGuardian.name}
                    onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                    placeholder="Veli adı"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={newGuardian.relationship}
                    onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}
                    placeholder="Yakınlık (örn: Büyükanne)"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={newGuardian.phone}
                    onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                    placeholder="Telefon"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="email"
                    value={newGuardian.email}
                    onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                    placeholder="E-posta"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={addGuardian}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {guardians.length === 0 ? (
                <p className="text-gray-500">Henüz veli bilgisi eklenmemiş</p>
              ) : (
                <div className="space-y-4">
                  {guardians.map((guardian) => (
                    <div key={guardian.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{guardian.name}</h4>
                            {guardian.relationship && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {guardian.relationship}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {guardian.phone && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <button
                                  onClick={() => handlePhoneClick(guardian.phone!, guardian.name)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  {guardian.phone}
                                </button>
                              </div>
                            )}
                            {guardian.email && (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span>{guardian.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGuardian(guardian.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'talents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Yetenekler</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTalent}
                    onChange={(e) => setNewTalent(e.target.value)}
                    placeholder="Yeni yetenek ekle"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTalent()}
                  />
                  <button
                    onClick={addTalent}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {talents.length === 0 ? (
                <p className="text-gray-500">Henüz yetenek eklenmemiş</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {talents.map((talent) => (
                    <div key={talent.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">{talent.talent_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'development' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Gelişim Notları</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newDevelopmentNote}
                    onChange={(e) => setNewDevelopmentNote(e.target.value)}
                    placeholder="Yeni gelişim notu ekle"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addDevelopmentNote()}
                  />
                  <button
                    onClick={addDevelopmentNote}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {developmentNotes.length === 0 ? (
                <p className="text-gray-500">Henüz gelişim notu eklenmemiş</p>
              ) : (
                <div className="space-y-4">
                  {developmentNotes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900 mb-2">{note.note}</p>
                      <p className="text-xs text-gray-500">{formatDate(note.date)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Değerlendirme Notları</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newEvaluationNote}
                    onChange={(e) => setNewEvaluationNote(e.target.value)}
                    placeholder="Yeni değerlendirme notu ekle"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && addEvaluationNote()}
                  />
                  <button
                    onClick={addEvaluationNote}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {evaluationNotes.length === 0 ? (
                <p className="text-gray-500">Henüz değerlendirme notu eklenmemiş</p>
              ) : (
                <div className="space-y-4">
                  {evaluationNotes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900 mb-2">{note.note}</p>
                      <p className="text-xs text-gray-500">{formatDate(note.date)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <WhatsAppPopup
        isOpen={whatsappPopup.isOpen}
        onClose={closeWhatsAppPopup}
        phoneNumber={whatsappPopup.phoneNumber}
        contactName={whatsappPopup.contactName}
        studentName={whatsappPopup.studentName}
      />
    </div>
  );
};

export default StudentDetail; 