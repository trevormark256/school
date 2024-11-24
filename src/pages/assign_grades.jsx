import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentScores = () => {
  const [level, setLevel] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [term, setTerm] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [event, setEvent] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/school/classes')
      .then(response => setClasses(response.data))
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  useEffect(() => {
    if (classId && level) {
      axios.get(`http://localhost:5000/school/levelsubjects/${level}`)
        .then(response => setSubjects(response.data.data))
        .catch(error => console.error('Error fetching subjects:', error));
    }
  }, [classId, level]);

  useEffect(() => {
    if (classId && selectedSubject) {
      axios.get(`http://localhost:5000/school/students/class/${classId}/subject/${selectedSubject}`)
        .then(response => {
          setStudents(response.data.students || response.data);
          setErrorMessage('');
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage('An error occurred while fetching students.');
          }
          setStudents([]);
        });
    }
  }, [classId, selectedSubject]);

  const handleScoreChange = (e, studentId) => {
    const score = e.target.value;
    const grade = calculateGrade(score);
    setStudents(prev => prev.map(student =>
      student.id === studentId ? { ...student, score, grade } : student
    ));
  };

  const calculateGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  };

  const handleSubmit = () => {
    if (!term || !event) {
      setShowWarning(true);
      return;
    }

    const requestData = {
      grades: students.map(student => ({
        student_id: student.id, // Use student_id
        subject_id: selectedSubject, // Use subject_id
        class_id: classId,
        score: student.score,
        grade: student.grade,
        term: term,
        year: year,
        event: event
      }))
    };

    console.log("Submitting grades:", requestData); // Log request data

    axios.post('http://localhost:5000/school/add-grades', requestData)
      .then(response => {
        console.log("Data submitted:", response);
        // You may want to clear the form or provide user feedback here
      })
      .catch(error => {
        if (error.response) {
            console.error("Response error:", error.response.data);
            // Set error message from the response
            setErrorMessage(error.response.data.error || error.response.data.message);
        } else {
            setErrorMessage("An error occurred while submitting grades.");
        }
    });

setShowWarning(false);
};

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Student Scores</h3>

      <div className="row mb-3">
        {/* Class, Subject, Term, and Year Selectors */}
        <div className="col-md-3">
          <label>Class</label>
          <select className="form-select" onChange={e => {
            const selectedClass = classes.find(c => c.id === parseInt(e.target.value));
            setClassId(selectedClass.id);
            setLevel(selectedClass.level);
            setSelectedSubject('');
            setStudents([]);
            setErrorMessage('');
          }}>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.grade} - {c.stream}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Subject</label>
          <select className="form-select" onChange={e => {
            setSelectedSubject(e.target.value);
            setStudents([]);
            setErrorMessage('');
          }}>
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label>Term</label>
          <select className="form-select" value={term} onChange={e => setTerm(e.target.value)}>
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div className="col-md-3">
          <label>Year</label>
          <input type="number" className="form-control" value={year} onChange={e => setYear(e.target.value)} />
        </div>

        {/* Event Selector */}
        <div className="col-md-3 mt-3">
          <label>Event</label>
          <select className="form-select" value={event} onChange={e => setEvent(e.target.value)}>
            <option value="">Select Event</option>
            <option value="BOT">Beginning of Term</option>
            <option value="MOT">Middle of Term</option>
            <option value="EOT">End of Term</option>
          </select>
        </div>
      </div>

      {/* Warning and Error Messages */}
      {showWarning && (
        <div className="alert alert-warning" role="alert">
          Please select a term and event before submitting the scores.
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Student Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Score</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.first_name} {student.last_name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={student.score || ''}
                    onChange={(e) => handleScoreChange(e, student.id)}
                  />
                </td>
                <td>{student.grade || ''}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No students found for the selected class and subject.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit Scores</button>
    </div>
  );
};

export default StudentScores;
