import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, LinkButton } from '../../general/buttons';
import Input from '../../general/ui/Input/Input.js';
import './AuthPage.css';

const AuthPage = ({ mode = 'login' }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [formData, setFormData] = useState({
    // Login fields
    username_or_email: '',
    password: '',
    // Register fields
    username: '',
    email: '',
    name: '',
    roles: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Update active tab when mode prop changes
  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  // Handle tab switching with proper navigation
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
    setErrors({});
    setGeneralError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value)
    }));
    // Clear role error
    if (errors.roles) {
      setErrors(prev => ({
        ...prev,
        roles: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'login') {
      if (!formData.username_or_email.trim()) {
        newErrors.username_or_email = 'Username or email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      // Registration validation
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.roles.length === 0) {
        newErrors.roles = 'Please select at least one role';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        const result = await login(formData.username_or_email, formData.password);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setGeneralError(result.error);
        }
      } else {
        // Registration
        const registrationData = {
          username: formData.username,
          email: formData.email,
          name: formData.name,
          password: formData.password,
          roles: formData.roles
        };
        
        const result = await register(registrationData);
        if (result.success) {
          navigate('/dashboard');
        } else {
          if (typeof result.error === 'object') {
            setErrors(result.error);
          } else {
            setGeneralError(result.error);
          }
        }
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button 
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {generalError && (
          <div className="error-banner">
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
          {activeTab === 'login' ? (
            // Login Form
            <>
              <Input
                label="Username or Email"
                id="username_or_email"
                name="username_or_email"
                value={formData.username_or_email}
                onChange={handleInputChange}
                error={errors.username_or_email}
                placeholder="Enter your username or email"
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Enter your password"
              />

              <PrimaryButton 
                type="submit" 
                loading={loading}
                fullWidth
              >
                {loading ? 'Logging in...' : 'Login'}
              </PrimaryButton>

              <p className="switch-text">
                Need an account?{' '}
                <LinkButton 
                  onClick={() => handleTabSwitch('register')}
                >
                  Register
                </LinkButton>
              </p>
            </>
          ) : (
            // Registration Form
            <>
              <Input
                label="Username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                placeholder="Choose a username"
              />

              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
              />

              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                placeholder="Enter your full name"
              />

              <Input
                label="Password"
                id="reg-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="Choose a secure password (min 8 characters)"
              />

              <div className="form-group">
                <label>Role Selection</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="roles"
                      value="Instructor"
                      checked={formData.roles.includes('Instructor')}
                      onChange={handleRoleChange}
                    />
                    <span className="checkbox-text">Tutor</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="roles"
                      value="Student"
                      checked={formData.roles.includes('Student')}
                      onChange={handleRoleChange}
                    />
                    <span className="checkbox-text">Student</span>
                  </label>
                </div>
                {errors.roles && (
                  <div className="field-error">{errors.roles}</div>
                )}
              </div>

              <PrimaryButton 
                type="submit" 
                loading={loading}
                fullWidth
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>

              <p className="switch-text">
                Already have an account?{' '}
                <LinkButton 
                  onClick={() => handleTabSwitch('login')}
                >
                  Login
                </LinkButton>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
