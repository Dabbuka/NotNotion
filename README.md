# NotNotion
A user-friendly note-taking app made for UCLA's CS35L class.

Accessible over web browser, utilizing a markdown-based note-taking mechanism that allows for various typesetting options, picture insertion, and the organization of user pages for future access and synced to a database for safekeeping.

## Build Instructions 
Follow these steps to clone the repository and run the application locally.

### Prerequisites
You must have the following installed on your computer:
- **Node.js** (v14 or higher) - Installation script can be found [here](https://nodejs.org/en/download)
- **MongoDB** - Installation guide can be found [here](https://www.mongodb.com/docs/manual/installation/)
- **Git** - For cloning the repository

### Local Setup
1. **Clone the Repository**
   Clone NotNotion to local machine:
   ```bash
   git clone https://github.com/Dabbuka/NotNotion
   ```
   Your local machine should now have the most up-to-date version of NotNotion.

2. **Install Frontend Dependencies:**
   Navigate into the project directory after cloning the repo and install all Node packages required for the frontend:
   ```bash
   cd NotNotion/frontend
   npm install
   ```
   This step downloads all packages listed in `package.json`

3. **Run the Application:**
   While still in the `/NotNotion/frontend` directory, start the development server:
   ```bash
   npm run dev
   ```
   The application should now be accessible in your browser, typically at `http://localhost:5173/` (default port for Vite).

4. **Install Backend Dependencies:**
   Navigate into project directory and install packages required for the backend:
   ```bash
   cd NotNotion/backend
   npm install
   ```
   This step downloads all packages required for the backend.

5. **Start backend Server:**
   Create a `.env` file in the `/NotNotion/backend` directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```
   While still in the `/NotNotion/backend` directory, start the backend server:
   ```bash
   npm start
   ```

## Features:
- **User Authentication** - Register and login with JWT tokens
- **Note Creation** - Create, read, update, and delete notes
- **Rich Text Editing** - Markdown-based editor with TipTap
- **Picture Insertion** - Drag and drop or paste images into notes
- **Typography Options** - Headings, bold, italic, strikethrough
- **Lists** - Bulleted and numbered lists
- **Search & Sort** - Search notes and sort by name, date, or last modified

## Testing
The project uses Playwright for end-to-end testing. To run tests:
```bash
cd frontend
npx playwright test
```

To run a specific test file:
```bash
npx playwright test auth.spec.ts
npx playwright test create-note.spec.ts
```

To run tests in headed mode (see the browser):
```bash
npx playwright test --headed
```

To run tests with UI mode:
```bash
npx playwright test --ui
```

**Note:** Make sure both the backend and frontend servers are running before executing tests.
