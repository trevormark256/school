import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function BootstrapNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/students">Students List</Nav.Link>
            <Nav.Link as={Link} to="/assign-subjects">Assign Subjects</Nav.Link>
            <Nav.Link as={Link} to="/all-grades">All Grades</Nav.Link>
            <Nav.Link as={Link} to="/upload-gradebyform">Upload Grades</Nav.Link>
            <Nav.Link as={Link} to="/event-calender">Calendar</Nav.Link>
            <Nav.Link as={Link} to="/classes">Classes</Nav.Link>
            <Nav.Link as={Link} to="/all-performances">All Performances</Nav.Link>
           <Nav.Link as={Link} to="/all-calender">All Calendar</Nav.Link>
  
           <Nav.Link as={Link} to="/history">history</Nav.Link>
           <Nav.Link as={Link} to="/report">report</Nav.Link>    
           <Nav.Link as={Link} to="/new-student">new student</Nav.Link>    
           
           <Nav.Link as={Link} to="/assign-grades">assign_grades</Nav.Link>    
           </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BootstrapNavbar;
