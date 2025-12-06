import React from 'react';

/**
 * Reusable form input component
 * Provides consistent styling and behavior for form inputs
 */
const FormInput = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className = '',
}) => {
  return (
    <div className="form-input-wrapper">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`form-input ${className}`}
      />
    </div>
  );
};

export default FormInput;

