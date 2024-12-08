import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login'; // Import other pages as needed
import ProductsPage from './pages/ProductPage';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<ProductsPage />} />

          {/* Add more routes here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
