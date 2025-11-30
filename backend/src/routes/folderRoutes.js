import express from "express";
import { createFolder, renameFolder, getFolder } from "../controllers/folderController.js";

const router = express.Router();

router.post("/createFolder", createFolder);
router.get("/:id", getFolder);
router.patch("/renameFolder", renameFolder);

export default router;
