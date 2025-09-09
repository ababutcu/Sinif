import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, GraduationCap, Menu, Calendar, Users, ArrowRightLeft, Brain } from 'lucide-react';
import { EducationYear, Class } from '../types';

interface NavbarProps {
  educationYears: EducationYear[];
  selectedYear: EducationYear | null;
  onYearChange: (year: EducationYear) => void;
  onAddYear: (year: string) => void;
  selectedClass: Class | null;
}

const Navbar: React.FC<NavbarProps> = ({ 
  educationYears, 
  selectedYear, 
  onYearChange, 
  onAddYear,
  selectedClass
}) => {
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYear, setNewYear] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (newYear.trim()) {
      onAddYear(newYear.trim());
      setNewYear('');
      setShowAddYear(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold">Siniff</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {selectedClass && (
              <>
                <Link to={`/announcements/${selectedClass.id}`} className="text-sm font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>İlanlar</span>
                </Link>
                <Link to={`/guidance-plans/${selectedClass.id}`} className="text-sm font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Rehberlik Planları</span>
                </Link>
                <Link to={`/student-transfer/${selectedClass.id}`} className="text-sm font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Öğrenci Transfer</span>
                </Link>
                <Link to={`/ai-reports/${selectedClass.id}`} className="text-sm font-medium text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <Brain className="h-4 w-4" />
                  <span>AI Raporlar</span>
                </Link>
              </>
            )}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Eğitim Yılı:</label>
              <select
                value={selectedYear?.id || ''}
                onChange={(e) => {
                  const year = educationYears.find(y => y.id === parseInt(e.target.value));
                  if (year) onYearChange(year);
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {educationYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAddYear(!showAddYear)}
                className="p-1 text-gray-500 hover:text-primary-600"
                title="Yeni eğitim yılı ekle"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary-600 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-3 border-t">
            <div className="flex flex-col space-y-3">
              {selectedClass && (
                <>
                  <Link 
                    to={`/announcements/${selectedClass.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>İlanlar</span>
                  </Link>
                  <Link 
                    to={`/guidance-plans/${selectedClass.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Rehberlik Planları</span>
                  </Link>
                  <Link 
                    to={`/student-transfer/${selectedClass.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Öğrenci Transfer</span>
                  </Link>
                  <Link 
                    to={`/ai-reports/${selectedClass.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  >
                    <Brain className="h-4 w-4" />
                    <span>AI Raporlar</span>
                  </Link>
                </>
              )}
              <div className="px-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Eğitim Yılı:</label>
                  <select
                    value={selectedYear?.id || ''}
                    onChange={(e) => {
                      const year = educationYears.find(y => y.id === parseInt(e.target.value));
                      if (year) onYearChange(year);
                      setIsMenuOpen(false);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                  >
                    {educationYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.year}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setShowAddYear(!showAddYear);
                    }}
                    className="p-1 text-gray-500 hover:text-primary-600"
                    title="Yeni eğitim yılı ekle"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddYear && (
          <div className="pb-4 pt-2 border-t">
             <div className="container mx-auto px-4">
              <form onSubmit={handleAddYear} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="Örn: 2025-2026"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddYear(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  İptal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 