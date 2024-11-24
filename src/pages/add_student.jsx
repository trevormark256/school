import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';

// Student Form Component
const StudentForm = ({ nextStep, handleStudentData }) => {
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    student_number: '',
    class_id: '',
    dob: '',
    address: '',
    status: '',
    level: '',
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/school/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });

    // Automatically set the level based on the class selected
    if (name === 'class_id') {
      const selectedClass = classes.find((cls) => cls.id === parseInt(value, 10));
      if (selectedClass) {
        const grade = selectedClass.grade;

        // Set the level based on the class grade
        if (grade.includes('Senior Five') || grade.includes('Senior Six')) {
          setStudentData((prevData) => ({ ...prevData, level: 'A-Level' }));
        } else {
          setStudentData((prevData) => ({ ...prevData, level: 'O-Level' }));
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleStudentData(studentData);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3>Add Student Details</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={studentData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={studentData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="student_number">Student Number</label>
          <input
            type="number"
            className="form-control"
            id="student_number"
            name="student_number"
            value={studentData.student_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="class_id">Class</label>
          <select
            className="form-select"
            id="class_id"
            name="class_id"
            value={studentData.class_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.grade} - {cls.stream}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="dob"
            name="dob"
            value={studentData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={studentData.address}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="status">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={studentData.status}
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            <option value="boarding">Boarding</option>
            <option value="day_scholar">Day Scholar</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="level">Level</label>
          <input
            type="text"
            className="form-control"
            id="level"
            name="level"
            value={studentData.level}
            readOnly
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Next</button>
    </form>
  );
};

// Parent Form Component
// Parent Form Component
const ParentForm = ({ prevStep, handleParentData, submitData }) => {
  const [parentData, setParentData] = useState({
    full_name: '',
    occupation: '',
    home_address: '',
    phone_number: '',
  });
  const [existingParents, setExistingParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null); // Store selected parent ID only
  const [isCreatingNewParent, setIsCreatingNewParent] = useState(true);

  const fetchParents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/school/parents', {
        params: { name: searchTerm },
      });
      setExistingParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  useEffect(() => {
    if (!isCreatingNewParent) {
      fetchParents();
    }
  }, [searchTerm, isCreatingNewParent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentData({ ...parentData, [name]: value });
  };

  const handleSelectParent = (parent) => {
    console.log('Selected Parent:', parent);
    
    setSelectedParentId(parent.id); // Only store parent ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentParentId;

    // Check if a new parent is being created
    if (isCreatingNewParent) {
        // Validate new parent data
        if (!parentData.full_name || !parentData.phone_number) {
            alert("Full name and phone number are required");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/school/add-parent', parentData);
            // Update parent data with the newly created parent ID
            currentParentId = response.data.id; // Save the new parent's ID
            console.log('New Parent ID:', currentParentId);
        } catch (error) {
            console.error('Error adding parent:', error);
            alert('Error adding parent. Please try again.');
            return; // Exit if there's an error
        }
    } else if (selectedParentId) {
        currentParentId = selectedParentId; // Use the selected parent ID
    } else {
        alert("Please select or create a parent before submitting.");
        return; // Exit if no parent ID is set
    }

    // Proceed to submit student data
    await submitData(currentParentId);
};



  return (
    <div>
      <h3>{isCreatingNewParent ? 'Add New Parent' : 'Select Existing Parent'}</h3>
      <div className="mb-3">
        <button 
          className={`btn ${isCreatingNewParent ? 'btn-success shadow' : 'btn-secondary'} me-2`}
          onClick={() => setIsCreatingNewParent(true)}
        >
          Create New Parent
        </button>
        <button 
          className={`btn ${!isCreatingNewParent ? 'btn-success shadow' : 'btn-secondary'}`} 
          onClick={() => setIsCreatingNewParent(false)} >
          Search Existing Parents
        </button>
      </div>
      23  

      {!isCreatingNewParent ? (
        <>
          <input
            type="text"
            placeholder="Search by name"
            className="form-control mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="list-group mb-3">
            {existingParents.map((parent) => (
              <li 
                key={parent.id} 
                className={`list-group-item list-group-item-action ${selectedParentId === parent.id ? 'bg-success text-white' : ''}`} // Highlight selected parent
                onClick={() => handleSelectParent(parent)}
              >
                {parent.full_name}
              </li>
            ))}
          </ul>

          {/* Show Submit button if a parent is selected */}
          {selectedParentId && (
            <button onClick={handleSubmit} className="btn btn-primary mb-3">Submit Selected Parent</button>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="full_name"
            className="form-control mb-2"
            value={parentData.full_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Occupation"
            name="occupation"
            className="form-control mb-2"
            value={parentData.occupation}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Home Address"
            name="home_address"
            className="form-control mb-2"
            value={parentData.home_address}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phone_number"
            className="form-control mb-3"
            value={parentData.phone_number}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary">Submit Parent</button>
        </form>
      )}
      <button onClick={prevStep} className="btn btn-secondary mt-3">Back</button>
    </div>
  );
};

// Main Component for Adding Student and Parent
const AddStudentAndParentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState({});
  const [parentData, setParentData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');  // State to manage the error message

  const steps = ['Add Student Details', 'Add Parent Details'];

  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const prevStep = () => setActiveStep((prevStep) => prevStep - 1);

  const handleStudentData = (data) => {
    setStudentData(data);
  };

  const handleParentData = (data) => {
    setParentData(data);
  };

  const submitData = async (parentId) => {
    const combinedData = {
        ...studentData,
        parent_id: parentId,  // Set the parent_id from the previous logic
    };

    console.log('Combined Data:', combinedData); // Log combined data for verification

    try {
        const response = await axios.post('http://localhost:5000/school/add-student', combinedData);
        console.log('Student ID:', response.data.student_id);
        alert('Student and parent data processed successfully!');
        // Reset form data after successful submission
        setStudentData({});
        setParentData({});
        setActiveStep(0);
        // Reload the page to clear all cached data
        window.location.reload();
    } catch (error) {
        console.error('Error:', error); // This will show the full error response
        setErrorMessage("There was an error submitting the data. Please try again.");
        if (error.response) {
            console.error('Response Data:', error.response.data); // Log response for more info
        }
    }
};
  

  return (
    <div className="container mt-3">
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Display the error alert if there's an error message */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {activeStep === 0 && <StudentForm nextStep={nextStep} handleStudentData={handleStudentData} />}
      {activeStep === 1 && (
        <>
          <ParentForm prevStep={prevStep} handleParentData={handleParentData} submitData={submitData} />
        </>
      )}
    </div>
  );
};

export default AddStudentAndParentForm;


