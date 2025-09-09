import jsPDF from 'jspdf';
import { Student, GuidancePlan, GuidanceEvent, Class, EducationYear } from '../types';

export const generateStudentListPDF = (
  students: Student[],
  className: string,
  educationYear: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(`${className} Sınıfı Öğrenci Listesi`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Eğitim Yılı: ${educationYear}`, 20, 30);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 35);
  
  // Table headers
  const headers = ['No', 'Ad Soyad', 'Anne', 'Baba', 'Anne Tel', 'Baba Tel'];
  const colWidths = [15, 50, 40, 40, 25, 25];
  let yPosition = 50;
  
  // Header row
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  let xPosition = 20;
  headers.forEach((header, index) => {
    doc.text(header, xPosition, yPosition);
    xPosition += colWidths[index];
  });
  
  // Data rows
  doc.setFont(undefined, 'normal');
  yPosition += 10;
  
  students.forEach((student, index) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    const rowData = [
      student.student_number,
      `${student.first_name} ${student.last_name}`,
      student.mother_name || '-',
      student.father_name || '-',
      student.mother_phone || '-',
      student.father_phone || '-'
    ];
    
    xPosition = 20;
    rowData.forEach((data, colIndex) => {
      doc.text(data.toString(), xPosition, yPosition);
      xPosition += colWidths[colIndex];
    });
    
    yPosition += 7;
  });
  
  doc.save(`${className}_ogrenci_listesi.pdf`);
};

export const generateGuidanceReportPDF = (
  plans: GuidancePlan[],
  events: { [planId: number]: GuidanceEvent[] },
  className: string,
  educationYear: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(`${className} Sınıfı Rehberlik Raporu`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Eğitim Yılı: ${educationYear}`, 20, 30);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 35);
  
  let yPosition = 50;
  
  plans.forEach((plan, planIndex) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Plan header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${planIndex + 1}. ${plan.topic}`, 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Tarih: ${new Date(plan.date).toLocaleDateString('tr-TR')}`, 20, yPosition);
    yPosition += 7;
    
    if (plan.description) {
      doc.text(`Açıklama: ${plan.description}`, 20, yPosition);
      yPosition += 7;
    }
    
    // Events
    const planEvents = events[plan.id] || [];
    if (planEvents.length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Etkinlikler:', 20, yPosition);
      yPosition += 7;
      
      doc.setFont(undefined, 'normal');
      planEvents.forEach((event) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`• ${event.event_name} (${new Date(event.date).toLocaleDateString('tr-TR')})`, 25, yPosition);
        yPosition += 5;
        
        if (event.description) {
          doc.text(`  ${event.description}`, 25, yPosition);
          yPosition += 5;
        }
      });
    }
    
    yPosition += 10;
  });
  
  doc.save(`${className}_rehberlik_raporu.pdf`);
};

export const generateStudentDetailPDF = (student: Student) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(`${student.first_name} ${student.last_name} - Öğrenci Detayı`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Öğrenci No: ${student.student_number}`, 20, 30);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 35);
  
  let yPosition = 50;
  
  // Student Info
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Öğrenci Bilgileri', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Ad Soyad: ${student.first_name} ${student.last_name}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Öğrenci No: ${student.student_number}`, 20, yPosition);
  yPosition += 7;
  
  if (student.birth_date) {
    doc.text(`Doğum Tarihi: ${new Date(student.birth_date).toLocaleDateString('tr-TR')}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (student.health_info) {
    doc.text(`Sağlık Durumu: ${student.health_info}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (student.special_conditions) {
    doc.text(`Özel Durumlar: ${student.special_conditions}`, 20, yPosition);
    yPosition += 7;
  }
  
  doc.text(`Anne-Baba Durumu: ${student.parents_together ? 'Beraber' : 'Ayrı'}`, 20, yPosition);
  yPosition += 7;
  doc.text(`BİLSEM: ${student.is_bilsem ? 'Evet' : 'Hayır'}`, 20, yPosition);
  yPosition += 15;
  
  // Mother Info
  if (student.mother_name) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Anne Bilgileri', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Ad Soyad: ${student.mother_name}`, 20, yPosition);
    yPosition += 7;
    
    if (student.mother_phone) {
      doc.text(`Telefon: ${student.mother_phone}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (student.mother_email) {
      doc.text(`E-posta: ${student.mother_email}`, 20, yPosition);
      yPosition += 7;
    }
    
    yPosition += 10;
  }
  
  // Father Info
  if (student.father_name) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Baba Bilgileri', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Ad Soyad: ${student.father_name}`, 20, yPosition);
    yPosition += 7;
    
    if (student.father_phone) {
      doc.text(`Telefon: ${student.father_phone}`, 20, yPosition);
      yPosition += 7;
    }
    
    if (student.father_email) {
      doc.text(`E-posta: ${student.father_email}`, 20, yPosition);
      yPosition += 7;
    }
  }
  
  doc.save(`${student.first_name}_${student.last_name}_detay.pdf`);
};
