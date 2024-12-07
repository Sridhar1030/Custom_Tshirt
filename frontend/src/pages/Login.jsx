import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate(); // Initialize navigate

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccess('Registration successful!');
            setError(null);
            console.log('Response:', response.data);

            // Store userID in localStorage
            console.log('User ID:', response.data.user._id);
            localStorage.setItem('userID', response.data.user._id);  // Assuming `userID` is in response.data

            // Redirect to /home
            navigate('/home');
        } catch (err) {
            setError('Registration failed. Please try again.');
            setSuccess(null);
            console.error('Error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

                {/* Display success or error messages */}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Full Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
