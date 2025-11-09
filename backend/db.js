const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const clientOptions = {
    serverAPI: {
        version: "1",
        strict: true,
        deprecationErrors: true
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log('Connected to MongoDB successfully!')
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB;