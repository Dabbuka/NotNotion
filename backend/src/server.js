//Imports

import connectDB from "./config/db.js";
import app from "./app.js";


//Establish access to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server initialized and running on port ${PORT}`);
});



router.post("/createFolder", createFolder);
router.get("/:id", getFolder);
router.patch("/renameFolder", renameFolder);
router.post("/addNotes", addNote);
