# NotNotion Backend
This is the backend for the NotNotion note-taking application. It is built using Node.js, Express, and MongoDB. The backend provides an API that the frontend can call to create, read, update, and delete notes.

## Folder Structure
backend/
│
├─ src/
│   ├─ controllers/      # Functions that handle incoming requests and responses
│   ├─ models/           # MongoDB models (define the shape of data like Notes or Users)
│   ├─ routes/           # API route definitions (maps URLs to controller functions)
│   ├─ server.js         # Main file that starts the Express server
│   └─ app.js            # Configures Express, middleware, and routes
│
├─ .env                  # Stores secret environment variables (like DB URL), ignored by git
├─ package.json          # Node.js project file with dependencies and scripts
└─ README.md             # This file

## Starting the Server

To start the backend:
    npm start

You should see a message like:

Server running on port 5000
Connected to MongoDB

This means the backend is ready to accept requests from the frontend.

## API Routes

Here’s an overview of the main routes:

Route               Method	    Description
/api/notes	        GET	        Get all notes
/api/notes	        POST	    Create a new note
/api/notes/:id	    PUT	        Update a note by ID -- TODO
/api/notes/:id	    DELETE	    Delete a note by ID -- TODO
/api/users/register	POST	    Register a new user -- TODO
/api/users/login	POST	    Log in a user (returns JWT) -- TODO