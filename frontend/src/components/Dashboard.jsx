import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {

        try {

            const response = await fetch(`${API_URL}/api/students`);

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error('Failed to load students:', error);

        } finally {

            setLoading(false);

        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">

                <div>
                    <h1>Teacher-Student Management</h1>
                    <p>Teacher Portal</p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>

            <main className="dashboard-content">

                <section className="welcome-section">
                    <h2>Teacher Dashboard</h2>
                    <p>
                        Manage students and their academic information.
                    </p>
                </section>

                <section className="dashboard-cards">

                    <div className="dashboard-card">
                        <h3>Total Students</h3>
                        <p className="count">
                            {loading ? '...' : students.length}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Active Students</h3>
                        <p className="count">
                            {loading ? '...' : students.length}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Courses</h3>
                        <p className="count">
                            {loading
                                ? '...'
                                : new Set(students.map(student => student.course)).size
                            }
                        </p>
                    </div>

                </section>

                <section className="student-management">

                    <h2>Student Management</h2>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate('/register-student')}
                    >
                        Register Student
                    </button>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate('/students')}
                    >
                        View Students
                    </button>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;