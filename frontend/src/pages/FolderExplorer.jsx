import React from 'react';
import { truncateText, isFolder, getItemId, getItemTitle } from '../utils';
import './css/FolderExplorer.css';

const FolderExplorer = ({ 
  currentFolderId, 
  currentFolder, 
  items, 
  onFolderClick, 
  onNoteClick, 
  onParentClick 
}) => {
  const isRoot = !currentFolderId;
  const folderTitle = currentFolder?.title || 'Root';

  return (
    <div className="folder-explorer">
      <div className="folder-explorer-header">
        <h4>{folderTitle}</h4>
        {!isRoot && (
          <button 
            className="parent-directory-button"
            onClick={onParentClick}
            title="Go to parent directory"
          >
            ..
          </button>
        )}
      </div>
      <div className="folder-explorer-content">
        {items.length === 0 ? (
          <div className="folder-explorer-empty">This folder is empty</div>
        ) : (
          <div className="folder-explorer-items">
            {items.map((item) => {
              const itemIsFolder = isFolder(item);
              const itemId = getItemId(item);
              const itemTitle = getItemTitle(item);

              return (
                <div
                  key={itemId}
                  className={`folder-explorer-item ${itemIsFolder ? 'folder-item' : 'file-item'}`}
                  onClick={() => {
                    if (itemIsFolder) {
                      onFolderClick(itemId);
                    } else {
                      onNoteClick(itemId);
                    }
                  }}
                >
                  <span className="folder-explorer-icon">
                    {itemIsFolder ? '📁' : '📄'}
                  </span>
                  <span className="folder-explorer-name" title={itemTitle}>
                    {truncateText(itemTitle, 25)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderExplorer;
