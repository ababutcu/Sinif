import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Star } from 'lucide-react';
import { Class, EducationYear } from '../types';

interface AddStudentProps {
  selectedClass: Class;
  selectedYear: EducationYear;
}

const AddStudent: React.FC<AddStudentProps> = ({ selectedClass, selectedYear }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    student_number: '',
    birth_date: '',
    photo: null as File | null,
    health_info: '',
    parents_together: true,
    is_bilsem: false,
    special_conditions: '',
    mother_name: '',
    mother_phone: '',
    mother_email: '',
    mother_job: '',
    mother_work_address: '',
    mother_address: '',
    mother_is_guardian: false,
    father_name: '',
    father_phone: '',
    father_email: '',
    father_job: '',
    father_work_address: '',
    father_address: '',
    father_is_guardian: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        photo: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Öğrenci bilgileri
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('student_number', formData.student_number);
      formDataToSend.append('birth_date', formData.birth_date);
      formDataToSend.append('class_id', selectedClass.id.toString());
      formDataToSend.append('education_year_id', selectedYear.id.toString());
      formDataToSend.append('health_info', formData.health_info);
      formDataToSend.append('parents_together', formData.parents_together.toString());
      formDataToSend.append('is_bilsem', formData.is_bilsem.toString());
      formDataToSend.append('special_conditions', formData.special_conditions);

      // Anne bilgileri
      formDataToSend.append('mother_name', formData.mother_name);
      formDataToSend.append('mother_phone', formData.mother_phone);
      formDataToSend.append('mother_email', formData.mother_email);
      formDataToSend.append('mother_job', formData.mother_job);
      formDataToSend.append('mother_work_address', formData.mother_work_address);
      formDataToSend.append('mother_address', formData.mother_address);
      formDataToSend.append('mother_is_guardian', formData.mother_is_guardian.toString());

      // Baba bilgileri
      formDataToSend.append('father_name', formData.father_name);
      formDataToSend.append('father_phone', formData.father_phone);
      formDataToSend.append('father_email', formData.father_email);
      formDataToSend.append('father_job', formData.father_job);
      formDataToSend.append('father_work_address', formData.father_work_address);
      formDataToSend.append('father_address', formData.father_address);
      formDataToSend.append('father_is_guardian', formData.father_is_guardian.toString());

      // Fotoğraf
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        navigate(`/class/${selectedClass.id}`);
      } else {
        throw new Error('Öğrenci eklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Öğrenci eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(`/class/${selectedClass.id}`)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Öğrenci Ekle</h1>
            <p className="text-gray-600">{selectedClass.name} • {selectedYear.year}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Öğrenci Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Öğrenci Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Öğrenci Numarası *
                </label>
                <input
                  type="text"
                  name="student_number"
                  value={formData.student_number}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doğum Tarihi
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotoğraf
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Fotoğraf Seç</span>
                  </label>
                  {formData.photo && (
                    <span className="text-sm text-gray-600">{formData.photo.name}</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sağlık Durumu
                </label>
                <textarea
                  name="health_info"
                  value={formData.health_info}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Öğrencinin sağlık durumu hakkında bilgiler..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="parents_together"
                    checked={formData.parents_together}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Anne-baba beraber</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_bilsem"
                    checked={formData.is_bilsem}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    BİLSEM Öğrencisi
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Özel Durumlar
                </label>
                <textarea
                  name="special_conditions"
                  value={formData.special_conditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Öğrencinin özel durumları..."
                />
              </div>
            </div>
          </div>

          {/* Anne Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Anne Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne Adı
                </label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne Telefon
                </label>
                <input
                  type="tel"
                  name="mother_phone"
                  value={formData.mother_phone}
                  onChange={handleInputChange}
                  pattern="[0-9+\s\-\(\)]*"
                  title="Sadece rakam, +, -, (, ) ve boşluk karakterleri kullanabilirsiniz"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+90 555 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne E-posta
                </label>
                <input
                  type="email"
                  name="mother_email"
                  value={formData.mother_email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne Meslek
                </label>
                <input
                  type="text"
                  name="mother_job"
                  value={formData.mother_job}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne İş Adresi
                </label>
                <input
                  type="text"
                  name="mother_work_address"
                  value={formData.mother_work_address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anne Adresi
                </label>
                <textarea
                  name="mother_address"
                  value={formData.mother_address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="mother_is_guardian"
                    checked={formData.mother_is_guardian}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Anne veli mi?</span>
                </label>
              </div>
            </div>
          </div>

          {/* Baba Bilgileri */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Baba Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba Adı
                </label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba Telefon
                </label>
                <input
                  type="tel"
                  name="father_phone"
                  value={formData.father_phone}
                  onChange={handleInputChange}
                  pattern="[0-9+\s\-\(\)]*"
                  title="Sadece rakam, +, -, (, ) ve boşluk karakterleri kullanabilirsiniz"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+90 555 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba E-posta
                </label>
                <input
                  type="email"
                  name="father_email"
                  value={formData.father_email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba Meslek
                </label>
                <input
                  type="text"
                  name="father_job"
                  value={formData.father_job}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba İş Adresi
                </label>
                <input
                  type="text"
                  name="father_work_address"
                  value={formData.father_work_address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baba Adresi
                </label>
                <textarea
                  name="father_address"
                  value={formData.father_address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="father_is_guardian"
                    checked={formData.father_is_guardian}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Baba veli mi?</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/class/${selectedClass.id}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Ekleniyor...' : 'Öğrenci Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent; 