/**
 * Helper functions for working with folder/note items
 */

/**
 * Determine if an item is a folder
 * @param {Object} item - The item to check
 * @returns {boolean} True if the item is a folder
 */
export function isFolder(item) {
  return item.itemType === 'Folder' || item.isFolder === true;
}

/**
 * Extract item data from a potentially nested item structure
 * @param {Object} item - The item (may have nested .item property)
 * @returns {Object} The actual item data
 */
export function getItemData(item) {
  return item.item || item;
}

/**
 * Get item ID from an item object
 * @param {Object} item - The item
 * @returns {string} The item's ID
 */
export function getItemId(item) {
  const data = getItemData(item);
  return data._id || data;
}

/**
 * Get item title from an item object
 * @param {Object} item - The item
 * @returns {string} The item's title
 */
export function getItemTitle(item) {
  const data = getItemData(item);
  return data.title || 'Untitled';
}

/**
 * Get item date from an item object
 * @param {Object} item - The item
 * @param {string} dateField - Which date field to get ('updatedAt' or 'createdAt')
 * @returns {string|null} The date string
 */
export function getItemDate(item, dateField = 'updatedAt') {
  const data = getItemData(item);
  return data[dateField] || null;
}

/**
 * Sort items by various criteria
 * @param {Array} items - Array of items to sort
 * @param {string} sortBy - Sort criteria ('name', 'date', 'lastModified')
 * @returns {Array} Sorted array
 */
export function sortItems(items, sortBy = 'lastModified') {
  return [...items].sort((a, b) => {
    const aData = getItemData(a);
    const bData = getItemData(b);
    
    const aTitle = aData.title || '';
    const bTitle = bData.title || '';
    const aDate = aData.updatedAt || new Date();
    const bDate = bData.updatedAt || new Date();
    const aCreated = aData.createdAt || new Date();
    const bCreated = bData.createdAt || new Date();

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
}

/**
 * Filter items by search query
 * @param {Array} items - Array of items to filter
 * @param {string} searchQuery - The search query
 * @returns {Array} Filtered array
 */
export function filterItemsBySearch(items, searchQuery) {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase();
  return items.filter(item => {
    const data = getItemData(item);
    const title = (data.title || '').toLowerCase();
    const content = (data.content || '').toLowerCase();
    return title.includes(query) || content.includes(query);
  });
}

