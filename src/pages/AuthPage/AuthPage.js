import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormModal from '../../general/FormModal/FormModal';
import './AuthPage.css';

const initialFormState = {
  username_or_email: '',
  password: '',
  username: '',
  email: '',
  name: '',
  roles: []
};

const AuthPage = ({ mode = 'login' }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [formData, setFormData] = useState(initialFormState);
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
    setFormData(initialFormState);
  };

  // Configuration for fields
  const loginFields = [
    { name: 'username_or_email', label: 'Username or Email', type: 'text', placeholder: 'Enter your username or email', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true }
  ];

  const registerFields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email address', required: true,
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMessage: 'Please enter a valid email address' } },
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Choose a secure password', required: true,
      validation: { minLength: 8, minLengthMessage: 'Password must be at least 8 characters' } },
    { name: 'roles', label: 'Role Selection', type: 'checkbox-group', required: true,
      options: [
        { label: 'Tutor', value: 'Instructor' },
        { label: 'Student', value: 'Student' }
      ] }
  ];

  const fields = activeTab === 'login' ? loginFields : registerFields;

  // Configuration for actions
  const actions = activeTab === 'login'
    ? [
        { type: 'submit', variant: 'primary', label: loading ? 'Logging in...' : 'Login', loading, fullWidth: true },
        { variant: 'link', label: 'Need an account? Register', onClick: () => handleTabSwitch('register') }
      ]
    : [
        { type: 'submit', variant: 'primary', label: loading ? 'Creating Account...' : 'Create Account', loading, fullWidth: true },
        { variant: 'link', label: 'Already have an account? Login', onClick: () => handleTabSwitch('login') }
      ];

  return (
    <div className="auth-page">
      <FormModal
        isOpen={true}
        showTabs={true}
        tabs={[
          { key: 'login', label: 'Login' },
          { key: 'register', label: 'Register' }
        ]}
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
        title={activeTab === 'login' ? 'Login' : 'Register'}
        fields={fields}
        formData={formData}
        onFormDataChange={setFormData}
        errors={errors}
        generalError={generalError}
        onSubmit={async (data) => {
          setGeneralError('');
          setLoading(true);
          try {
            if (activeTab === 'login') {
              const result = await login(data.username_or_email, data.password);
              if (result.success) navigate('/dashboard');
              else setGeneralError(result.error);
            } else {
              const registrationData = { username: data.username, email: data.email, name: data.name, password: data.password, roles: data.roles };
              const result = await register(registrationData);
              if (result.success) navigate('/dashboard');
              else if (typeof result.error === 'object') setErrors(result.error);
              else setGeneralError(result.error);
            }
          } catch (err) {
            setGeneralError('An unexpected error occurred. Please try again.');
          } finally {
            setLoading(false);
          }
        }}
        actions={actions}
        loading={loading}
      />
    </div>
  );
};

export default AuthPage;
