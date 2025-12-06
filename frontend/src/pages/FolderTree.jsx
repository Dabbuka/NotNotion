import React, { useState } from 'react';
import { truncateText } from '../utils';
import './css/FolderTree.css';

const FolderTree = ({ folders, notes, currentFolderId, currentNoteId, onFolderClick, onNoteClick }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const toggleFolder = (folderId, e) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Get folders that belong to a parent folder
  const getFoldersInParent = (parentId = null) => {
    const parentIdStr = parentId ? parentId.toString() : null;
    return folders
      .filter(folder => {
        const folderParentId = folder.parentFolderID ? folder.parentFolderID.toString() : null;
        return folderParentId === parentIdStr;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  // Get notes that belong to a folder (or root if folderId is null)
  const getNotesInFolder = (folderId = null) => {
    const folderIdStr = folderId ? folderId.toString() : null;
    return (notes || [])
      .filter(note => {
        const noteFolderId = note.folderID ? note.folderID.toString() : null;
        return noteFolderId === folderIdStr;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  // Check if a folder has any children (folders or notes)
  const hasChildren = (folderId) => {
    const hasChildFolders = folders.some(f => 
      f.parentFolderID && f.parentFolderID.toString() === folderId.toString()
    );
    const hasChildNotes = (notes || []).some(n => 
      n.folderID && n.folderID.toString() === folderId.toString()
    );
    return hasChildFolders || hasChildNotes;
  };

  const renderNote = (note, level = 0) => {
    const isCurrentNote = currentNoteId && currentNoteId.toString() === note._id.toString();

    return (
      <div key={note._id} className="folder-tree-item">
        <div
          className={`folder-tree-row note-row ${isCurrentNote ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onNoteClick(note._id)}
        >
          <span className="folder-expand-icon-spacer" />
          <span className="folder-icon">📄</span>
          <span className="folder-name" title={note.title}>
            {truncateText(note.title, 20)}
          </span>
        </div>
      </div>
    );
  };

  const renderFolder = (folder, level = 0) => {
    const folderHasChildren = hasChildren(folder._id);
    const isExpanded = expandedFolders.has(folder._id);
    const isCurrent = currentFolderId && currentFolderId.toString() === folder._id.toString();

    const childFolders = getFoldersInParent(folder._id);
    const childNotes = getNotesInFolder(folder._id);

    return (
      <div key={folder._id} className="folder-tree-item">
        <div
          className={`folder-tree-row ${isCurrent ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onFolderClick(folder._id)}
        >
          {folderHasChildren ? (
            <span
              className="folder-expand-icon"
              onClick={(e) => toggleFolder(folder._id, e)}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="folder-expand-icon-spacer" />
          )}
          <span className="folder-icon">📁</span>
          <span className="folder-name" title={folder.title}>
            {truncateText(folder.title, 20)}
          </span>
        </div>
        {folderHasChildren && isExpanded && (
          <div className="folder-children">

            {childFolders.map(childFolder => renderFolder(childFolder, level + 1))}
            {childNotes.map(note => renderNote(note, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getFoldersInParent(null);
  const rootNotes = getNotesInFolder(null);

  return (
    <div className="folder-tree">
      <div className="folder-tree-header">
        <h4>Explorer</h4>
      </div>
      <div className="folder-tree-content">
        {rootFolders.length === 0 && rootNotes.length === 0 ? (
          <div className="folder-tree-empty">No files yet</div>
        ) : (
          <>
            {/* Render root folders first */}
            {rootFolders.map(folder => renderFolder(folder))}
            {/* Then render root notes (notes not in any folder) */}
            {rootNotes.map(note => renderNote(note))}
          </>
        )}
      </div>
    </div>
  );
};

export default FolderTree;
