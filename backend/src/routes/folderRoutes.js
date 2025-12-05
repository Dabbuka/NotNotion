import express from "express";
import { 
  createFolder, 
  renameFolder, 
  getFolder, 
  getAllFolders,
  getFolderContents,
  addItemToFolder,
  removeItemFromFolder
} from "../controllers/folderController.js";
const router = express.Router();

router.post("/createFolder", createFolder);
router.get("/all", getAllFolders);
router.get("/:id/contents", getFolderContents);
router.post("/:id/addItem", addItemToFolder);
router.delete("/:id/removeItem", removeItemFromFolder);
router.patch("/:id/rename", renameFolder);
router.get("/:id", getFolder);

export default router;
