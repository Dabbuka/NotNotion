import React from 'react';
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
              const isFolder = item.itemType === 'Folder' || item.isFolder;
              const itemData = item.item || item;
              const itemId = itemData._id || itemData;
              const itemTitle = itemData.title || 'Untitled';

              return (
                <div
                  key={itemId}
                  className={`folder-explorer-item ${isFolder ? 'folder-item' : 'file-item'}`}
                  onClick={() => {
                    if (isFolder) {
                      onFolderClick(itemId);
                    } else {
                      onNoteClick(itemId);
                    }
                  }}
                >
                  <span className="folder-explorer-icon">
                    {isFolder ? '📁' : '📄'}
                  </span>
                  <span className="folder-explorer-name" title={itemTitle}>
                    {itemTitle.length > 25 ? itemTitle.substring(0, 25) + '...' : itemTitle}
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

