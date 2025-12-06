import React from 'react';

/**
 * Reusable breadcrumb navigation component
 */
const Breadcrumbs = ({
  items,
  onHomeClick,
  onItemClick,
  homeLabel = 'Home',
  separator = ' / ',
  className = '',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`breadcrumb-nav ${className}`}>
      <button onClick={onHomeClick} className="breadcrumb-home">
        {homeLabel}
      </button>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <span className="breadcrumb-separator">{separator}</span>
          <button
            onClick={() => onItemClick(item.id)}
            className="breadcrumb-item"
          >
            {item.title}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;

