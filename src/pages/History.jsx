import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentHistory = () => {
    const [students, setStudents] = useState([]);
    const [year, setYear] = useState('');
    const [classId, setClassId] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [classes, setClasses] = useState([]); // Store available classes
    const [errorMessage, setErrorMessage] = useState('');

    // Define years from 2020 to 2024
    const years = [2020, 2021, 2022, 2023, 2024];

    // Fetch available classes (if needed)
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classesRes = await axios.get('http://localhost:5000/school/classes');
                setClasses(classesRes.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    // Fetch all student history on component mount
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/school/student-history'); // Fetch all students initially
                setStudents(response.data);
            } catch (error) {
                setErrorMessage('Error fetching students.');
                console.error('Error fetching student history:', error);
            }
        };

        fetchAllStudents();
    }, []);

    // Handle form submission with filters
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const queryParams = new URLSearchParams();

            // Add filters only if they are provided
            if (year) queryParams.append('year', year);
            if (classId) queryParams.append('class_id', classId);
            if (studentNumber) queryParams.append('student_number', studentNumber);

            const response = await axios.get(`http://localhost:5000/school/student-history?${queryParams.toString()}`);
            setStudents(response.data);

            // Log the response for debugging
            console.log('Fetched students:', response.data);

        } catch (error) {
            setErrorMessage('Error fetching students.');
            console.error('Error fetching student history:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Student History</h2>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Year:</label>
                    <select
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Class:</label>
                    <select
                        className="form-control"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.grade} {cls.stream}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Student Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        placeholder="Enter student number"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Display results */}
            <table className="table table-striped table-bordered mt-4">
                <thead className="thead-light">
                    <tr>
                        <th>Student Name</th>
                        <th>Student Number</th>
                        <th>Class</th>
                        <th>status</th>
                        <th>Year</th>

                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <tr key={student.id}>
                                <td>{student.first_name} {student.last_name}</td>
                                <td>{student.student_number}</td>
                                <td>{student.class_name}</td>
                                <td>{student.promotion_status
                                }</td>
                                <td>{student.year}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentHistory;
