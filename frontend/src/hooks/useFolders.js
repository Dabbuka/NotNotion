import { useState, useEffect, useCallback } from 'react';
import { folderService } from '../services';
import { authService } from '../services';

/**
 * Custom hook for folders management
 * Fetches and manages folders for the current user
 */
export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = authService.getCurrentUserId();

  /**
   * Fetch all folders for the current user
   */
  const fetchFolders = useCallback(async () => {
    if (!userId) {
      setFolders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await folderService.getAllFolders(userId);
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetch folder contents
   * @param {string} folderId - Folder ID
   * @returns {Promise<Object>} Folder contents
   */
  const fetchFolderContents = useCallback(async (folderId) => {
    try {
      return await folderService.getFolderContents(folderId);
    } catch (err) {
      console.error('Error fetching folder contents:', err);
      throw err;
    }
  }, []);

  /**
   * Create a new folder
   * @param {string} title - Folder title
   * @param {string} parentFolderId - Optional parent folder ID
   * @returns {Promise<Object>} The created folder
   */
  const createFolder = useCallback(async (title, parentFolderId = null) => {
    if (!userId) {
      throw new Error('User not logged in');
    }

    const folderData = {
      title,
      userID: userId,
    };

    if (parentFolderId) {
      folderData.parentFolderID = parentFolderId;
    }

    const newFolder = await folderService.createFolder(folderData);
    setFolders(prev => [newFolder, ...prev]);
    return newFolder;
  }, [userId]);

  /**
   * Add an item to a folder
   * @param {string} folderId - Folder ID
   * @param {string} itemId - Item ID to add
   * @param {string} itemType - Type of item ('Note' or 'Folder')
   */
  const addItemToFolder = useCallback(async (folderId, itemId, itemType) => {
    await folderService.addItemToFolder(folderId, itemId, itemType);
  }, []);

  /**
   * Delete a folder
   * @param {string} folderId - Folder ID
   */
  const deleteFolder = useCallback(async (folderId) => {
    await folderService.deleteFolder(folderId);
    setFolders(prev => prev.filter(folder => folder._id !== folderId));
  }, []);

  /**
   * Get root level folders (no parent)
   * @returns {Array} Root folders
   */
  const getRootFolders = useCallback(() => {
    return folders.filter(folder => 
      folder.parentFolderID === null || folder.parentFolderID === undefined
    );
  }, [folders]);

  /**
   * Get child folders of a parent
   * @param {string} parentId - Parent folder ID
   * @returns {Array} Child folders
   */
  const getChildFolders = useCallback((parentId) => {
    const parentIdStr = parentId ? parentId.toString() : null;
    return folders.filter(folder => {
      const folderParentId = folder.parentFolderID ? folder.parentFolderID.toString() : null;
      return folderParentId === parentIdStr;
    });
  }, [folders]);

  /**
   * Build breadcrumb trail from a folder to root
   * @param {string} folderId - Starting folder ID
   * @returns {Array} Breadcrumb array [{id, title}, ...]
   */
  const getBreadcrumbs = useCallback((folderId) => {
    if (!folderId) return [];
    
    const breadcrumbs = [];
    let currentId = folderId.toString();
    const folderMap = new Map(folders.map(f => [f._id.toString(), f]));
    
    while (currentId) {
      const folder = folderMap.get(currentId);
      if (!folder) break;
      breadcrumbs.unshift({ id: folder._id, title: folder.title });
      currentId = folder.parentFolderID ? folder.parentFolderID.toString() : null;
    }
    
    return breadcrumbs;
  }, [folders]);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    fetchFolders,
    fetchFolderContents,
    createFolder,
    addItemToFolder,
    deleteFolder,
    getRootFolders,
    getChildFolders,
    getBreadcrumbs,
  };
}

export default useFolders;

