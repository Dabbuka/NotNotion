import React, { useState } from 'react';
import './css/FolderTree.css';

const FolderTree = ({ folders, currentFolderId, onFolderClick }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const buildFolderTree = (parentId = null) => {
    const parentIdStr = parentId ? parentId.toString() : null;
    return folders
      .filter(folder => {
        const folderParentId = folder.parentFolderID ? folder.parentFolderID.toString() : null;
        return folderParentId === parentIdStr;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const renderFolder = (folder, level = 0) => {
    const hasChildren = folders.some(f => 
      f.parentFolderID && f.parentFolderID.toString() === folder._id.toString()
    );
    const isExpanded = expandedFolders.has(folder._id);
    const isCurrent = currentFolderId && currentFolderId.toString() === folder._id.toString();

    return (
      <div key={folder._id} className="folder-tree-item">
        <div
          className={`folder-tree-row ${isCurrent ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onFolderClick(folder._id)}
        >
          {hasChildren && (
            <span
              className="folder-expand-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder._id);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="folder-expand-icon-spacer" />}
          <span className="folder-icon">📁</span>
          <span className="folder-name" title={folder.title}>
            {folder.title.length > 20 ? folder.title.substring(0, 20) + '...' : folder.title}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="folder-children">
            {buildFolderTree(folder._id).map(childFolder => renderFolder(childFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = buildFolderTree(null);

  return (
    <div className="folder-tree">
      <div className="folder-tree-header">
        <h4>Folders</h4>
      </div>
      <div className="folder-tree-content">
        {rootFolders.length === 0 ? (
          <div className="folder-tree-empty">No folders yet</div>
        ) : (
          rootFolders.map(folder => renderFolder(folder))
        )}
      </div>
    </div>
  );
};

export default FolderTree;

