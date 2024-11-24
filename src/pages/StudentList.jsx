import React, { useState, useEffect } from 'react';

const StudentsList = () => {
    // State to hold students data
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState(''); // State for filter input
    const [filteredStudents, setFilteredStudents] = useState([]); // State for filtered students

    // Fetch students from the API when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/school/allstudents')
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Log the data to check its structure
                setStudents(data.students); // Set the student data to the state
                setFilteredStudents(data.students); // Initialize the filtered students with all students
            })
            .catch((err) => console.error("Error fetching students:", err));
    }, []);

    // Function to handle the filter input change
    const handleFilterChange = (e) => {
        const value = e.target.value.toLowerCase();
        setFilter(value);

        // Filter students by name (first or last name) or student number
        const filtered = students.filter((student) =>
            student.first_name.toLowerCase().includes(value) ||
            student.last_name.toLowerCase().includes(value) ||
            student.student_number.toString().includes(value)
        );

        setFilteredStudents(filtered);
    };

    // Function to calculate age from date of birth
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Function to format date to 'YYYY-MM-DD'
    const formatDate = (dob) => {
        const date = new Date(dob);
        return date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Students List</h2>

            {/* Filter input */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name or student number"
                value={filter}
                onChange={handleFilterChange}
            />

            {/* Check if there are students */}
            {filteredStudents.length > 0 ? (
                <table className="table table-bordered border-primary">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Student Number</th>
                            <th>Grade</th>
                            <th>Stream</th>
                            <th>Date of Birth</th>
                            <th>Age</th>
                            <th>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.first_name}</td>
                                <td>{student.last_name}</td>
                                <td>{student.student_number}</td>
                                <td>{student.class_grade || 'N/A'}</td>
                                <td>{student.class_stream || 'N/A'}</td>
                                <td>{formatDate(student.dob)}</td>
                                <td>{calculateAge(student.dob)}</td>
                                <td>{student.address}</td>
                                <td>{student.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No students found</p>
            )}
        </div>
    );
};

export default StudentsList;
