import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define combinations based on the student’s class stream
const A_LEVEL_COMBINATIONS = {
  Arts: {
    HEL: [
      'History_1', 'History_2', 
      'Entreprenuership_1', 'Entreprenuership_2', 
      'Literature_1', 'Literature_2', 
      'General_Paper', 'IT'
    ],  },
  NonArts: {
    BCM: [
      'Math_1', 'Math_2', 
      'Biology_1', 'Biology_2', 
      'Chemistry_1', 'Chemistry_2', 'Chemistry_3', 
      'IT', 'General_Paper'
    ],    PEM: [
      'Physics_1', 'Physics_2', 'Physics_3',
      'Economics_1', 'Economics_2',
      'Math_1', 'Math_2',
      'General_Paper', 'IT'
    ],  },
};

const AssignDetails = () => {
  const location = useLocation();
  const { student } = location.state || {};

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [studentStream, setStudentStream] = useState(null);
  const [loadingAssigned, setLoadingAssigned] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  useEffect(() => {
    if (student && student.id) {
      console.log(student);

      // Fetch assigned subjects
      const fetchAssignedSubjects = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/school/subjectsbystudent/${student.id}`);
          setAssignedSubjects(response.data.data || []);
        } catch (err) {
          setError('Failed to load assigned subjects');
        } finally {
          setLoadingAssigned(false);
        }
      };

      // Fetch student class info including stream
      const fetchStudentClassInfo = async () => {
        try {
          console.log(student.student_number)
          const response = await axios.get(`http://localhost:5000/school/student/${student.student_number}`);
          const studentData = response.data;
        console.log("students data is ",studentData)
          setStudentStream(studentData.stream); // Store student stream for later use
      console.log(studentStream);
        } catch (err) {
          setError('Failed to load student class info');
        }
      };

      // Fetch available subjects based on student's level
      const fetchAvailableSubjects = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/school/levelsubjects/${student.level}`);
          setAvailableSubjects(response.data.data || []);
        } catch (err) {
          setError('Failed to load available subjects');
        } finally {
          setLoadingAvailable(false);
        }
      };

      fetchAssignedSubjects();
      fetchStudentClassInfo();
      fetchAvailableSubjects();
    }
  }, [student]);

  // Assign selected subjects to student
  const assignSubjects = async (subjectIds) => {
    if (subjectIds.length === 0) {
      alert('No subjects selected to assign.');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/school/students/${student.id}/subjects`, {
        student_id: student.id,
        subject_ids: subjectIds,
      });
      alert('Subjects assigned successfully');
      setSelectedSubjectIds([]); // Clear selected subjects after assignment
      window.location.reload(); // Refresh the page to see updated subjects

    } catch (error) {
      setError('Error assigning subjects');
    }
  };

  // Handle combination selection for A-level students
  const handleCombinationSelection = (combination) => {
    if (assignedSubjects.length >= 2) {
      alert('This student already assigned a combination.');
      return;
    }

    const subjectIds = availableSubjects
      .filter(subject => combination.some(prefix => subject.subject_name.startsWith(prefix)))
      .map(subject => subject.id);

    assignSubjects(subjectIds); // Assign subjects via API
  };

  // Determine which combinations to show based on student’s stream
  const combinationsToDisplay = studentStream === 'Arts' 
    ? A_LEVEL_COMBINATIONS.Arts 
    : A_LEVEL_COMBINATIONS.NonArts;

  if (loadingAssigned || loadingAvailable) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Subjects for {student.first_name} {student.last_name} (ID: {student.id})</h1>
      {error && <div className="text-danger">{error}</div>}

      <h2>Assigned Subjects</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Subject ID</th>
            <th>Subject Name</th>
          </tr>
        </thead>
        <tbody>
          {assignedSubjects.length > 0 ? assignedSubjects.map(subject => (
            <tr key={subject.subject_id}>
              <td>{subject.subject_id}</td>
              <td>{subject.subject_name}</td>
            </tr>
          )) : (
            <tr><td colSpan="2">No subjects assigned.</td></tr>
          )}
        </tbody>
      </table>

      <h2>Available Subjects for {student.level}</h2>
      {student.level === 'A-level' && (
        <>
          <h2>A-Level Combinations</h2>
          <div>
            {Object.keys(combinationsToDisplay).map(combination => (
              <button 
                key={combination} 
                className="btn btn-primary m-2" 
                onClick={() => handleCombinationSelection(combinationsToDisplay[combination])}
              >
                Assign {combination} Subjects
              </button>
            ))}
          </div>
        </>
      )}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Subject ID</th>
            <th>Subject Name</th>
          </tr>
        </thead>
        <tbody>
          {availableSubjects.length > 0 ? availableSubjects.map(subject => (
            <tr key={subject.id}>
              <td>{subject.id}</td>
              <td>{subject.subject_name}</td>
            </tr>
          )) : (
            <tr><td colSpan="2">No available subjects.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignDetails;
