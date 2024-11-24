import React, { useEffect, useState } from 'react';
import reportImage from '../assets/SCHOOL.jpeg'
import { Row,Col } from 'react-bootstrap';
import './report.css';

const ReportPage = () => {
    const [students, setStudents] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch student data (replace with your actual data fetching logic)
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Replace this URL with your actual data source
                const response = await fetch('http://localhost:5000/school/student-history');
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                setErrorMessage('Error fetching student data.');
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="report-container">
            {/* Add the image to the report */}
            <Row className="container align-items-center d-flex" style={{ height: '100px' }}>
      {/* Image column */}
      <Col xs={1} className="d-flex justify-content-center align-items-center">
        <img className='' src={reportImage} alt="Report Illustration" style={{ width: '100px', height: '100%' }} />
      </Col>

      {/* Text column */}
      <Col xs={10} className="d-flex justify-content-end align-items-center m-4">
        <b className="si container mx-4">NATEETE HIGH SCHOOL</b>
      </Col>
    </Row>
            <h3 className='m-4  d-flex justify-content-center align-items-center text-center' >Student Report</h3>
            {errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <p>Date: {new Date().toLocaleDateString()}</p>

            {/* Report Table */}
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Class</th>
                        <th>Status</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.student_number}</td>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>{student.class_name}</td>
                                <td>{student.status}</td>
                                <td>{student.year}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Print Button */}
            <button className="print-button" onClick={() => window.print()}>Print Report</button>
        </div>
    );
};

export default ReportPage;
