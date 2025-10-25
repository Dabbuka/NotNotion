# NotNotion
A user-friendly note-taking app made for UCLA's CS35L class.

Accessible over web browser, utilizing a markdown-based note-taking mechanism that allows for various typesetting options, picture insertion, and the organization of user pages for future access and synced to a database for safekeeping.

## Build Instructions 
Follow these steps to clone the repository and run the application locally.

### Prerequisites
You must have **Node.js** installed locally on your computer. The installation script can be found [here](https://nodejs.org/en/download).

### Local Setup
1. **Install Dependencies:**
   Navigate into the project directory after cloning the repo and install all Node packages required for the frontend:
   ```bash
   cd NotNotion/frontend
   npm install
   ```
   > This step downloads all packages listed in `package.json`

2. **Run the Application:**
   While still in the `/NotNotion/frontend` directory, start the development server:
   ```bash
   npm run dev
   ```
   The application should now be accessible in your browser, typically at `http://localhost:5173/` (default port for Vite).


## Planned features:
* Typography
* User login
  * Basic authentication using OAuth
* Folder creation
* Picture insertion
* Bulleted and numbered lists
* Tables
* Hyperlinking
* Split-screen and split-columns
