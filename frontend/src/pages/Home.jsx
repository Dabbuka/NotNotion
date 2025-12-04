import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Home.css';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastModified'); // 'name', 'date', 'lastModified'
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Load current user and fetch notes on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    setCurrentUser(user);
    fetchNotes(user);
  }, []);

  // Filter and sort notes when search query, sortBy, or notes change
  useEffect(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort notes
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'lastModified':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    setFilteredNotes(sorted);
  }, [searchQuery, sortBy, notes]);

  

  const fetchNotes = async (userFromArg) => {
    try {
      const user = userFromArg || currentUser;
      if (!user?._id) return; // or redirect to login
  
      const response = await axios.get('/api/notes/all', {
        params: { userID: user._id },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
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


      const response = await axios.post('/api/notes/createNote', {
        title: newNoteTitle,
        content: '',
        userID: user._id,
      });
      
      // Add the new note to the list
      setNotes([response.data, ...notes]);
      setNewNoteTitle('');
      setShowNewNoteForm(false);
      
      // Navigate to the note editor
      navigate(`/app?noteId=${response.data._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note. Please try again.');
    }
  };

  const handleNoteClick = (noteId) => {
    navigate(`/app?noteId=${noteId}`);
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
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <div className="home-container">
      {/* Sidebar - Similar to Notion */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Quick Access</h3>
        </div>
        <div className="sidebar-content">
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
        {/* Header with Search, Sort and User */}
        <div className="home-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
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

          {currentUser && (
            <div className="user-greeting">
              <span>Welcome, <strong>{currentUser.username}</strong></span>
            </div>
          )}
        </div>

        {/* Add New Document Section */}
        <div className="new-document-section">
          {!showNewNoteForm ? (
            <button
              className="add-document-button"
              onClick={() => setShowNewNoteForm(true)}
            >
              + New Document
            </button>
          ) : (
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
        </div>

        {/* Documents Grid - Similar to GoodNotes */}
        <div className="documents-grid">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? (
                <p>No documents found matching "{searchQuery}"</p>
              ) : (
                <div>
                  <p className="empty-state-title">No documents yet</p>
                  <p className="empty-state-subtitle">Create your first document to get started</p>
                </div>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className="document-card"
                onClick={() => handleNoteClick(note._id)}
              >
                <div className="document-icon">📄</div>
                <div className="document-info">
                  <h3 className="document-title" title={note.title}>
                    {note.title}
                  </h3>
                  <p className="document-meta">
                    {formatDate(note.updatedAt)}
                  </p>
                  {note.content && (
                    <p className="document-preview">
                      {note.content.substring(0, 100)}
                      {note.content.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

