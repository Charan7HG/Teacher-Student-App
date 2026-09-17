import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditStudent.css';

function EditStudent() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        studentName: '',
        studentEmail: '',
        phone: '',
        gender: '',
        course: '',
        section: '',
        skills: [],
        dob: '',
        city: '',
        address: ''
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sections = ['A', 'B', 'C', 'D'];

    const cities = [
        'Bangalore',
        'Mumbai',
        'Delhi',
        'Chennai',
        'Hyderabad',
        'Pune',
        'Mysore',
        'Mandya'
    ];

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {

        try {

            const response = await fetch(
                `http://localhost:8081/api/students/${id}`
            );

            if (!response.ok) {
                throw new Error('Student not found');
            }

            const data = await response.json();

            setFormData(data);

        } catch (error) {

            console.error(error);
            setError('Unable to load student');

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenderChange = (event) => {

        setFormData({
            ...formData,
            gender: event.target.value
        });
    };

    const handleSkillChange = (event) => {

        const { value, checked } = event.target;

        if (checked) {

            setFormData({
                ...formData,
                skills: [...formData.skills, value]
            });

        } else {

            setFormData({
                ...formData,
                skills: formData.skills.filter(
                    (skill) => skill !== value
                )
            });
        }
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage('');
        setError('');

        try {

            const response = await fetch(
                `http://localhost:8081/api/students/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {

                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }

            const updatedStudent = await response.json();

            console.log('Updated student:', updatedStudent);

            setMessage('Student updated successfully!');

        } catch (error) {

            console.error(error);

            setError(
                'Failed to update student: ' + error.message
            );
        }
    };

    if (loading) {
        return (
            <div className="edit-page">
                <div className="edit-card">
                    <p>Loading student...</p>
                </div>
            </div>
        );
    }

    if (error && !formData.studentName) {
        return (
            <div className="edit-page">
                <div className="edit-card">

                    <p className="error-message">
                        {error}
                    </p>

                    <button
                        className="back-button"
                        onClick={() => navigate('/students')}
                    >
                        Back to Students
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="edit-page">

            <div className="edit-card">

                <div className="edit-header">

                    <h1>Edit Student</h1>

                    <p>
                        Update student information
                    </p>

                </div>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="studentName">
                            Student Name
                        </label>

                        <input
                            id="studentName"
                            name="studentName"
                            type="text"
                            value={formData.studentName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="studentEmail">
                            Email
                        </label>

                        <input
                            id="studentEmail"
                            name="studentEmail"
                            type="email"
                            value={formData.studentEmail}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">

                        <label>Gender</label>

                        <div className="radio-group">

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleGenderChange}
                                />

                                <span>Male</span>

                            </label>

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleGenderChange}
                                />

                                <span>Female</span>

                            </label>

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={handleGenderChange}
                                />

                                <span>Other</span>

                            </label>

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="course">
                            Course
                        </label>

                        <select
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select course
                            </option>

                            <option value="cse">
                                Computer Science
                            </option>

                            <option value="ise">
                                Information Science
                            </option>

                            <option value="ece">
                                Electronics
                            </option>

                            <option value="me">
                                Mechanical
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="section">
                            Section
                        </label>

                        <select
                            id="section"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select section
                            </option>

                            {sections.map((section) => (
                                <option
                                    key={section}
                                    value={section}
                                >
                                    Section {section}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Skills</label>

                        <div className="checkbox-group">

                            {['java', 'sql', 'react', 'docker'].map(
                                (skill) => (

                                    <label
                                        key={skill}
                                        className="checkbox-option"
                                    >

                                        <input
                                            type="checkbox"
                                            value={skill}
                                            checked={formData.skills.includes(skill)}
                                            onChange={handleSkillChange}
                                        />

                                        <span>
                                            {skill.toUpperCase()}
                                        </span>

                                    </label>

                                )
                            )}

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="dob">
                            Date of Birth
                        </label>

                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="city">
                            City
                        </label>

                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select city
                            </option>

                            {cities.map((city) => (
                                <option
                                    key={city}
                                    value={city}
                                >
                                    {city}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            rows="4"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="edit-actions">

                        <button
                            type="submit"
                            className="update-button"
                        >
                            Update Student
                        </button>

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/students')}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditStudent;