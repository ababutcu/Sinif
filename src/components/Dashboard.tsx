import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen } from 'lucide-react';
import { EducationYear, Class } from '../types';

interface DashboardProps {
  selectedYear: EducationYear | null;
  classes: Class[];
  selectedClass: Class | null;
  onClassSelect: (cls: Class) => void;
  onAddClass: (name: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  selectedYear,
  classes,
  selectedClass,
  onClassSelect,
  onAddClass
}) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName('');
      setShowAddClass(false);
    }
  };

  if (!selectedYear) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">Eğitim yılı seçin</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedYear.year} Eğitim Yılı
          </h1>
          <button
            onClick={() => setShowAddClass(!showAddClass)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Sınıf</span>
          </button>
        </div>

        {showAddClass && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleAddClass} className="flex items-center space-x-2">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Sınıf adı (örn: 5-A, 9-B)"
                className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setShowAddClass(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                İptal
              </button>
            </form>
          </div>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz sınıf yok</h3>
            <p className="text-gray-500">İlk sınıfınızı ekleyerek başlayın</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Link
                key={cls.id}
                to={`/class/${cls.id}`}
                onClick={() => onClassSelect(cls)}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">Sınıf</p>
                  </div>
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 