# NotNotion Backend
This is the backend for the NotNotion note-taking application. It is built using Node.js, Express, and MongoDB. The backend provides an API that the frontend can call to create, read, update, and delete notes.

## Folder Structure

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
    npm install
This is so all dependencies are added to your local machine.

To start the backend:
    npm start

You should see a message like:
Server running on port 5000\
Connected to MongoDB


This means the backend is ready to accept requests from the frontend.

## API Routes

| Route               | Method | Description                        |
|-------------------- |------- |-----------------------------------|
| /api/notes          | GET    | Get all notes                      |
| /api/notes          | POST   | Create a new note                  |
| /api/notes/:id      | PUT    | Update a note by ID -- TODO        |
| /api/notes/:id      | DELETE | Delete a note by ID -- TODO        |
| /api/users/register | POST   | Register a new user -- TODO        |
| /api/users/login    | POST   | Log in a user (returns JWT) -- TODO |
