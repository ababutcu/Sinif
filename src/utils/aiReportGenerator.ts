import jsPDF from 'jspdf';
import { Student, GuidancePlan, GuidanceEvent, Class, EducationYear } from '../types';

interface AIReportData {
  className: string;
  educationYear: string;
  students: Student[];
  plans: GuidancePlan[];
  events: { [planId: number]: GuidanceEvent[] };
  totalStudents: number;
  activeStudents: number;
  totalPlans: number;
  totalEvents: number;
  completedEvents: number;
}

export const generateAIReport = (data: AIReportData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(`${data.className} Sınıfı AI Destekli Rehberlik Raporu`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Eğitim Yılı: ${data.educationYear}`, 20, 30);
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, 35);
  
  let yPosition = 50;
  
  // Executive Summary
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Yönetici Özeti', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const summaryText = generateSummaryText(data);
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 5 + 10;
  
  // Student Analysis
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Öğrenci Analizi', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const studentAnalysis = generateStudentAnalysis(data);
  const studentLines = doc.splitTextToSize(studentAnalysis, 170);
  doc.text(studentLines, 20, yPosition);
  yPosition += studentLines.length * 5 + 10;
  
  // Guidance Activities Analysis
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Rehberlik Faaliyetleri Analizi', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const activitiesAnalysis = generateActivitiesAnalysis(data);
  const activitiesLines = doc.splitTextToSize(activitiesAnalysis, 170);
  doc.text(activitiesLines, 20, yPosition);
  yPosition += activitiesLines.length * 5 + 10;
  
  // Recommendations
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Öneriler ve Gelecek Planları', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const recommendations = generateRecommendations(data);
  const recommendationLines = doc.splitTextToSize(recommendations, 170);
  doc.text(recommendationLines, 20, yPosition);
  
  doc.save(`${data.className}_AI_Rehberlik_Raporu.pdf`);
};

const generateSummaryText = (data: AIReportData): string => {
  const completionRate = data.totalEvents > 0 ? Math.round((data.completedEvents / data.totalEvents) * 100) : 0;
  
  return `Bu rapor, ${data.educationYear} eğitim öğretim yılında ${data.className} sınıfına ait rehberlik faaliyetlerinin kapsamlı analizini sunmaktadır. 
  
Sınıfta toplam ${data.totalStudents} öğrenci bulunmakta olup, bunların ${data.activeStudents} tanesi aktif durumdadır. 
Eğitim yılı boyunca ${data.totalPlans} rehberlik planı oluşturulmuş ve ${data.totalEvents} etkinlik gerçekleştirilmiştir. 
Etkinlik tamamlanma oranı %${completionRate} olarak hesaplanmıştır.

Bu veriler, sınıfın genel rehberlik performansını ve öğrenci gelişim süreçlerini değerlendirmek için kullanılmıştır.`;
};

const generateStudentAnalysis = (data: AIReportData): string => {
  const bilsemStudents = data.students.filter(s => s.is_bilsem).length;
  const parentsTogether = data.students.filter(s => s.parents_together).length;
  const parentsSeparated = data.students.filter(s => !s.parents_together).length;
  
  return `Öğrenci profili analizi şu sonuçları ortaya koymaktadır:

• BİLSEM öğrenci sayısı: ${bilsemStudents} (${Math.round((bilsemStudents / data.totalStudents) * 100)}%)
• Anne-baba birlikte olan aileler: ${parentsTogether} (${Math.round((parentsTogether / data.totalStudents) * 100)}%)
• Anne-baba ayrı olan aileler: ${parentsSeparated} (${Math.round((parentsSeparated / data.totalStudents) * 100)}%)

Bu veriler, öğrencilerin aile yapısı ve özel yetenek durumları hakkında önemli bilgiler sağlamaktadır. 
BİLSEM öğrencilerinin özel ihtiyaçları ve ayrı ailelerden gelen öğrencilerin desteklenmesi gereken alanları dikkate alınmalıdır.`;
};

const generateActivitiesAnalysis = (data: AIReportData): string => {
  const completionRate = data.totalEvents > 0 ? Math.round((data.completedEvents / data.totalEvents) * 100) : 0;
  const avgEventsPerPlan = data.totalPlans > 0 ? Math.round(data.totalEvents / data.totalPlans) : 0;
  
  return `Rehberlik faaliyetleri analizi:

• Toplam plan sayısı: ${data.totalPlans}
• Toplam etkinlik sayısı: ${data.totalEvents}
• Plan başına ortalama etkinlik: ${avgEventsPerPlan}
• Etkinlik tamamlanma oranı: %${completionRate}

${completionRate >= 80 ? 'Yüksek tamamlanma oranı, rehberlik programının başarılı bir şekilde uygulandığını göstermektedir.' : 
  'Tamamlanma oranının artırılması için ek çalışmalar yapılması önerilmektedir.'}

Planların çeşitliliği ve etkinliklerin öğrenci ihtiyaçlarına uygunluğu değerlendirilmelidir.`;
};

const generateRecommendations = (data: AIReportData): string => {
  const bilsemStudents = data.students.filter(s => s.is_bilsem).length;
  const parentsSeparated = data.students.filter(s => !s.parents_together).length;
  
  let recommendations = 'Gelecek dönem için öneriler:\n\n';
  
  if (bilsemStudents > 0) {
    recommendations += `• BİLSEM öğrencileri için özel destek programları geliştirilmelidir.\n`;
  }
  
  if (parentsSeparated > data.totalStudents * 0.3) {
    recommendations += `• Ayrı ailelerden gelen öğrenciler için psikolojik destek etkinlikleri artırılmalıdır.\n`;
  }
  
  recommendations += `• Rehberlik planlarının öğrenci geri bildirimleri ile güncellenmesi sağlanmalıdır.\n`;
  recommendations += `• Veli katılımını artırmak için düzenli toplantılar planlanmalıdır.\n`;
  recommendations += `• Öğrenci gelişim takibi için daha detaylı değerlendirme araçları kullanılmalıdır.\n`;
  
  return recommendations;
};

// AI Integration placeholder - can be extended with actual AI services
export const generateAIInsights = async (data: AIReportData): Promise<string> => {
  // This is a placeholder for AI integration
  // In a real implementation, this would call an AI service like OpenAI, Claude, etc.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const insights = `
AI Analiz Sonuçları:

1. Öğrenci Gelişim Trendleri:
   - Sınıf genelinde pozitif gelişim eğilimi gözlemlenmektedir
   - BİLSEM öğrencilerinin özel programlara ihtiyacı vardır

2. Rehberlik Etkinlikleri Değerlendirmesi:
   - Etkinlik çeşitliliği yeterli düzeydedir
   - Veli katılımı artırılabilir

3. Öneriler:
   - Daha fazla grup çalışması yapılmalı
   - Bireysel danışmanlık saatleri artırılmalı
   - Teknoloji kullanımı ile etkinlikler zenginleştirilmeli
      `;
      resolve(insights);
    }, 1000);
  });
};
