import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services';
import { authService } from '../services';

/**
 * Custom hook for notes management
 * Fetches and manages notes for the current user
 */
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = authService.getCurrentUserId();

  /**
   * Fetch all notes for the current user
   */
  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await noteService.getAllNotes(userId);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Create a new note
   * @param {string} title - Note title
   * @param {string} content - Note content
   * @param {string} folderId - Optional folder ID
   * @returns {Promise<Object>} The created note
   */
  const createNote = useCallback(async (title, content = '', folderId = null) => {
    if (!userId) {
      throw new Error('User not logged in');
    }

    const noteData = {
      title,
      content,
      userID: userId,
    };

    if (folderId) {
      noteData.folderID = folderId;
    }

    const newNote = await noteService.createNote(noteData);
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, [userId]);

  /**
   * Update an existing note
   * @param {string} noteId - Note ID
   * @param {Object} updateData - Data to update { title?, content? }
   * @returns {Promise<Object>} The updated note
   */
  const updateNote = useCallback(async (noteId, updateData) => {
    const updatedNote = await noteService.updateNote(noteId, updateData);
    setNotes(prev => prev.map(note => 
      note._id === noteId ? { ...note, ...updateData } : note
    ));
    return updatedNote;
  }, []);

  /**
   * Delete a note
   * @param {string} noteId - Note ID
   */
  const deleteNote = useCallback(async (noteId) => {
    await noteService.deleteNote(noteId);
    setNotes(prev => prev.filter(note => note._id !== noteId));
  }, []);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}

export default useNotes;

