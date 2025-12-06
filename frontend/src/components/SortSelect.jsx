import React from 'react';

/**
 * Reusable sort select component
 */
const SortSelect = ({
  value,
  onChange,
  options = [
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date Created' },
  ],
  label = 'Sort by:',
  className = '',
}) => {
  return (
    <div className={`sort-container ${className}`}>
      {label && <label htmlFor="sort-select">{label}</label>}
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sort-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelect;

