//Imports
require("dotenv").config();
const connectDB = require("./config/db");
const app = require('./app');


//Establish access to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server initialized and running on port ${PORT}`);
});