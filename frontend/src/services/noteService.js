import api from './api';

/**
 * Note service - handles all note-related API calls
 */
const noteService = {
  /**
   * Fetch all notes for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Array>} Array of notes
   */
  async getAllNotes(userId) {
    const response = await api.get('/notes/all', {
      params: { userID: userId },
    });
    return response.data;
  },

  /**
   * Fetch a single note by ID
   * @param {string} noteId - The note's ID
   * @returns {Promise<Object>} The note object
   */
  async getNoteById(noteId) {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  },

  /**
   * Fetch the most recent note for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Object>} The most recent note
   */
  async getMostRecentNote(userId) {
    const response = await api.get(`/notes/user/${userId}`);
    return response.data;
  },

  /**
   * Create a new note
   * @param {Object} noteData - The note data { title, content, userID, folderID? }
   * @returns {Promise<Object>} The created note
   */
  async createNote(noteData) {
    const response = await api.post('/notes/createNote', noteData);
    return response.data;
  },

  /**
   * Update an existing note
   * @param {string} noteId - The note's ID
   * @param {Object} updateData - The data to update { title?, content? }
   * @returns {Promise<Object>} The updated note
   */
  async updateNote(noteId, updateData) {
    const response = await api.patch(`/notes/${noteId}`, updateData);
    return response.data;
  },

  /**
   * Delete a note
   * @param {string} noteId - The note's ID
   * @returns {Promise<void>}
   */
  async deleteNote(noteId) {
    await api.delete(`/notes/${noteId}`);
  },
};

export default noteService;

