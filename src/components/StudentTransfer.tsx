import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, ArrowRight, Check, X } from 'lucide-react';
import { Student, Class, EducationYear } from '../types';

interface StudentTransferProps {
  selectedYear: EducationYear | null;
}

const StudentTransfer: React.FC<StudentTransferProps> = ({ selectedYear }) => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [targetClasses, setTargetClasses] = useState<Class[]>([]);
  const [targetYears, setTargetYears] = useState<EducationYear[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [targetClassId, setTargetClassId] = useState<number | null>(null);
  const [targetYearId, setTargetYearId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (classId && selectedYear) {
      fetchData();
    }
  }, [classId, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, yearsRes] = await Promise.all([
        fetch(`/api/students/${classId}`),
        fetch('/api/education-years')
      ]);

      const [studentsData, yearsData] = await Promise.all([
        studentsRes.json(),
        yearsRes.json()
      ]);

      setStudents(studentsData);
      setTargetYears(yearsData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetClasses = async (yearId: number) => {
    try {
      const response = await fetch(`/api/classes/${yearId}`);
      const data = await response.json();
      setTargetClasses(data);
    } catch (error) {
      console.error('Hedef sınıflar yüklenirken hata:', error);
    }
  };

  const handleYearChange = (yearId: number) => {
    setTargetYearId(yearId);
    setTargetClassId(null);
    fetchTargetClasses(yearId);
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleTransfer = async () => {
    if (!targetClassId || !targetYearId || selectedStudents.length === 0) return;

    setTransferring(true);
    try {
      const response = await fetch('/api/students/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_ids: selectedStudents,
          target_class_id: targetClassId,
          target_education_year_id: targetYearId
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.transferred_count} öğrenci başarıyla transfer edildi`);
        setSelectedStudents([]);
        setTargetClassId(null);
        setTargetYearId(null);
        setShowConfirm(false);
        fetchData(); // Refresh the student list
      } else {
        const error = await response.json();
        alert(`Transfer hatası: ${error.error}`);
      }
    } catch (error) {
      console.error('Transfer hatası:', error);
      alert('Transfer sırasında bir hata oluştu');
    } finally {
      setTransferring(false);
    }
  };

  const getTargetClassName = () => {
    const targetClass = targetClasses.find(c => c.id === targetClassId);
    const targetYear = targetYears.find(y => y.id === targetYearId);
    return targetClass && targetYear ? `${targetClass.name} (${targetYear.year})` : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Users className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Öğrenci Transfer (Devir)</h1>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Bu sınıfta öğrenci yok</h3>
            <p className="text-gray-500">Transfer edilecek öğrenci bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Öğrenci Seçimi */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Transfer Edilecek Öğrenciler</h2>
                <button
                  onClick={handleSelectAll}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  {selectedStudents.length === students.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudents.includes(student.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedStudents.includes(student.id)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedStudents.includes(student.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-gray-500">No: {student.student_number}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                {selectedStudents.length} öğrenci seçildi
              </p>
            </div>

            {/* Hedef Seçimi */}
            {selectedStudents.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hedef Sınıf ve Yıl</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Eğitim Yılı</label>
                    <select
                      value={targetYearId || ''}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Eğitim yılı seçin</option>
                      {targetYears.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Sınıf</label>
                    <select
                      value={targetClassId || ''}
                      onChange={(e) => setTargetClassId(Number(e.target.value))}
                      disabled={!targetYearId}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    >
                      <option value="">Sınıf seçin</option>
                      {targetClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {targetClassId && targetYearId && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedStudents.length} öğrenci → {getTargetClassName()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transfer Butonu */}
            {selectedStudents.length > 0 && targetClassId && targetYearId && (
              <div className="border-t pt-6">
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={transferring}
                  className="w-full bg-primary-600 text-white px-4 py-3 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {transferring ? 'Transfer Ediliyor...' : 'Transfer Et'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Onay Modalı */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Onayı</h3>
            <p className="text-gray-600 mb-6">
              <strong>{selectedStudents.length}</strong> öğrenciyi <strong>{getTargetClassName()}</strong> sınıfına transfer etmek istediğinizden emin misiniz?
            </p>
            <p className="text-sm text-red-600 mb-6">
              Bu işlem geri alınamaz!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleTransfer}
                disabled={transferring}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {transferring ? 'Transfer Ediliyor...' : 'Evet, Transfer Et'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={transferring}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTransfer;
