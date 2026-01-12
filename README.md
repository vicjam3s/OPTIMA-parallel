# Optima

Optima is a modern, productivity-focused web application designed to help users plan, organize, and optimize their daily tasks and workflows. The app emphasizes simplicity, performance, and a clean user experience while leveraging modern web development tools and best practices.It focuses on the requirements of the student and not just in studies but loads of entertainment as well.

---

## 🚀 Features

* **Task & Workflow Management** – Create, update, and manage tasks efficiently
* **Clean & Responsive UI** – Works seamlessly across desktop and mobile devices
* **Component-Based Architecture** – Easy to maintain and scale
* **State Management** – Predictable and efficient handling of app data
* **Reusable UI Components** – Promotes consistency and faster development
* **Fast Development Setup** – Optimized for modern tooling

---

## 🛠 Tech Stack

* **Frontend Framework:** React
* **Build Tool:** Vite
* **Styling:** normalCSS 
* **Language:** JavaScript (ES6+)
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
optima/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── assets/         # Images and static assets
│   ├── App.jsx         # Root component
│   └── main.jsx        # App entry point
├── public/             # Public assets
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/optima.git
   ```

2. **Navigate to the project folder**

   ```bash
   cd optima
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

The app will run locally on the port provided by Vite (usually `http://localhost:5173`), but using the live url from deployment, will run on project/vercel.com

---

## 🧠 Key Code Concepts Used

* **React Hooks** (`useState`, `useEffect`) for state and lifecycle management
* **Conditional Rendering** to dynamically update the UI
* **Props & Component Composition** for reusable components
* **Array Methods** (`map`, `filter`) for rendering data-driven UI
* **Separation of Concerns** between logic, layout, and styling

---

## 🚧 Challenges Faced

* Structuring components for scalability
* Managing shared state across components
* Debugging build and dependency issues
* Styling consistency across different screen sizes
* Optimizing performance while keeping the codebase readable
* Infinite re-rendering 

Each challenge helped reinforce best practices in React development and project organization.

---

## 🌱 Future Improvements

* User authentication
* Persistent storage (database or local storage)
* Advanced filtering and search
* Dark mode support
* Performance optimizations

---

## 📄 License

This project has no current license.

---

## 👤 Author

Developed as part of a learning and project-based workflow to explore modern React development and UI design best practices. Also to create something new, modern and fun for people who enjoy learning with additional motivation, and entertainment [;)]

---

## Before cloning, create a .env file and have the following in order to access APIs:
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GNEWS_API_KEY=your_gnews_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID= your_firebase_app_id

+Then restart server and reload on vercel

