import Folder from "../models/folder.js";
import Note from "../models/note.js";

//POST
export const createFolder = async (req, res) => {
  try {
    const { title, userID, parentFolderID } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please include a title" });
    }

    if (!userID) {
      return res.status(400).json({ message: "userID is required to create a folder" });
    }

    const newFolder = new Folder({
      title: title,
      userID: userID,
      parentFolderID: parentFolderID || null,
    });

    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//GET
export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.json(folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//GET all folders for a user
export const getAllFolders = async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ message: "userID is required" });
    }
    const folders = await Folder.find({ userID }).sort({ updatedAt: -1 });
    res.status(200).json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err.message);
    res.status(500).send("Server error");
  }
};

//GET folder contents with populated items
export const getFolderContents = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Populate items based on their type
    const populatedItems = await Promise.all(
      folder.items.map(async (item) => {
        if (item.itemType === 'Note') {
          const note = await Note.findById(item.item);
          return note ? { ...item.toObject(), item: note } : null;
        } else if (item.itemType === 'Folder') {
          const subFolder = await Folder.findById(item.item);
          return subFolder ? { ...item.toObject(), item: subFolder } : null;
        }
        return null;
      })
    );

    const folderWithContents = {
      ...folder.toObject(),
      items: populatedItems.filter(item => item !== null)
    };

    res.json(folderWithContents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//POST add item to folder
export const addItemToFolder = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const folderId = req.params.id;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "itemId and itemType are required" });
    }

    if (!['Note', 'Folder'].includes(itemType)) {
      return res.status(400).json({ message: "itemType must be 'Note' or 'Folder'" });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Verify the item exists and belongs to the same user
    let item;
    if (itemType === 'Note') {
      item = await Note.findById(itemId);
    } else {
      item = await Folder.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ error: `${itemType} not found` });
    }

    if (item.userID.toString() !== folder.userID.toString()) {
      return res.status(403).json({ error: "Item must belong to the same user" });
    }

    // Check if item is already in folder
    const existingItem = folder.items.find(
      i => i.item.toString() === itemId && i.itemType === itemType
    );

    if (existingItem) {
      return res.status(400).json({ message: "Item already in folder" });
    }

    // Add item to folder
    folder.items.push({ item: itemId, itemType });
    await folder.save();

    res.status(200).json(folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//DELETE remove item from folder
export const removeItemFromFolder = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const folderId = req.params.id;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "itemId and itemType are required" });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Remove item from folder
    folder.items = folder.items.filter(
      i => !(i.item.toString() === itemId && i.itemType === itemType)
    );
    await folder.save();

    res.status(200).json(folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//PATCH
export const renameFolder = async(req, res) => {
  try {
    const id = req.params.id;
    const { newTitle } = req.body;
    
    if (!newTitle) {
      return res.status(400).json({ error: "newTitle required" });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      { title: newTitle },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    return res.status(200).json(updatedFolder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
