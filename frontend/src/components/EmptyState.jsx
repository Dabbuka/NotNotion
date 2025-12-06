import React from 'react';

/**
 * Reusable empty state component
 * Displays a message when there's no content to show
 */
const EmptyState = ({
  title,
  subtitle,
  searchQuery = '',
  className = '',
}) => {
  if (searchQuery) {
    return (
      <div className={`empty-state ${className}`}>
        <p>No items found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className={`empty-state ${className}`}>
      <p className="empty-state-title">{title}</p>
      {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;

