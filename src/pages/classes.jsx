import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);

  // Fetch all classes from the API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/school/classes');
      setClasses(response.data);
      console.log("Classes fetched:", response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Classes</h2>
      <table className="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Class ID</th>
      <th>Grade</th>
      <th>Stream</th>
      <th>Capacity</th>
      <th>Class Teacher</th>
      <th>Number of Students</th> {/* New column for student count */}
    </tr>
  </thead>
  <tbody>
    {classes.length > 0 ? (
      classes.map((classItem, index) => (
        <tr key={index}>
          <td>{classItem.id}</td>
          <td>{classItem.grade}</td>
          <td>{classItem.stream}</td>
          <td>{classItem.capacity}</td>
          <td>{classItem.class_teacher || 'No Teacher Assigned'}</td>
          <td>{classItem.student_count}</td> {/* Display student count */}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center">No classes found</td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Classes;
