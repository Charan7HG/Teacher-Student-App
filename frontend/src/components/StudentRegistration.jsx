import { useState } from 'react';
import './StudentRegistration.css';

function StudentRegistration() {

    const [sectionOpen, setSectionOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('');

    const [city, setCity] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const studentName = form.studentName.value.trim();
    const studentEmail = form.studentEmail.value.trim();
    const phone = form.phone.value.trim();
    const gender = form.gender.value;
    const course = form.course.value;
    const dob = form.dob.value;
    const address = form.address.value.trim();

    const skills = Array.from(
        form.querySelectorAll('input[name="skills"]:checked')
    ).map((skill) => skill.value);

    const newErrors = {};

    if (!studentName) {
        newErrors.studentName = 'Student name is required';
    }

    if (!studentEmail) {
        newErrors.studentEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
        newErrors.studentEmail = 'Enter a valid email address';
    }

    if (!phone) {
        newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!gender) {
        newErrors.gender = 'Please select gender';
    }

    if (!course) {
        newErrors.course = 'Please select a course';
    }

    if (!selectedSection) {
        newErrors.section = 'Please select a section';
    }

    if (skills.length === 0) {
        newErrors.skills = 'Select at least one skill';
    }

    if (!dob) {
        newErrors.dob = 'Date of birth is required';
    }

    if (!city) {
        newErrors.city = 'City is required';
    }

    if (!address) {
        newErrors.address = 'Address is required';
    }

    setErrors(newErrors);

    // Stop if frontend validation fails
    if (Object.keys(newErrors).length > 0) {
        return;
    }

    // Prepare data for backend
    const studentData = {
        studentName,
        studentEmail,
        phone,
        gender,
        course,
        section: selectedSection,
        skills,
        dob,
        city,
        address
    };

    console.log('Sending student data:', studentData);

    try {
        const response = await fetch(`${API_URL}/api/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const savedStudent = await response.json();

        console.log('Student saved:', savedStudent);

        alert('Student registration successful!');

    } catch (error) {
        console.error('Registration failed:', error);
        alert('Student registration failed: ' + error.message);
    }
};
    return (
        <div className="student-page">

            <div className="student-card">

                <div className="form-header">

                    <h1>Register Student</h1>

                    <p>
                        Enter the student details below
                    </p>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* Student Name */}

                    <div className="form-group">

                        <label htmlFor="studentName">
                            Student Name
                        </label>

                        <input
                            id="studentName"
                            name="studentName"
                            type="text"
                            placeholder="Enter student name"
                        />

                        {errors.studentName && (
                            <p className="error-message">
                                {errors.studentName}
                            </p>
                        )}

                    </div>


                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="studentEmail">
                            Email
                        </label>

                        <input
                            id="studentEmail"
                            name="studentEmail"
                            type="text"
                            placeholder="Enter student email"
                        />

                        {errors.studentEmail && (
                            <p className="error-message">
                                {errors.studentEmail}
                            </p>
                        )}

                    </div>


                    {/* Phone */}

                    <div className="form-group">

                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                        />

                        {errors.phone && (
                            <p className="error-message">
                                {errors.phone}
                            </p>
                        )}

                    </div>


                    {/* Gender */}

                    <div className="form-group">

                        <label>
                            Gender
                        </label>

                        <div className="radio-group">

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                />

                                <span>Male</span>

                            </label>

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                />

                                <span>Female</span>

                            </label>

                            <label className="radio-option">

                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                />

                                <span>Other</span>

                            </label>

                        </div>

                        {errors.gender && (
                            <p className="error-message">
                                {errors.gender}
                            </p>
                        )}

                    </div>


                    {/* Course */}

                    <div className="form-group">

                        <label htmlFor="course">
                            Course
                        </label>

                        <select
                            id="course"
                            name="course"
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

                        {errors.course && (
                            <p className="error-message">
                                {errors.course}
                            </p>
                        )}

                    </div>


                    {/* Section */}

                    <div className="form-group">

                        <label>
                            Section
                        </label>

                        <div className="custom-dropdown">

                            <button
                                type="button"
                                className="dropdown-button"
                                onClick={() =>
                                    setSectionOpen(!sectionOpen)
                                }
                                aria-haspopup="listbox"
                                aria-expanded={sectionOpen}
                            >

                                <span>
                                    {selectedSection
                                        ? `Section ${selectedSection}`
                                        : 'Select section'}
                                </span>

                                <span className="dropdown-arrow">
                                    {sectionOpen ? '▲' : '▼'}
                                </span>

                            </button>

                            {sectionOpen && (

                                <div
                                    className="dropdown-menu"
                                    role="listbox"
                                >

                                    {sections.map((section) => (

                                        <div
                                            key={section}
                                            role="option"
                                            aria-selected={
                                                selectedSection === section
                                            }
                                            className="dropdown-option"
                                            onClick={() => {

                                                setSelectedSection(section);

                                                setSectionOpen(false);

                                            }}
                                        >
                                            Section {section}
                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                        {errors.section && (
                            <p className="error-message">
                                {errors.section}
                            </p>
                        )}

                    </div>


                    {/* Skills */}

                    <div className="form-group">

                        <label>
                            Skills
                        </label>

                        <div className="checkbox-group">

                            <label className="checkbox-option">

                                <input
                                    type="checkbox"
                                    name="skills"
                                    value="java"
                                />

                                <span>Java</span>

                            </label>

                            <label className="checkbox-option">

                                <input
                                    type="checkbox"
                                    name="skills"
                                    value="sql"
                                />

                                <span>SQL</span>

                            </label>

                            <label className="checkbox-option">

                                <input
                                    type="checkbox"
                                    name="skills"
                                    value="react"
                                />

                                <span>React</span>

                            </label>

                            <label className="checkbox-option">

                                <input
                                    type="checkbox"
                                    name="skills"
                                    value="docker"
                                />

                                <span>Docker</span>

                            </label>

                        </div>

                        {errors.skills && (
                            <p className="error-message">
                                {errors.skills}
                            </p>
                        )}

                    </div>


                    {/* Date of Birth */}

                    <div className="form-group">

                        <label htmlFor="dob">
                            Date of Birth
                        </label>

                        <input
                            id="dob"
                            name="dob"
                            type="date"
                        />

                        {errors.dob && (
                            <p className="error-message">
                                {errors.dob}
                            </p>
                        )}

                    </div>


                    {/* City Auto Suggestion */}

                    <div className="form-group">

                        <label htmlFor="city">
                            City
                        </label>

                        <div className="city-autocomplete">

                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Type to search city"
                                value={city}
                                onChange={(event) => {

                                    setCity(event.target.value);

                                    setShowSuggestions(true);

                                }}
                                onFocus={() =>
                                    setShowSuggestions(true)
                                }
                            />

                            {showSuggestions &&
                                city.length > 0 && (

                                    <div
                                        className="city-suggestions"
                                        role="listbox"
                                    >

                                        {cities
                                            .filter((item) =>
                                                item
                                                    .toLowerCase()
                                                    .includes(
                                                        city.toLowerCase()
                                                    )
                                            )
                                            .map((item) => (

                                                <div
                                                    key={item}
                                                    className="city-option"
                                                    role="option"
                                                    onClick={() => {

                                                        setCity(item);

                                                        setShowSuggestions(false);

                                                    }}
                                                >
                                                    {item}
                                                </div>

                                            ))}

                                    </div>
                                )}

                        </div>

                        {errors.city && (
                            <p className="error-message">
                                {errors.city}
                            </p>
                        )}

                    </div>


                    {/* Address */}

                    <div className="form-group">

                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            placeholder="Enter full address"
                            rows="4"
                        />

                        {errors.address && (
                            <p className="error-message">
                                {errors.address}
                            </p>
                        )}

                    </div>


                    {/* Register */}

                    <button
                        type="submit"
                        className="register-button"
                    >
                        Register Student
                    </button>

                </form>

            </div>

        </div>
    );
}

export default StudentRegistration;