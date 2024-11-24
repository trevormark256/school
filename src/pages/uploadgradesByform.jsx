import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UploadGradesByForm = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [selectedEvent, setSelectedEvent] = useState('EOT');
    const [errorMessage, setErrorMessage] = useState(''); // To store error messages

    // Fetch all subjects when the component mounts
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsRes = await axios.get('http://localhost:5000/school/subjects');
                setSubjects(subjectsRes.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    // Fetch students and automatically select their class when a subject is selected
    useEffect(() => {
        const fetchStudentsBySubject = async () => {
            if (selectedSubject) {
                try {
                    const studentsRes = await axios.get(`http://localhost:5000/school/studentsbysubject/${selectedSubject}`);
                    setStudents(studentsRes.data);
    
                    // Log the fetched students to see who offers the selected subject
                    console.log('Students offering the selected subject:', studentsRes.data);
    
                    // Automatically set class based on the first student
                    if (studentsRes.data.length > 0 && studentsRes.data[0].class_id) {
                        setSelectedClass(studentsRes.data[0].class_id); // Set class_id if available
                    } else {
                        setSelectedClass('defaultClassId'); // Fallback default class_id (replace with an actual value)
                    }
    
                    const initialFormData = studentsRes.data.map(student => ({
                        student_id: student.id,
                        score: '',
                        grade: '',
                    }));
                    setFormData(initialFormData);
                } catch (error) {
                    console.error('Error fetching students for the selected subject:', error);
                }
            }
        };
    
        fetchStudentsBySubject();
    }, [selectedSubject]);
    
    const handleScoreChange = (index, e) => {
        const { value } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index].score = value;
        updatedFormData[index].grade = calculateGrade(value);
        setFormData(updatedFormData);
    };

    const calculateGrade = (score) => {
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        if (score >= 40) return 'E';
        return 'F';
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    try {
        const submissionData = formData.map((data, index) => {
            const student = students[index]; // Get the current student object

            // Log the current student object
            console.log('Current Student Object:', student);
            

            return {
                ...data,
                class_id: student.class_id || 'defaultClassId', // Set class_id based on each student's class
                subject_id: selectedSubject,
                term: selectedTerm,
                year: new Date().getFullYear(),
                event: selectedEvent,
            };
        });

        // Log the submission data before sending it
        console.log('Form Data before submission:', submissionData);

        const response = await axios.post('http://localhost:5000/school/addgrades', submissionData);

        alert('Grades submitted successfully!');
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error) {
            // Backend returned a 400 error with a custom message
            setErrorMessage(error.response.data.error);
        } else {
            // Generic error message
            setErrorMessage('There was an error submitting the grades.');
        }
        console.error('Error submitting grades:', error);
    }
};

    

    return (
        <div className="container mt-5">
            <h2>Upload Grades</h2>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Select Subject */}
                <div className="form-group">
                    <label>Subject:</label>
                    <select
                        className="form-control"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                        ))}
                    </select>
                </div>

                {/* Automatically Selected Class */}
                <div className="form-group">
                    <label>Class (Auto-Selected):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={selectedClass || 'Class will be selected automatically'}
                        readOnly
                    />
                </div>

                {/* Select Term */}
                <div className="form-group">
                    <label>Term:</label>
                    <select
                        className="form-control"
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        required
                    >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                    </select>
                </div>

                {/* Select Event */}
                <div className="form-group">
                    <label>Event:</label>
                    <select
                        className="form-control"
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        required
                    >
                        <option value="BOT">BOT</option>
                        <option value="MOT">MOT</option>
                        <option value="EOT">EOT</option>
                    </select>
                </div>

                {/* Bootstrap Table */}
                <table className="table table-striped table-bordered mt-4">
                    <thead className="thead-light">
                        <tr>
                            <th>Student Name</th>
                            <th>Score</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{student.first_name ? `${student.first_name} ${student.last_name}` : 'No Name Available'}</td>
                                <td>
                                    <input
                                        type="number"
                                        name="score"
                                        className="form-control"
                                        value={formData[index].score}
                                        onChange={(e) => handleScoreChange(index, e)}
                                        min="0" // Minimum value
                                        max="100" // Maximum value
                                        required
                                    />
                                </td>
                                <td>{formData[index].grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit" className="btn btn-primary">Submit All Grades</button>
            </form>
        </div>
    );
};

export default UploadGradesByForm;
