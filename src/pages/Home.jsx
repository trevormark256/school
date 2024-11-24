import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const Home = () => {
    return (
        <div>
            <header style={styles.header}>
                <h1>Welcome to the School Management System</h1>
                <p>Manage students and subjects with ease.</p>
            </header>

            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/students">View All Students</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/assign-subjects">Assign Subjects</Link>
                    </li>
                </ul>
            </nav>

            <section style={styles.section}>
                <h2>About the System</h2>
                <p>This system allows you to manage students and assign subjects to them effortlessly.</p>
            </section>
        </div>
    );
};

// Inline styles for simplicity, you can replace this with CSS classes if you prefer
const styles = {
    header: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd'
    },
    nav: {
        margin: '20px 0',
        textAlign: 'center'
    },
    navList: {
        listStyleType: 'none',
        padding: 0
    },
    navItem: {
        display: 'inline',
        margin: '0 15px'
    },
    section: {
        padding: '20px',
        textAlign: 'center'
    }
};

export default Home;
