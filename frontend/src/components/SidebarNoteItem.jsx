import React from 'react';
import { truncateText } from '../utils';

/**
 * Reusable sidebar note item component
 * Displays a note in a compact sidebar format
 */
const SidebarNoteItem = ({
  note,
  onClick,
  maxTitleLength = 20,
  isActive = false,
  className = '',
}) => {
  return (
    <div
      className={`sidebar-note-item ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onClick(note._id)}
    >
      <span className="sidebar-note-icon">📄</span>
      <span className="sidebar-note-title" title={note.title}>
        {truncateText(note.title, maxTitleLength)}
      </span>
    </div>
  );
};

export default SidebarNoteItem;

