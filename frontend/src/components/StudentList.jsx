import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentList.css';

function StudentList() {
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const API_URL = import.meta.env.VITE_API_URL;

    const studentsPerPage = 5;

    const navigate = useNavigate();
  
const handleDelete = async (id) => {

    const confirmed = window.confirm(
        'Are you sure you want to delete this student?'
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/students/${id}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        setStudents((currentStudents) =>
            currentStudents.filter((student) => student.id !== id)
        );

    } catch (error) {

        console.error(error);
        alert('Unable to delete student');

    }
};
    const fetchStudents = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/students`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error(error);
            setError('Unable to load students');

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) =>
        student.studentName.toLowerCase().includes(search.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(search.toLowerCase())
    );

    const sortedStudents = [...filteredStudents].sort((firstStudent, secondStudent) => {
        const comparison = firstStudent.studentName.localeCompare(
            secondStudent.studentName,
            undefined,
            { sensitivity: 'base' }
        );

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
    const visiblePage = totalPages > 0
        ? Math.min(currentPage, totalPages)
        : 1;
    const pageStart = (visiblePage - 1) * studentsPerPage;
    const paginatedStudents = sortedStudents.slice(
        pageStart,
        pageStart + studentsPerPage
    );

    const toggleNameSort = () => {
        setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1);
    };

    return (
        <div className="students-page">

            <div className="students-container">

                <div className="students-header">

    <div>
        <h1>Students</h1>
        <p>View all registered students</p>
    </div>

    <div className="student-actions">

        <input
            type="text"
            className="search-input"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
            }}
        />

        <button
            className="back-button"
            onClick={() => navigate('/dashboard')}
        >
            Back to Dashboard
        </button>

    </div>

</div>

                {loading && (
                    <p className="loading-message">
                        Loading students...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && sortedStudents.length > 0 && (

    <div className="table-wrapper">

        <table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>
                        <button
                            type="button"
                            className="sort-button"
                            aria-label={`Sort by student name ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                            onClick={toggleNameSort}
                        >
                            Name {sortDirection === 'asc' ? '↑' : '↓'}
                        </button>
                    </th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Course</th>
                    <th>Section</th>
                    <th>Skills</th>
                    <th>DOB</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {paginatedStudents.map((student) => (

                    <tr key={student.id}>

                        <td>{student.id}</td>
                        <td>{student.studentName}</td>
                        <td>{student.studentEmail}</td>
                        <td>{student.phone}</td>
                        <td>{student.gender}</td>
                        <td>{student.course}</td>
                        <td>{student.section}</td>

                        <td>
                            {student.skills.join(', ')}
                        </td>

                        <td>{student.dob}</td>
                        <td>{student.city}</td>
                        <td>{student.address}</td>
                        <td>
    <button
        className="edit-button"
        onClick={() => navigate(`/edit-student/${student.id}`)}
    >
        Edit
    </button>

    <button
        className="delete-button"
        onClick={() => handleDelete(student.id)}
    >
        Delete
    </button>
</td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

)}

{!loading && !error && sortedStudents.length > 0 && (
    <div className="pagination-controls" aria-label="Student list pagination">
        <button
            type="button"
            className="pagination-button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={visiblePage === 1}
            aria-label="Previous page"
        >
            Previous
        </button>

        <span aria-live="polite">
            Page {visiblePage} of {totalPages}
        </span>

        <button
            type="button"
            className="pagination-button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={visiblePage === totalPages}
            aria-label="Next page"
        >
            Next
        </button>
    </div>
)}

{!loading && !error &&
    students.length > 0 &&
    filteredStudents.length === 0 && (
        <p className="empty-message">
            No students found matching "{search}".
        </p>
)}

            </div>

        </div>
    );
}

export default StudentList;