import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, User, Phone, Mail, Star, Download, FileText } from 'lucide-react';
import { Student, EducationYear, Class } from '../types';
import WhatsAppPopup from './WhatsAppPopup';
import * as XLSX from 'xlsx';
import { generateStudentListPDF } from '../utils/pdfGenerator';

interface StudentListProps {
  selectedClass: Class;
  selectedYear: EducationYear | null;
}

const StudentList: React.FC<StudentListProps> = ({ selectedClass, selectedYear }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchStudents();
  }, [selectedClass.id]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/students/${selectedClass.id}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Öğrenciler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent, phoneNumber: string, contactName: string, studentName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWhatsappPopup({
      isOpen: true,
      phoneNumber,
      contactName,
      studentName
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

  const handleExport = () => {
    const mappedData = students.map(student => ({
      'Öğrenci No': student.student_number,
      'Adı': student.first_name,
      'Soyadı': student.last_name,
      'Anne Adı': student.mother_name,
      'Anne Telefonu': student.mother_phone,
      'Anne Email': student.mother_email,
      'Baba Adı': student.father_name,
      'Baba Telefonu': student.father_phone,
      'Baba Email': student.father_email,
      'Anne Baba Birlikte Mi': student.parents_together ? 'Evet' : 'Hayır',
      'BİLSEM Öğrencisi': student.is_bilsem ? 'Evet' : 'Hayır',
      'Sağlık Bilgisi': student.health_info,
      'Özel Durumlar': student.special_conditions,
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Öğrenciler");
    XLSX.writeFile(workbook, `${selectedClass.name}_ogrenci_listesi.xlsx`);
  };

  const handleExportPDF = () => {
    generateStudentListPDF(students, selectedClass.name, selectedYear?.year || '');
  };

  // Sayfa yenilendiğinde öğrenci listesini güncelle
  useEffect(() => {
    const handleStorageChange = () => {
      fetchStudents();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', fetchStudents);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', fetchStudents);
    };
  }, [selectedClass.id]);

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedClass.name} Sınıfı
            </h1>
            <p className="text-gray-600">
              {selectedYear?.year} Eğitim Yılı • {students.length} Öğrenci
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Download className="h-4 w-4" />
              <span>Excel'e Aktar</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FileText className="h-4 w-4" />
              <span>PDF Oluştur</span>
            </button>
            <Link
              to="/add-student"
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Öğrenci</span>
            </Link>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz öğrenci yok</h3>
            <p className="text-gray-500 mb-4">Bu sınıfa ilk öğrenciyi ekleyerek başlayın</p>
            <Link
              to="/add-student"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              <span>Öğrenci Ekle</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Link
                key={student.id}
                to={`/student/${student.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {student.photo ? (
                      <img
                        src={`/uploads/${student.photo}`}
                        alt={`${student.first_name} ${student.last_name}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {student.first_name} {student.last_name}
                      </h3>
                      {student.is_bilsem && (
                        <Star className="h-4 w-4 text-yellow-500" title="BİLSEM Öğrencisi" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">No: {student.student_number}</p>
                    
                    <div className="space-y-1">
                      {student.mother_name && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span>Anne:</span>
                          <span className="font-medium">{student.mother_name}</span>
                          {student.mother_phone && (
                            <button
                              onClick={(e) => handlePhoneClick(e, student.mother_phone!, student.mother_name!, `${student.first_name} ${student.last_name}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title={`${student.mother_phone} - WhatsApp'ta aç`}
                            >
                              <Phone className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}
                      
                      {student.father_name && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span>Baba:</span>
                          <span className="font-medium">{student.father_name}</span>
                          {student.father_phone && (
                            <button
                              onClick={(e) => handlePhoneClick(e, student.father_phone!, student.father_name!, `${student.first_name} ${student.last_name}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title={`${student.father_phone} - WhatsApp'ta aç`}
                            >
                              <Phone className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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

export default StudentList;
