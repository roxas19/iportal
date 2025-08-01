import React, { useState } from 'react';
import { networkAPI } from '../../../services/api';
import './AddContactModal.css';

const AddContactModal = ({ isOpen, onClose, onContactAdded }) => {
  const [activeTab, setActiveTab] = useState('platform');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  // Platform user search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Manual contact form data
  const [manualContactData, setManualContactData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  // Handle tab switching
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setGeneralError('');
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
    setManualContactData({ name: '', email: '', phone_number: '' });
  };

  // Platform user search
  const handleSearchUsers = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setGeneralError('Please enter a username, email, or phone number');
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setSearchLoading(true);
    setSearchPerformed(true);
    setGeneralError('');
    
    // ...existing code...
    
    try {
      const response = await networkAPI.searchUsers(query);
      
      // ...existing code...
      
      // Backend returns { results: [...], count: N } format for user search
      if (response.data) {
        setSearchResults(response.data.results || []);
        // ...existing code...
      } else {
        setSearchResults([]);
        setGeneralError('Search failed');
        // ...existing code...
      }
    } catch (error) {
      // ...existing code...
      setSearchResults([]);
      setGeneralError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Remove debounced search effect - we'll use a button instead
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (activeTab === 'platform' && searchQuery) {
  //       handleSearchUsers(searchQuery);
  //     }
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [searchQuery, activeTab]);

  // Add platform user as contact
  const handleAddPlatformUser = async (user) => {
    setLoading(true);
    setGeneralError('');

    try {
      const contactData = {
        identifier: user.email, // Send the identifier for backend processing
        name: user.name
      };

      const response = await networkAPI.createContact(contactData);

      // Backend returns contact data directly on successful creation
      if (response.data) {
        onContactAdded && onContactAdded(response.data);
        onClose();
      } else {
        setGeneralError('Failed to add contact');
      }
    } catch (error) {
      console.error('Add platform user error:', error);
      if (error.response?.data?.non_field_errors) {
        // Handle unique constraint errors from Django
        setGeneralError(error.response.data.non_field_errors[0]);
      } else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('Failed to add contact. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual contact form fields
  const manualContactFields = [
    {
      name: 'name',
      label: 'Contact Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      validation: {
        required: true,
        requiredMessage: 'Contact name is required'
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: false,
      help: 'Email or phone number is required'
    },
    {
      name: 'phone_number',
      label: 'Phone Number',
      type: 'tel',
      placeholder: 'Enter phone number',
      required: false,
      help: 'Include country code (e.g., +1234567890)'
    }
  ];

  // Manual contact form actions
  const manualContactActions = [
    {
      type: 'submit',
      variant: 'primary',
      label: loading ? 'Adding Contact...' : 'Add Contact',
      loading,
      fullWidth: true
    },
    {
      variant: 'secondary',
      label: 'Cancel',
      onClick: onClose,
      fullWidth: true
    }
  ];

  // Handle manual contact submission
  const handleManualContactSubmit = async (formData) => {
    setLoading(true);
    setErrors({});
    setGeneralError('');

    // Validation: either email or phone required
    if (!formData.email && !formData.phone_number) {
      setGeneralError('Either email address or phone number is required');
      setLoading(false);
      return;
    }

    try {
      // Use identifier field for platform user detection
      const identifier = formData.email || formData.phone_number;
      
      const response = await networkAPI.createContact({
        identifier: identifier,
        name: formData.name
      });

      // Backend returns contact data directly on successful creation
      if (response.data) {
        onContactAdded && onContactAdded(response.data);
        onClose();
      } else {
        setGeneralError('Failed to add contact');
      }
    } catch (error) {
      console.error('Manual contact creation error:', error);
      
      if (error.response?.data) {
        // Handle Django REST framework validation errors
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          // Handle unique constraint errors
          setGeneralError(errorData.non_field_errors[0]);
        } else if (typeof errorData === 'object' && !errorData.message) {
          // Field-level errors (e.g., {email: ["Invalid email"], name: ["Required"]})
          setErrors(errorData);
        } else if (errorData.message) {
          setGeneralError(errorData.message);
        } else {
          setGeneralError('Failed to add contact. Please try again.');
        }
      } else {
        setGeneralError('Failed to add contact. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render platform user search tab
  const renderPlatformUserTab = () => (
    <div className="add-contact-modal__search-tab">
      <div className="search-field">
        <label htmlFor="user-search" className="input-label">
          Search Platform Users
        </label>
        <div className="search-input-group">
          <input
            id="user-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter username, email, or phone number (exact match)"
            className="input search-input"
            disabled={loading || searchLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchUsers();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSearchUsers}
            disabled={loading || searchLoading || !searchQuery.trim()}
            className="search-button"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="input-help">
          Enter the complete username, email, or phone number. Exact match required for security.
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {searchLoading && (
          <div className="search-loading">
            Searching users...
          </div>
        )}

        {!searchLoading && searchPerformed && searchResults.length === 0 && (
          <div className="search-empty">
            No contact with that match
          </div>
        )}

        {!searchLoading && searchResults.length > 0 && (
          <div className="search-results-list">
            <div className="search-results-header">
              <span>Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}</span>
            </div>
            {searchResults.map(user => (
              <div key={user.id} className="search-result-item">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.profile_photo ? (
                      <img 
                        src={user.profile_photo} 
                        alt={user.name}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                {user.is_existing_contact ? (
                  <div className="existing-contact-status">
                    <span className="already-in-contacts">Already in Contacts</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddPlatformUser(user)}
                    disabled={loading}
                    className="add-user-btn"
                  >
                    {loading ? 'Adding...' : 'Add Contact'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render manual contact tab using FormModal pattern
  const renderManualContactTab = () => (
    <div className="add-contact-modal__manual-tab">
      <div className="form-fields">
        {manualContactFields.map(field => (
          <div key={field.name} className="input-group">
            <label htmlFor={field.name} className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={manualContactData[field.name] || ''}
              onChange={(e) => setManualContactData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
              }))}
              placeholder={field.placeholder}
              className={`input ${errors[field.name] ? 'input--error' : ''}`.trim()}
              disabled={loading}
            />
            {errors[field.name] && (
              <div className="input-error" role="alert">
                {errors[field.name]}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manual contact actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={() => handleManualContactSubmit(manualContactData)}
          disabled={loading}
          className="primary-button"
        >
          {loading ? 'Adding Contact...' : 'Add Contact'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="secondary-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Only render if modal is open
  if (!isOpen) return null;

  return (
    <div className={`form-modal-overlay add-contact-modal ${loading ? 'loading' : ''}`}>
      <div className="form-modal">
        {/* Header */}
        <div className="form-modal-header">
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2 className="form-modal-title">Add Contact</h2>
          <p className="form-modal-subtitle">Add platform users or manual contacts to your network</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-button ${activeTab === 'platform' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('platform')}
          >
            Platform User
          </button>
          <button
            className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('manual')}
          >
            Manual Contact
          </button>
        </div>

        {/* Error Banner */}
        {generalError && (
          <div className="error-banner">
            {generalError}
          </div>
        )}

        {/* Tab Content */}
        <div className="add-contact-modal__content">
          {activeTab === 'platform' && renderPlatformUserTab()}
          {activeTab === 'manual' && renderManualContactTab()}
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
