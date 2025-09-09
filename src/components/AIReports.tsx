import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, FileText, Download, Loader, Sparkles } from 'lucide-react';
import { Student, GuidancePlan, GuidanceEvent, EducationYear } from '../types';
import { generateAIReport, generateAIInsights } from '../utils/aiReportGenerator';

interface AIReportsProps {
  selectedYear: EducationYear | null;
}

const AIReports: React.FC<AIReportsProps> = ({ selectedYear }) => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [plans, setPlans] = useState<GuidancePlan[]>([]);
  const [events, setEvents] = useState<{ [planId: number]: GuidanceEvent[] }>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (classId && selectedYear) {
      fetchData();
    }
  }, [classId, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, plansRes] = await Promise.all([
        fetch(`/api/students/${classId}`),
        fetch(`/api/guidance-plans/${classId}?educationYearId=${selectedYear?.id}`)
      ]);

      const [studentsData, plansData] = await Promise.all([
        studentsRes.json(),
        plansRes.json()
      ]);

      setStudents(studentsData);
      setPlans(plansData);

      // Fetch events for each plan
      const eventsData: { [planId: number]: GuidanceEvent[] } = {};
      for (const plan of plansData) {
        const eventsResponse = await fetch(`/api/guidance-events/${plan.id}`);
        const eventsDataForPlan = await eventsResponse.json();
        eventsData[plan.id] = eventsDataForPlan;
      }
      setEvents(eventsData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const totalEvents = Object.values(events).flat().length;
      const completedEvents = Object.values(events).flat().filter(event => 
        new Date(event.date) <= new Date()
      ).length;

      const reportData = {
        className: `Sınıf ${classId}`,
        educationYear: selectedYear?.year || '',
        students,
        plans,
        events,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.is_active).length,
        totalPlans: plans.length,
        totalEvents,
        completedEvents
      };

      generateAIReport(reportData);
    } catch (error) {
      console.error('Rapor oluşturulurken hata:', error);
      alert('Rapor oluşturulurken bir hata oluştu');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGenerating(true);
    setShowInsights(true);
    try {
      const totalEvents = Object.values(events).flat().length;
      const completedEvents = Object.values(events).flat().filter(event => 
        new Date(event.date) <= new Date()
      ).length;

      const reportData = {
        className: `Sınıf ${classId}`,
        educationYear: selectedYear?.year || '',
        students,
        plans,
        events,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.is_active).length,
        totalPlans: plans.length,
        totalEvents,
        completedEvents
      };

      const insights = await generateAIInsights(reportData);
      setAiInsights(insights);
    } catch (error) {
      console.error('AI analizi oluşturulurken hata:', error);
      alert('AI analizi oluşturulurken bir hata oluştu');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalEvents = Object.values(events).flat().length;
  const completedEvents = Object.values(events).flat().filter(event => 
    new Date(event.date) <= new Date()
  ).length;
  const completionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">AI Destekli Raporlama</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">Toplam Öğrenci</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">{students.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-900">Aktif Öğrenci</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {students.filter(s => s.is_active).length}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-purple-900">Rehberlik Planı</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-1">{plans.length}</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-900">Tamamlanma Oranı</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-1">%{completionRate}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateReport}
            disabled={generating || plans.length === 0}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span>AI Raporu Oluştur</span>
          </button>
          
          <button
            onClick={handleGenerateInsights}
            disabled={generating}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            <span>AI Analizi Al</span>
          </button>
        </div>

        {plans.length === 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Not:</strong> AI raporu oluşturmak için önce rehberlik planları eklemeniz gerekmektedir.
            </p>
          </div>
        )}
      </div>

      {/* AI Insights Panel */}
      {showInsights && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Analiz Sonuçları</h2>
          </div>
          
          {generating ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">AI analizi oluşturuluyor...</span>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {aiInsights}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Report Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Rapor Özellikleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">📊 Otomatik Analiz</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Öğrenci profil analizi</li>
              <li>• Rehberlik etkinlik değerlendirmesi</li>
              <li>• Başarı oranları hesaplama</li>
              <li>• Trend analizi</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🎯 Akıllı Öneriler</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gelecek dönem planları</li>
              <li>• Öğrenci ihtiyaç analizi</li>
              <li>• Etkinlik önerileri</li>
              <li>• Veli katılım stratejileri</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReports;
