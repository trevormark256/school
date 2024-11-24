import React, { useState, useEffect } from 'react';

const TermlyPerformance = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedTerm, setSelectedTerm] = useState('');
    const [termlyScores, setTermlyScores] = useState(null);
    const [studentNumber, setStudentNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOLevel, setIsOLevel] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/school/allstudents')
            .then((res) => res.json())
            .then((data) => {
                if (data.students && Array.isArray(data.students)) {
                    setStudents(data.students);
                    console.log('Fetched students:', data.students);
                } else {
                    console.error('Expected an array but received:', data);
                }
            })
            .catch((error) => console.error('Error fetching students:', error));
    }, []);

    useEffect(() => {
        if (selectedStudent && selectedYear && selectedTerm) {
            const apiUrl = `http://localhost:5000/school/grades/${selectedStudent.id}/${selectedTerm}?year=${selectedYear}`;
            fetch(apiUrl)
                .then((res) => res.ok ? res.json() : Promise.reject(res.statusText))
                .then((data) => {
                    setTermlyScores(data);
                    console.log('Fetched termly scores:', data);
                    setIsOLevel(selectedStudent.level === 'O-Level');
                })
                .catch((error) => console.error('Error fetching termly scores:', error));
        }
    }, [selectedStudent, selectedYear, selectedTerm]);

    const handleSearchTermChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        const filtered = students.filter(student =>
            `${student.first_name} ${student.last_name}  `.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setSearchTerm(`${student.first_name} ${student.last_name}  ${student.student_number} `);
        setFilteredStudents([]);
    };

    const calculateGroupPoints = (subject1, subject2) => {
        const score1 = subject1 ? parseFloat(subject1.score) : 0;
        const score2 = subject2 ? parseFloat(subject2.score) : 0;

        if (score1 >= 80 && score2 >= 80) return 6;
        if ((score1 >= 40 && score2 < 40) || (score1 < 40 && score2 >= 40)) return 1;
        return 0;
    };

    const getSubjectPoints = (subject) => {
        if (subject.subject_name === 'General Paper' && subject.score >= 50) return 1;
        return 0;
    };

    const renderGroupedSubjects = () => {
        const groupedSubjects = [
            { name: 'Math', subjects: termlyScores.subjects.filter(s => s.subject_name.startsWith('Math')) },
            { name: 'Chemistry', subjects: termlyScores.subjects.filter(s => s.subject_name.startsWith('Chemistry')) },
            { name: 'Biology', subjects: termlyScores.subjects.filter(s => s.subject_name.startsWith('Biology')) },
            { name: 'IT', subjects: termlyScores.subjects.filter(s => s.subject_name === 'IT') }
        ];

        return groupedSubjects.map((group, index) => (
            <tr key={index}>
                <td>{group.name}</td>
                <td>{group.subjects[0]?.score || '-'}</td>
                <td>{group.subjects[1]?.score || '-'}</td>
                <td>{calculateGroupPoints(group.subjects[0], group.subjects[1])} points</td>
            </tr>
        ));
    };

    return (
        <div className="container mt-4 mb-4">
            <h2>Termly Performance</h2>
            <div className="form-group mt-3">
                <label>Search Student by Name:</label>
                <input
                    type="text"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Type to search by name"
                />
                {searchTerm && filteredStudents.length > 0 && (
                    <ul className="list-group position-absolute mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredStudents.map((student) => (
                            <li
                                key={student.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSelectStudent(student)}
                            >
                                {student.first_name} {student.last_name} {student.student_number}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="form-group mt-3">
                <label>Select Year:</label>
                <input
                    type="number"
                    className="form-control"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    placeholder="Enter year"
                />
            </div>

            <div className="form-group mt-3">
                <label>Select Term:</label>
                <select className="form-control" onChange={(e) => setSelectedTerm(e.target.value)}>
                    <option value="">Select a term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                </select>
            </div>

            {selectedStudent && selectedTerm && termlyScores && (
                <div className="mt-4">
                    <h3>{`${selectedStudent.first_name} ${selectedStudent.last_name} - Termly Performance (${selectedYear}, ${selectedTerm})`}</h3>
                    {isOLevel ? (
                        <table className="table table-striped">
                            {/* Render O-Level table */}
                        </table>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Subject Group</th>
                                    <th>Score 1</th>
                                    <th>Score 2</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderGroupedSubjects()}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default TermlyPerformance;
