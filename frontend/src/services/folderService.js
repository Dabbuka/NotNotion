import api from './api';

/**
 * Folder service - handles all folder-related API calls
 */
const folderService = {
  /**
   * Fetch all folders for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Array>} Array of folders
   */
  async getAllFolders(userId) {
    const response = await api.get('/folders/all', {
      params: { userID: userId },
    });
    return response.data;
  },

  /**
   * Fetch folder contents (items inside a folder)
   * @param {string} folderId - The folder's ID
   * @returns {Promise<Object>} Folder contents with items array
   */
  async getFolderContents(folderId) {
    const response = await api.get(`/folders/${folderId}/contents`);
    return response.data;
  },

  /**
   * Create a new folder
   * @param {Object} folderData - The folder data { title, userID, parentFolderID? }
   * @returns {Promise<Object>} The created folder
   */
  async createFolder(folderData) {
    const response = await api.post('/folders/createFolder', folderData);
    return response.data;
  },

  /**
   * Add an item to a folder
   * @param {string} folderId - The folder's ID
   * @param {string} itemId - The item's ID to add
   * @param {string} itemType - The type of item ('Note' or 'Folder')
   * @returns {Promise<Object>} The updated folder
   */
  async addItemToFolder(folderId, itemId, itemType) {
    const response = await api.post(`/folders/${folderId}/addItem`, {
      itemId,
      itemType,
    });
    return response.data;
  },

  /**
   * Delete a folder
   * @param {string} folderId - The folder's ID
   * @returns {Promise<void>}
   */
  async deleteFolder(folderId) {
    await api.delete(`/folders/${folderId}`);
  },
};

export default folderService;

