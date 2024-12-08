import React from 'react';
import { Navigate } from 'react-router-dom';

// Private Route Component
const PrivateRoute = ({ element }) => {
    const userId = localStorage.getItem('userID'); // Check if userId exists in localStorage

    // If no userId, redirect to login
    if (!userId) {
        return <Navigate to="/" replace />;
    }

    return element; // Render the requested component
};

export default PrivateRoute;
