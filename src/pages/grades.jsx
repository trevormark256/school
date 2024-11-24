import React, { useState, useEffect } from 'react';

const GradesList = () => {
    const [grades, setGrades] = useState([]);

    // Fetch all grades with related students, classes, and subjects
    useEffect(() => {
        fetch('http://localhost:5000/school/allgrades')
            .then((res) => res.json())
            .then((data) => {
                setGrades(data);
                console.log("The data is:", data);
            })
            .catch((err) => console.error("Error fetching grades:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Grades List</h2>
            {grades.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Grade ID</th>
                            <th>Student Name</th>
                            <th>Class Name</th>
                       
                            <th>Subject Name</th>
                            <th>Score</th>
                            <th>Grade</th>
                            <th>Term</th>
                            <th>Year</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
    {grades.map((grade) => (
        <tr key={`${grade.grade_id}-${grade.student_id}`}>
            <td>{grade.grade_id}</td>
            <td>{grade.student_name}</td>
            <td>{`${grade.class_name}`}</td> {/* This line may need to be adjusted to reflect the new structure */}
            
            <td>{grade.subject_name}</td>
            <td>{grade.score}</td>
            <td>{grade.grade}</td>
            <td>{grade.term}</td>
            <td>{grade.year}</td>
            <td>{grade.event}</td>
        </tr>
    ))}
</tbody>

                </table>
            ) : (
                <p>No grades found</p>
            )}
        </div>
    );
};

export default GradesList;
