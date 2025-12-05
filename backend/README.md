# NotNotion Backend
This is the backend for the NotNotion note-taking application. It is built using Node.js, Express, and MongoDB. The backend provides an API that the frontend can call to create, read, update, and delete notes.

## Folder Structure

- **backend/**
  - **src/**
    - **controllers/** – Functions that handle incoming requests and responses
    - **models/** – MongoDB models
    - **routes/** – API route definitions
    - `server.js` – Main file that starts Express
    - `app.js` – Configures Express, middleware, and routes
  - `.env` –  environment variables, IGNORED BY GIT
  - `package.json` – Node.js project file
  - `README.md` – This file

## Starting the Server
Navigate to the backend directory and run:
```bash
npm install
```
This is so all dependencies are added to your local machine.

To start the backend:
```bash
npm start
```

You should see a message like:
```
Server running on port 3000
Connected to MongoDB
```

This means the backend is ready to accept requests from the frontend.

## API Routes

| Route                              | Method | Description                                    |
|-----------------------------------|--------|------------------------------------------------|
| **Notes**                         |        |                                                |
| /api/notes/createNote             | POST   | Create a new note                              |
| /api/notes/all                    | GET    | Get all notes for a user (requires userID query param) |
| /api/notes/:id                    | GET    | Get a single note by ID                        |
| /api/notes/:id                    | PATCH  | Update a note by ID                            |
| /api/notes/user/:userId           | GET    | Get the most recent note for a user            |
| /api/notes/user/:userId/:title    | GET    | Get a note by user ID and title                |
| **Users**                         |        |                                                |
| /api/users/register               | POST   | Register a new user                            |
| /api/users/login                  | POST   | Log in a user (returns JWT token)             |
| /api/users/me                     | GET    | Retrieve current user information              |
| **Folders**                       |        |                                                |
| /api/folders/createFolder         | POST   | Create a new folder                            |
| /api/folders/:id                  | GET    | Get a folder by ID                             |
| /api/folders/renameFolder         | PATCH  | Rename a folder                                |
| /api/folders/addFolder            | POST   | Add a folder                                   |
