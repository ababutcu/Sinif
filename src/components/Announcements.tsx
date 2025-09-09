import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Announcement, EducationYear } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AnnouncementsProps {
  selectedYear: EducationYear | null;
}

const Announcements: React.FC<AnnouncementsProps> = ({ selectedYear }) => {
  const { classId } = useParams<{ classId: string }>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    event_date: '',
    notes: '',
  });

  useEffect(() => {
    if (classId && selectedYear) {
      fetchAnnouncements(classId, selectedYear.id);
    }
  }, [classId, selectedYear]);

  const fetchAnnouncements = async (id: string, educationYearId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/announcements/${id}?educationYearId=${educationYearId}`);
      if (!response.ok) {
        throw new Error('İlanlar yüklenirken bir hata oluştu.');
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !selectedYear) return;

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...newAnnouncement, 
          class_id: parseInt(classId),
          education_year_id: selectedYear.id 
        }),
      });

      if (!response.ok) {
        throw new Error('İlan oluşturulurken bir hata oluştu.');
      }

      setIsCreateModalOpen(false);
      if (classId && selectedYear) {
        fetchAnnouncements(classId, selectedYear.id);
      }
      setNewAnnouncement({ title: '', event_date: '', notes: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement) return;

    try {
      const response = await fetch(`/api/announcements/${selectedAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedAnnouncement),
      });

      if (!response.ok) {
        throw new Error('İlan güncellenirken bir hata oluştu.');
      }

      setIsEditModalOpen(false);
      if (classId && selectedYear) {
        fetchAnnouncements(classId, selectedYear.id);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/announcements/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('İlan silinirken bir hata oluştu.');
        }

        if (classId && selectedYear) {
          fetchAnnouncements(classId, selectedYear.id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">İlanlar yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">İlanlar</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni İlan Ekle
        </button>
      </div>

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Yeni İlan Oluştur</h2>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Başlık</label>
                <input 
                  type="text"
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">Etkinlik Tarihi (opsiyonel)</label>
                <input 
                  type="date"
                  id="event_date"
                  value={newAnnouncement.event_date}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, event_date: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notlar (opsiyonel)</label>
                <textarea 
                  id="notes"
                  rows={4}
                  value={newAnnouncement.notes}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, notes: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {isEditModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">İlanı Düzenle</h2>
            <form onSubmit={handleUpdateAnnouncement}>
              <div className="mb-4">
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Başlık</label>
                <input 
                  type="text"
                  id="edit-title"
                  value={selectedAnnouncement.title}
                  onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-event_date" className="block text-sm font-medium text-gray-700">Etkinlik Tarihi (opsiyonel)</label>
                <input 
                  type="date"
                  id="edit-event_date"
                  value={selectedAnnouncement.event_date ? new Date(selectedAnnouncement.event_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, event_date: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">Notlar (opsiyonel)</label>
                <textarea 
                  id="edit-notes"
                  rows={4}
                  value={selectedAnnouncement.notes || ''}
                  onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, notes: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {announcements.length === 0 ? (
        <p>Bu sınıf için henüz bir ilan yok.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  {announcement.event_date && (
                    <p className="text-sm text-gray-600">Etkinlik Tarihi: {new Date(announcement.event_date).toLocaleDateString()}</p>
                  )}
                  {announcement.notes && (
                    <p className="mt-2 whitespace-pre-wrap">{announcement.notes}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openEditModal(announcement)} className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Oluşturulma: {new Date(announcement.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Announcements;
