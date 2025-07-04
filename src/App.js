import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './general/PrivateRoute.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import AuthPage from './pages/AuthPage/AuthPage.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/" element={<AuthPage mode="login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
