import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentsList from './pages/StudentList';
import AssignSubjects from './pages/AssignSubjects';
import GradesList from './pages/grades';
import UploadGradesByform from './pages/uploadgradesByform';
import EventCalendar from './pages/Eventcalender';
import Classes from './pages/classes';
import TermlyPerformance from './pages/Termlyperformance';
import YearCalendar from './pages/Allcalender';
import BootstrapNavbar from './components/BootstrapNavbar';

import PromoteStudent from './pages/promotion';
import StudentHistory from './pages/History';
import ReportPage from './pages/report';
import NewStudentForm from './pages/add_student';
import AssignDetails from './pages/AssingDetails';
import AddStudentAndParentForm from './pages/add_student';
import StudentScores from './pages/assign_grades';

function App() {
  return (
    <Router>
      <div>
        <BootstrapNavbar /> {/* Use the Bootstrap Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/assign-subjects" element={<AssignSubjects />} />
          <Route path="/all-grades" element={<GradesList />} />
          <Route path="/upload-gradebyform" element={<UploadGradesByform />} />
          <Route path="/event-calender" element={<EventCalendar />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/all-performances" element={<TermlyPerformance />} />
          <Route path="/all-calender" element={<YearCalendar />} />
  <Route path="/add-student" element={<AddStudentAndParentForm />} />
    
          <Route path="/history" element={<StudentHistory/>} />
          <Route path="/report" element={<ReportPage/>} />
          <Route path="/new-student" element={<NewStudentForm/>} />
          <Route path="/assign-details" element={<AssignDetails/>} />
          <Route path="/assign-grades" element={<StudentScores/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
