import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AssignSubjects = () => {
  const [classes, setClasses] = useState([]); // Store list of classes
  const [selectedClassId, setSelectedClassId] = useState(null); // Store selected class ID
  const [students, setStudents] = useState([]); // Store students for the selected class
  const [searchTerm, setSearchTerm] = useState(''); // Store search term
  const navigate = useNavigate();

  const handleRowClick = (student) => {
    navigate('/assign-details', { state: { student } });
  };

  // Fetch all classes when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/school/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students for the selected class when the class ID changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClassId) {
        try {
          const response = await axios.get(`http://localhost:5000/school/studentsbyclass?class_id=${selectedClassId}`);
          setStudents(response.data);
        } catch (err) {
          console.error('Error fetching students:', err);
        }
      }
    };

    fetchStudents();
  }, [selectedClassId]);

  // Handle button click
  const handleClassSelection = (classId) => {
    setSelectedClassId(classId); // Set the selected class ID
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentNumber = student.student_number.toString();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      studentNumber.includes(searchTerm)
    );
  });

  return (
    <div className="container">
      <h1>Select a Class</h1>
      <div className="row">
        {classes.map((cls) => (
          <div key={cls.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <button
              className={`btn btn-block ${selectedClassId === cls.id ? 'btn-success shadow' : 'btn-outline-success'}`}
              style={{
                width: '100%', // Full width for responsiveness
                padding: '10px',
                fontSize: '1.2rem',
              }}
              onClick={() => handleClassSelection(cls.id)}
            >
              {cls.grade} {cls.stream}
            </button>
          </div>
        ))}
      </div>

      {selectedClassId && (
        <div className="mt-4">
          <div className='container d-flex text-center mx-auto'>
            <h2>Students in Selected Class</h2>
          </div>

          {/* Search Form */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or student number"
              value={searchTerm}
              onChange={handleSearchChange}
           
           />
          </div>

          <table className="table table-bordered border-primary">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Student Number</th>
                <th>Status</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                 
                 <tr key={student.id} 
                 className="table-row-hover" 
                 style={{ cursor: 'pointer' }} 
                 onClick={() => handleRowClick(student)}>
                    <td>
                      {/* Pass the entire student object in state */}
                   
                        {student.id}
                    
                    </td>
                 
                    <td>{student.first_name}</td>
                  
                    <td>{student.last_name}</td>
                    <td>{student.student_number}</td>
                    <td>{student.status}</td>
                    <td>{student.level}</td>
                  </tr>
               
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No students found in this class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignSubjects;
