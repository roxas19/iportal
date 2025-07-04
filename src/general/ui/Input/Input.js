import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const inputId = id || name;
  const inputClass = `input ${error ? 'input--error' : ''} ${className}`.trim();

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClass}
        {...props}
      />
      {error && (
        <div className="input-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
