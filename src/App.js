import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './general/PrivateRoute.js';
import HeaderPanel from './general/HeaderPanel';
import Dashboard from './pages/Dashboard/Dashboard.js';
import Network from './pages/Network/Network.js';
import Courses from './pages/Courses/Courses.js';
import CourseDetail from './pages/CourseDetail/CourseDetail.js';
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
                  <HeaderPanel />
                  <main className="main-content">
                    <Dashboard />
                  </main>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/network" 
              element={
                <PrivateRoute>
                  <HeaderPanel />
                  <main className="main-content">
                    <Network />
                  </main>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <PrivateRoute>
                  <HeaderPanel />
                  <main className="main-content">
                    <Courses />
                  </main>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/course/:courseId" 
              element={
                <PrivateRoute>
                  <HeaderPanel />
                  <main className="main-content">
                    <CourseDetail />
                  </main>
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
