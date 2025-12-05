import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
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

  // Load current user and fetch notes/folders on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
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
      
      items = allItems.filter(item => {
        const title = item.title || '';
        const content = item.content || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               content.toLowerCase().includes(searchQuery.toLowerCase());
      });
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

    // Sort items
    const sorted = [...items].sort((a, b) => {
      const aTitle = a.item?.title || a.title || '';
      const bTitle = b.item?.title || b.title || '';
      const aDate = a.item?.updatedAt || a.updatedAt || new Date();
      const bDate = b.item?.updatedAt || b.updatedAt || new Date();
      const aCreated = a.item?.createdAt || a.createdAt || new Date();
      const bCreated = b.item?.createdAt || b.createdAt || new Date();

      switch (sortBy) {
        case 'name':
          return aTitle.localeCompare(bTitle);
        case 'date':
          return new Date(bCreated) - new Date(aCreated);
        case 'lastModified':
          return new Date(bDate) - new Date(aDate);
        default:
          return 0;
      }
    });

    setFilteredItems(sorted);
  }, [searchQuery, sortBy, notes, folders, currentFolderId, currentFolderContents]);

  const fetchNotes = async (userFromArg) => {
    try {
      const user = userFromArg || currentUser;
      if (!user?._id) return;
  
      const response = await axios.get('/api/notes/all', {
        params: { userID: user._id },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchFolders = async (userFromArg) => {
    try {
      const user = userFromArg || currentUser;
      if (!user?._id) return;

      const response = await axios.get('/api/folders/all', {
        params: { userID: user._id },
      });
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFolderContents = async (folderId) => {
    try {
      const response = await axios.get(`/api/folders/${folderId}/contents`);
      setCurrentFolderContents(response.data);
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

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

      const response = await axios.post('/api/notes/createNote', noteData);
      
      setNotes([response.data, ...notes]);
      
      if (currentFolderId) {
        await axios.post(`/api/folders/${currentFolderId}/addItem`, {
          itemId: response.data._id,
          itemType: 'Note'
        });
        fetchFolderContents(currentFolderId);
      }
      
      setNewNoteTitle('');
      setShowNewNoteForm(false);
      
      navigate(`/app?noteId=${response.data._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderTitle.trim()) return;

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

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

      const response = await axios.post('/api/folders/createFolder', folderData);
      
      setFolders([response.data, ...folders]);
      
      if (currentFolderId) {
        await axios.post(`/api/folders/${currentFolderId}/addItem`, {
          itemId: response.data._id,
          itemType: 'Folder'
        });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
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
                <div
                  key={note._id}
                  className="sidebar-note-item"
                  onClick={() => handleNoteClick(note._id)}
                >
                  <span className="sidebar-note-icon">📄</span>
                  <span className="sidebar-note-title" title={note.title}>
                    {note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title}
                  </span>
                </div>
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
          <div className="search-container">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-container">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="lastModified">Last Modified</option>
              <option value="name">Name</option>
              <option value="date">Date Created</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {currentFolderId && (
          <div className="breadcrumb-nav">
            <button onClick={handleBackToRoot} className="breadcrumb-home">
              Home
            </button>
            {getBreadcrumbs().map((crumb) => (
              <React.Fragment key={crumb.id}>
                <span className="breadcrumb-separator"> / </span>
                <button
                  onClick={() => navigate(`/home?folder=${crumb.id}`)}
                  className="breadcrumb-item"
                >
                  {crumb.title}
                </button>
              </React.Fragment>
            ))}
          </div>
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
            <div className="empty-state">
              {searchQuery ? (
                <p>No items found matching "{searchQuery}"</p>
              ) : (
                <div>
                  <p className="empty-state-title">
                    {currentFolderId ? 'This folder is empty' : 'No items yet'}
                  </p>
                  <p className="empty-state-subtitle">
                    {currentFolderId 
                      ? 'Add documents or folders to get started' 
                      : 'Create your first document or folder to get started'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isFolder = item.itemType === 'Folder' || item.isFolder;
              const itemData = item.item || item;
              const itemId = itemData._id;
              const itemTitle = itemData.title;
              const itemDate = itemData.updatedAt;

              return (
                <div key={itemId} className="document-wrapper">
                  <div
                    className={`document-card ${isFolder ? 'folder-card' : ''}`}
                    onClick={() => {
                      if (isFolder) {
                        handleFolderClick(itemId);
                      } else {
                        handleNoteClick(itemId);
                      }
                    }}
                  >
                    {isFolder && <span className="folder-card-icon">📁</span>}
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
