import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromoteStudent = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [promotionStatus, setPromotionStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch students from the API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/school/allstudents'); // Adjust the endpoint as needed
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/school/promote', {
                studentId: selectedStudent,
                status: promotionStatus
            });

            setSuccessMessage(response.data.message);
        } catch (error) {
            setErrorMessage(error.response.data.error);
            console.error('Error promoting student:', error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Promote Student</h2>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Student:</label>
                    <select
                        className="form-control"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        <option value="">Select a student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.first_name} {student.last_name} - {student.student_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label>Promotion Status:</label>
                    <select
                        className="form-control"
                        value={promotionStatus}
                        onChange={(e) => setPromotionStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="Promoted">Promoted</option>
                        <option value="Not Promoted">Not Promoted</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </div>
    );
};

export default PromoteStudent;
