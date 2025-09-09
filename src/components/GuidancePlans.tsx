import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Calendar, Edit, Trash2, FileText, Download, Upload, List } from 'lucide-react';
import { GuidancePlan, GuidanceEvent, EducationYear } from '../types';
import { generateGuidanceReportPDF } from '../utils/pdfGenerator';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface GuidancePlansProps {
  selectedYear: EducationYear | null;
}

const GuidancePlans: React.FC<GuidancePlansProps> = ({ selectedYear }) => {
  const { classId } = useParams<{ classId: string }>();
  const [plans, setPlans] = useState<GuidancePlan[]>([]);
  const [events, setEvents] = useState<{ [planId: number]: GuidanceEvent[] }>({});
  const [loading, setLoading] = useState(true);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState<number | null>(null);
  const [editingPlan, setEditingPlan] = useState<GuidancePlan | null>(null);
  const [editingEvent, setEditingEvent] = useState<GuidanceEvent | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Form states
  const [newPlan, setNewPlan] = useState({
    date: '',
    topic: '',
    description: ''
  });
  
  const [newEvent, setNewEvent] = useState({
    date: '',
    event_name: '',
    description: '',
    file: null as File | null
  });

  useEffect(() => {
    if (classId && selectedYear) {
      fetchPlans();
    }
  }, [classId, selectedYear]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/guidance-plans/${classId}?educationYearId=${selectedYear?.id}`);
      const data = await response.json();
      setPlans(data);
      
      // Fetch events for each plan
      const eventsData: { [planId: number]: GuidanceEvent[] } = {};
      for (const plan of data) {
        const eventsResponse = await fetch(`/api/guidance-events/${plan.id}`);
        const eventsDataForPlan = await eventsResponse.json();
        eventsData[plan.id] = eventsDataForPlan;
      }
      setEvents(eventsData);
    } catch (error) {
      console.error('Rehberlik planları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.date || !newPlan.topic) return;

    try {
      const response = await fetch('/api/guidance-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          education_year_id: selectedYear?.id,
          date: newPlan.date,
          topic: newPlan.topic,
          description: newPlan.description
        })
      });

      if (response.ok) {
        const newPlanData = await response.json();
        setPlans([...plans, newPlanData]);
        setNewPlan({ date: '', topic: '', description: '' });
        setShowAddPlan(false);
      }
    } catch (error) {
      console.error('Plan eklenirken hata:', error);
    }
  };

  const handleAddEvent = async (e: React.FormEvent, planId: number) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.event_name) return;

    try {
      const formData = new FormData();
      formData.append('plan_id', planId.toString());
      formData.append('date', newEvent.date);
      formData.append('event_name', newEvent.event_name);
      formData.append('description', newEvent.description);
      if (newEvent.file) {
        formData.append('file', newEvent.file);
      }

      const response = await fetch('/api/guidance-events', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newEventData = await response.json();
        setEvents(prev => ({
          ...prev,
          [planId]: [...(prev[planId] || []), newEventData]
        }));
        setNewEvent({ date: '', event_name: '', description: '', file: null });
        setShowAddEvent(null);
      }
    } catch (error) {
      console.error('Etkinlik eklenirken hata:', error);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Bu planı ve tüm etkinliklerini silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/guidance-plans/${planId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPlans(plans.filter(plan => plan.id !== planId));
        const newEvents = { ...events };
        delete newEvents[planId];
        setEvents(newEvents);
      }
    } catch (error) {
      console.error('Plan silinirken hata:', error);
    }
  };

  const handleDeleteEvent = async (eventId: number, planId: number) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/guidance-events/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEvents(prev => ({
          ...prev,
          [planId]: prev[planId]?.filter(event => event.id !== eventId) || []
        }));
      }
    } catch (error) {
      console.error('Etkinlik silinirken hata:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };

  const handleExportPDF = () => {
    generateGuidanceReportPDF(plans, events, `Sınıf ${classId}`, selectedYear?.year || '');
  };

  const getCalendarEvents = () => {
    const calendarEvents: any[] = [];
    
    // Add plans as events
    plans.forEach(plan => {
      calendarEvents.push({
        id: `plan-${plan.id}`,
        title: plan.topic,
        start: new Date(plan.date),
        end: new Date(plan.date),
        type: 'plan',
        plan: plan
      });
    });
    
    // Add events as events
    Object.values(events).flat().forEach(event => {
      calendarEvents.push({
        id: `event-${event.id}`,
        title: event.event_name,
        start: new Date(event.date),
        end: new Date(event.date),
        type: 'event',
        event: event
      });
    });
    
    return calendarEvents;
  };

  const eventStyleGetter = (event: any) => {
    if (event.type === 'plan') {
      return {
        style: {
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }
      };
    } else {
      return {
        style: {
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }
      };
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rehberlik Planları</h1>
            <p className="text-gray-600">
              {selectedYear?.year} Eğitim Yılı • {plans.length} Plan
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-1 px-3 py-2 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Liste</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-1 px-3 py-2 text-sm ${
                  viewMode === 'calendar' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Takvim</span>
              </button>
            </div>
            {plans.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FileText className="h-4 w-4" />
                <span>PDF Rapor</span>
              </button>
            )}
            <button
              onClick={() => setShowAddPlan(true)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Plan</span>
            </button>
          </div>
        </div>

        {showAddPlan && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Yeni Rehberlik Planı</h3>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={newPlan.date}
                    onChange={(e) => setNewPlan({ ...newPlan, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input
                    type="text"
                    value={newPlan.topic}
                    onChange={(e) => setNewPlan({ ...newPlan, topic: e.target.value })}
                    placeholder="Plan konusu"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="Plan açıklaması"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlan(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz plan yok</h3>
            <p className="text-gray-500">İlk rehberlik planınızı ekleyerek başlayın</p>
          </div>
        ) : viewMode === 'calendar' ? (
          <div className="h-96">
            <BigCalendar
              localizer={localizer}
              events={getCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              defaultView="month"
              messages={{
                next: 'İleri',
                previous: 'Geri',
                today: 'Bugün',
                month: 'Ay',
                week: 'Hafta',
                day: 'Gün',
                agenda: 'Ajanda',
                date: 'Tarih',
                time: 'Saat',
                event: 'Etkinlik',
                noEventsInRange: 'Bu aralıkta etkinlik yok',
                showMore: (total: number) => `+${total} daha`
              }}
            />
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Rehberlik Planları</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Etkinlikler</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.topic}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(plan.date)}
                    </p>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAddEvent(plan.id)}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-800"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Etkinlik Ekle</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {showAddEvent === plan.id && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold mb-3">Yeni Etkinlik</h4>
                    <form onSubmit={(e) => handleAddEvent(e, plan.id)} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı</label>
                          <input
                            type="text"
                            value={newEvent.event_name}
                            onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                            placeholder="Etkinlik adı"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Etkinlik açıklaması"
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosya Ekle</label>
                        <input
                          type="file"
                          onChange={(e) => setNewEvent({ ...newEvent, file: e.target.files?.[0] || null })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700"
                        >
                          Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddEvent(null)}
                          className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
                        >
                          İptal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {events[plan.id]?.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz etkinlik eklenmemiş</p>
                  ) : (
                    events[plan.id]?.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{event.event_name}</h4>
                            <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                          {event.file_path && (
                            <div className="flex items-center space-x-1 mt-2">
                              <FileText className="h-3 w-3 text-gray-400" />
                              <a
                                href={`/uploads/${event.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Dosyayı Görüntüle
                              </a>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id, plan.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidancePlans;
