import Folder from "../models/folder.js";

//POST
export const createFolder = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please include a title" });
    }

    const newFolder = new Folder({
      title: title,
      content: content,
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
    const Folder = await Folder.findById(req.params.id);  // find note by id, from /:id
    res.json(Folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//PATCH
export const renameFolder = async(req, res) => {
  const id = req.params.id;
  const { newTitle } = req.body;
  
  if (!newTitle) {
    return res.status(400).json({ error: "newTitle required" });
  }

  console.log("Renaming folder", id, "to", newTitle);


  return res.status(200).json({ success: true });
};


export const addFolder = async(req, res) =>{
  console.log("hey");
}

