import express from "express";
import { createFolder, renameFolder, getFolder, addFolder } from "../controllers/folderController.js";
const router = express.Router();

router.post("/createFolder", createFolder);
router.get("/:id", getFolder);
router.patch("/renameFolder", renameFolder);
router.post("/addFolder", addFolder);

export default router;
