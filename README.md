# CampusFlow — Student Management System (Frontend)

A responsive student management dashboard built with **React + Vite**. It is a frontend demo and stores student changes in the browser using `localStorage`; it does not require a backend or database.

## Features
- Responsive dashboard with overview statistics
- Search students by name, email, ID, or course
- Filter by course and enrollment status
- Add, edit, and delete student records
- Export visible student records to CSV
- Browser persistence with `localStorage`
- Modern responsive layout with accessible labels

## Tech stack
- React 18
- Vite 6
- Lucide React icons
- CSS (no UI framework required)

## Run locally
1. Install [Node.js](https://nodejs.org/) (LTS recommended).
2. Extract this project ZIP.
3. Open the extracted `student-management-frontend` folder in VS Code.
4. Open the terminal in VS Code and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```

The production files are created in `dist/`.

## Publish to GitHub
Create a new **public** repository on GitHub (for example `student-management-system-frontend`). Do not add a README or `.gitignore` from GitHub if you already have these files in this folder. Then run these commands in the VS Code terminal:

```bash
git init
git add .
git commit -m "Build student management frontend with React and Vite"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-management-system-frontend.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If Git asks you to sign in, complete the browser authentication.

## Notes
- This project is frontend-only. Student records are saved in the current browser, not shared between users.
- The sample records are fictional demo data. Connect a backend/API and database for real multi-user use.
