import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton, LinkButton } from '../buttons';
import './FormModal.css';

const FormModal = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  fields = [],
  actions = [],
  onSubmit,
  loading = false,
  errors = {},
  generalError = '',
  className = '',
  showTabs = false,
  tabs = [],
  activeTab = '',
  onTabChange,
  formData = {},
  onFormDataChange,
  validation = {},
  showCloseButton = false
}) => {
  const [internalFormData, setInternalFormData] = useState({});
  const [internalErrors, setInternalErrors] = useState({});

  // Use internal state if no external state provided
  const currentFormData = formData && Object.keys(formData).length > 0 ? formData : internalFormData;
  const currentErrors = errors && Object.keys(errors).length > 0 ? errors : internalErrors;
  const handleDataChange = onFormDataChange || setInternalFormData;
  const handleErrorsChange = setInternalErrors;

  // Initialize form data from field defaults
  useEffect(() => {
    if (!onFormDataChange) {
      const initialData = {};
      fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        } else if (field.type === 'checkbox-group') {
          initialData[field.name] = [];
        } else {
          initialData[field.name] = '';
        }
      });
      setInternalFormData(initialData);
    }
  }, [fields, onFormDataChange]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
      // Handle checkbox groups
      const field = fields.find(f => f.name === name);
      if (field && field.type === 'checkbox-group') {
        const currentValues = currentFormData[name] || [];
        newValue = checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value);
      } else {
        // Single checkbox
        newValue = checked;
      }
    } else if (type === 'file') {
      newValue = e.target.files[0];
    } else {
      newValue = value;
    }

    handleDataChange(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear field error when user starts typing
    if (currentErrors[name]) {
      handleErrorsChange(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (field, value) => {
    const fieldValidation = validation[field.name] || field.validation || {};
    
    if (fieldValidation.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return fieldValidation.requiredMessage || `${field.label} is required`;
    }
    
    if (value && fieldValidation.minLength && value.length < fieldValidation.minLength) {
      return fieldValidation.minLengthMessage || `${field.label} must be at least ${fieldValidation.minLength} characters`;
    }
    
    if (value && fieldValidation.pattern && !fieldValidation.pattern.test(value)) {
      return fieldValidation.patternMessage || `${field.label} format is invalid`;
    }
    
    if (value && fieldValidation.custom && typeof fieldValidation.custom === 'function') {
      return fieldValidation.custom(value, currentFormData);
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = currentFormData[field.name];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    handleErrorsChange(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      await onSubmit(currentFormData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const renderField = (field) => {
    const value = currentFormData[field.name] || '';
    const error = currentErrors[field.name];
    const fieldId = `${field.name}-${field.type}`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
      case 'number':
        return (
          <div key={field.name} className="input-group">
            <label htmlFor={fieldId} className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              id={fieldId}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={`input ${error ? 'input--error' : ''}`.trim()}
              disabled={field.disabled}
              min={field.min}
              max={field.max}
              step={field.step}
            />
            {error && (
              <div className="input-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="input-group">
            <label htmlFor={fieldId} className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldId}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={`textarea ${error ? 'textarea--error' : ''}`.trim()}
              disabled={field.disabled}
              rows={field.rows || 4}
            />
            {error && (
              <div className="input-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="input-group">
            <label htmlFor={fieldId} className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={fieldId}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              className={`select ${error ? 'select--error' : ''}`.trim()}
              disabled={field.disabled}
            >
              {field.placeholder && (
                <option value="">{field.placeholder}</option>
              )}
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <div className="input-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="input-group">
            <label htmlFor={fieldId} className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="file"
              id={fieldId}
              name={field.name}
              onChange={handleInputChange}
              className={`file-input ${error ? 'file-input--error' : ''}`.trim()}
              disabled={field.disabled}
              accept={field.accept}
              multiple={field.multiple}
            />
            {error && (
              <div className="input-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="input-group checkbox-single">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name={field.name}
                checked={!!value}
                onChange={handleInputChange}
                disabled={field.disabled}
              />
              <span className="checkbox-text">
                {field.label}
                {field.required && <span className="required">*</span>}
              </span>
            </label>
            {error && (
              <div className="input-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'checkbox-group':
        return (
          <div key={field.name} className="form-group">
            <label className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="checkbox-group">
              {field.options?.map(option => (
                <label key={option.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={(value || []).includes(option.value)}
                    onChange={handleInputChange}
                    disabled={field.disabled}
                  />
                  <span className="checkbox-text">{option.label}</span>
                </label>
              ))}
            </div>
            {error && (
              <div className="field-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="form-group">
            <label className="input-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              {field.options?.map(option => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={handleInputChange}
                    disabled={field.disabled}
                  />
                  <span className="radio-text">{option.label}</span>
                </label>
              ))}
            </div>
            {error && (
              <div className="field-error" role="alert">
                {error}
              </div>
            )}
            {field.help && (
              <div className="input-help">
                {field.help}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderAction = (action) => {
    const ActionComponent = action.variant === 'primary' ? PrimaryButton : 
                           action.variant === 'secondary' ? SecondaryButton : 
                           LinkButton;

    return (
      <ActionComponent
        key={action.label}
        type={action.type || 'button'}
        onClick={action.onClick}
        loading={action.loading || (action.type === 'submit' && loading)}
        disabled={action.disabled}
        fullWidth={action.fullWidth}
        className={action.className}
      >
        {action.loading || (action.type === 'submit' && loading) ? action.loadingText : action.label}
      </ActionComponent>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`form-modal-overlay ${className}`}>
      <div className="form-modal">
        {/* Header */}
        <div className="form-modal-header">
          {showCloseButton && (
            <button className="close-button" onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
          {title && <h2 className="form-modal-title">{title}</h2>}
          {subtitle && <p className="form-modal-subtitle">{subtitle}</p>}
        </div>

        {/* Tabs */}
        {showTabs && tabs.length > 0 && (
          <div className="auth-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Error Banner */}
        {generalError && (
          <div className="error-banner">
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
          <div className="form-fields">
            {fields.map(renderField)}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="form-actions">
              {actions.map(renderAction)}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormModal;
