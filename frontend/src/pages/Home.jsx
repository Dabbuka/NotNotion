import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService, noteService, folderService } from '../services';
import { formatDate, isFolder, getItemId, getItemTitle, getItemDate, sortItems, filterItemsBySearch } from '../utils';
import { SidebarNoteItem, EmptyState, Breadcrumbs, SearchInput, SortSelect } from '../components';
import './css/Home.css';

const Home = () => {
  // URL-based folder navigation
  const [searchParams] = useSearchParams();
  const currentFolderId = searchParams.get('folder'); // Get folder ID from URL
  
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderContents, setCurrentFolderContents] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch notes function
  const fetchNotes = async (userFromArg) => {
    try {
      const user = userFromArg || currentUser;
      if (!user?._id) return;
  
      const data = await noteService.getAllNotes(user._id);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Fetch folders function
  const fetchFolders = async (userFromArg) => {
    try {
      const user = userFromArg || currentUser;
      if (!user?._id) return;

      const data = await folderService.getAllFolders(user._id);
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  // Load current user and fetch notes/folders on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      fetchNotes(user);
      fetchFolders(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch folder contents when URL folder parameter changes
  useEffect(() => {
    if (currentFolderId) {
      fetchFolderContents(currentFolderId);
    } else {
      setCurrentFolderContents(null);
    }
  }, [currentFolderId]);

  // Filter and sort items when search query, sortBy, or items change
  useEffect(() => {
    let items = [];

    // If searching, search ALL items regardless of hierarchy
    if (searchQuery.trim()) {
      const allNotes = notes.map(n => ({ ...n, itemType: 'Note', isFolder: false }));
      const allFolders = folders.map(f => ({ ...f, itemType: 'Folder', isFolder: true }));
      const allItems = [...allFolders, ...allNotes];
      
      items = filterItemsBySearch(allItems, searchQuery);
    } else {
      // Get items based on current folder context (no search)
      if (currentFolderId && currentFolderContents) {
        items = currentFolderContents.items || [];
      } else {
        // Show root level items
        const rootNotes = notes.filter(note => 
          note.folderID === null || note.folderID === undefined
        );
        const rootFolders = folders.filter(folder => 
          folder.parentFolderID === null || folder.parentFolderID === undefined
        );
        items = [
          ...rootFolders.map(f => ({ ...f, itemType: 'Folder', isFolder: true })),
          ...rootNotes.map(n => ({ ...n, itemType: 'Note', isFolder: false }))
        ];
      }
    }

    // Sort items using utility function
    const sorted = sortItems(items, sortBy);
    setFilteredItems(sorted);
  }, [searchQuery, sortBy, notes, folders, currentFolderId, currentFolderContents]);

  const fetchFolderContents = async (folderId) => {
    try {
      const data = await folderService.getFolderContents(folderId);
      setCurrentFolderContents(data);
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      const user = authService.getCurrentUser();

      if (!user?._id) {
        alert("You must be logged in to create a document.");
        return;
      }

      const noteData = {
        title: newNoteTitle,
        content: '',
        userID: user._id,
      };

      if (currentFolderId) {
        noteData.folderID = currentFolderId;
      }

      const newNote = await noteService.createNote(noteData);
      
      setNotes([newNote, ...notes]);
      
      if (currentFolderId) {
        await folderService.addItemToFolder(currentFolderId, newNote._id, 'Note');
        fetchFolderContents(currentFolderId);
      }
      
      setNewNoteTitle('');
      setShowNewNoteForm(false);
      
      navigate(`/app?noteId=${newNote._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderTitle.trim()) return;

    try {
      const user = authService.getCurrentUser();

      if (!user?._id) {
        alert("You must be logged in to create a folder.");
        return;
      }

      const folderData = {
        title: newFolderTitle,
        userID: user._id,
      };

      if (currentFolderId) {
        folderData.parentFolderID = currentFolderId;
      }

      const newFolder = await folderService.createFolder(folderData);
      
      setFolders([newFolder, ...folders]);
      
      if (currentFolderId) {
        await folderService.addItemToFolder(currentFolderId, newFolder._id, 'Folder');
        fetchFolderContents(currentFolderId);
      }
      
      setNewFolderTitle('');
      setShowNewFolderForm(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  // Navigate to note editor
  const handleNoteClick = (noteId) => {
    navigate(`/app?noteId=${noteId}`);
  };

  // Navigate to folder via URL (enables browser back button!)
  const handleFolderClick = (folderId) => {
    navigate(`/home?folder=${folderId}`);
  };

  // Navigate back to root
  const handleBackToRoot = () => {
    navigate('/home');
  };

  // Build breadcrumb trail from current folder to root
  const getBreadcrumbs = () => {
    if (!currentFolderId) return [];
    
    const breadcrumbs = [];
    let currentId = currentFolderId.toString();
    const folderMap = new Map(folders.map(f => [f._id.toString(), f]));
    
    while (currentId) {
      const folder = folderMap.get(currentId);
      if (!folder) break;
      breadcrumbs.unshift({ id: folder._id, title: folder.title });
      currentId = folder.parentFolderID ? folder.parentFolderID.toString() : null;
    }
    
    return breadcrumbs;
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          {currentUser && (
            <div className="user-greeting">
              <h3><span><strong>{currentUser.username}</strong>'s Space</span></h3>
            </div>
          )}
        </div>
        <div className="sidebar-content">
          <h4>Quick Access</h4>
          <div className="sidebar-section">
            <div className="sidebar-notes">
              {notes.slice(0, 10).map((note) => (
                <SidebarNoteItem
                  key={note._id}
                  note={note}
                  onClick={handleNoteClick}
                />
              ))}
              {notes.length === 0 && (
                <div className="sidebar-empty">No documents yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header with Search and Sort */}
        <div className="home-header">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents..."
          />
          
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        {/* Breadcrumb Navigation */}
        {currentFolderId && (
          <Breadcrumbs
            items={getBreadcrumbs()}
            onHomeClick={handleBackToRoot}
            onItemClick={(id) => navigate(`/home?folder=${id}`)}
          />
        )}

        {/* Add New Document/Folder Section */}
        <div className="new-document-section">
          <div className="new-item-buttons">
            {!showNewNoteForm && !showNewFolderForm && (
              <>
                <button
                  className="add-document-button"
                  onClick={() => setShowNewNoteForm(true)}
                >
                  + New Document
                </button>
                <button
                  className="add-folder-button"
                  onClick={() => setShowNewFolderForm(true)}
                >
                  + New Folder
                </button>
              </>
            )}
          </div>
          
          {showNewNoteForm && (
            <form onSubmit={handleCreateNote} className="new-note-form">
              <input
                type="text"
                placeholder="Enter document title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="new-note-input"
                autoFocus
              />
              <div className="new-note-actions">
                <button type="submit" className="create-button">Create</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewNoteForm(false);
                    setNewNoteTitle('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {showNewFolderForm && (
            <form onSubmit={handleCreateFolder} className="new-note-form">
              <input
                type="text"
                placeholder="Enter folder name..."
                value={newFolderTitle}
                onChange={(e) => setNewFolderTitle(e.target.value)}
                className="new-note-input"
                autoFocus
              />
              <div className="new-note-actions">
                <button type="submit" className="create-button">Create</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFolderForm(false);
                    setNewFolderTitle('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Documents Grid */}
        <div className="documents-grid">
          {filteredItems.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              title={currentFolderId ? 'This folder is empty' : 'No items yet'}
              subtitle={currentFolderId 
                ? 'Add documents or folders to get started' 
                : 'Create your first document or folder to get started'}
            />
          ) : (
            filteredItems.map((item) => {
              const itemIsFolder = isFolder(item);
              const itemId = getItemId(item);
              const itemTitle = getItemTitle(item);
              const itemDate = getItemDate(item);

              return (
                <div key={itemId} className="document-wrapper">
                  <div
                    className={`document-card ${itemIsFolder ? 'folder-card' : ''}`}
                    onClick={() => {
                      if (itemIsFolder) {
                        handleFolderClick(itemId);
                      } else {
                        handleNoteClick(itemId);
                      }
                    }}
                  >
                    {itemIsFolder && <span className="folder-card-icon"></span>}
                  </div>
                  <div className="document-info">
                    <h3 className="document-title" title={itemTitle}>
                      {itemTitle}
                    </h3>
                    <p className="document-meta">
                      {formatDate(itemDate)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
