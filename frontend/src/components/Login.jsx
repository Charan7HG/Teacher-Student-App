import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );
if (response.ok) {
    const teacher = await response.json();

    console.log('Login successful:', teacher);

    navigate('/dashboard');
}else {
                setMessage('Invalid email or password');
            }

        } catch (error) {
            console.error(error);
            setMessage('Unable to connect to server');
        }
    };

    return (
    <div className="login-container">

        <div className="login-card">

            <h1>Teacher Login</h1>

            <form onSubmit={handleLogin}>

                <div className="form-group">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />

                </div>

                <div className="form-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />

                </div>

                <button
                    type="submit"
                    className="login-button"
                >
                    Login
                </button>

            </form>

            {message && (
                <p className="error-message">
                    {message}
                </p>
            )}

        </div>

    </div>
);
}

export default Login;