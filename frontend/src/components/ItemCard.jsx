import React from 'react';
import { truncateText, formatDate, isFolder, getItemData, getItemId, getItemTitle, getItemDate } from '../utils';

/**
 * Reusable card component for displaying notes and folders
 */
const ItemCard = ({ 
  item, 
  onClick,
  showDate = true,
  titleMaxLength = 30,
  className = '',
}) => {
  const itemIsFolder = isFolder(item);
  const itemData = getItemData(item);
  const itemId = getItemId(item);
  const itemTitle = getItemTitle(item);
  const itemDate = getItemDate(item);

  return (
    <div className={`item-card-wrapper ${className}`}>
      <div
        className={`item-card ${itemIsFolder ? 'folder-card' : 'document-card'}`}
        onClick={() => onClick(itemId, itemIsFolder)}
      >
        {itemIsFolder && <span className="folder-card-icon"></span>}
      </div>
      <div className="item-info">
        <h3 className="item-title" title={itemTitle}>
          {truncateText(itemTitle, titleMaxLength)}
        </h3>
        {showDate && (
          <p className="item-meta">
            {formatDate(itemDate)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemCard;

