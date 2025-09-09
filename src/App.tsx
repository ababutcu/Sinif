import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import Navbar from './components/Navbar';
import { EducationYear, Class, Student } from './types';
import Announcements from './components/Announcements';
import GuidancePlans from './components/GuidancePlans';
import StudentTransfer from './components/StudentTransfer';
import AIReports from './components/AIReports';

function App() {
  const [educationYears, setEducationYears] = useState<EducationYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<EducationYear | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    fetchEducationYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchClasses(selectedYear.id);
    }
  }, [selectedYear]);

  const fetchEducationYears = async () => {
    try {
      const response = await fetch('/api/education-years');
      const data = await response.json();
      setEducationYears(data);
      if (data.length > 0) {
        setSelectedYear(data[0]);
      }
    } catch (error) {
      console.error('Eğitim yılları yüklenirken hata:', error);
    }
  };

  const fetchClasses = async (yearId: number) => {
    try {
      const response = await fetch(`/api/classes/${yearId}`);
      const data = await response.json();
      setClasses(data);
      setSelectedClass(null);
    } catch (error) {
      console.error('Sınıflar yüklenirken hata:', error);
    }
  };

  const addEducationYear = async (year: string) => {
    try {
      const response = await fetch('/api/education-years', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year }),
      });
      const newYear = await response.json();
      setEducationYears([newYear, ...educationYears]);
      setSelectedYear(newYear);
    } catch (error) {
      console.error('Eğitim yılı eklenirken hata:', error);
    }
  };

  const addClass = async (name: string) => {
    if (!selectedYear) return;
    
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, education_year_id: selectedYear.id }),
      });
      const newClass = await response.json();
      setClasses([...classes, newClass]);
    } catch (error) {
      console.error('Sınıf eklenirken hata:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          educationYears={educationYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onAddYear={addEducationYear}
          selectedClass={selectedClass}
        />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  selectedYear={selectedYear}
                  classes={classes}
                  selectedClass={selectedClass}
                  onClassSelect={setSelectedClass}
                  onAddClass={addClass}
                />
              } 
            />
            <Route 
              path="/class/:classId" 
              element={
                selectedClass ? (
                  <StudentList 
                    selectedClass={selectedClass}
                    selectedYear={selectedYear}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route 
              path="/student/:studentId" 
              element={<StudentDetail />} 
            />
            <Route 
              path="/add-student" 
              element={
                selectedClass && selectedYear ? (
                  <AddStudent 
                    selectedClass={selectedClass}
                    selectedYear={selectedYear}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/edit-student/:studentId" 
              element={<EditStudent />} 
            />
            <Route 
              path="/announcements/:classId" 
              element={<Announcements selectedYear={selectedYear} />} 
            />
            <Route 
              path="/guidance-plans/:classId" 
              element={<GuidancePlans selectedYear={selectedYear} />} 
            />
            <Route 
              path="/student-transfer/:classId" 
              element={<StudentTransfer selectedYear={selectedYear} />} 
            />
            <Route 
              path="/ai-reports/:classId" 
              element={<AIReports selectedYear={selectedYear} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
 