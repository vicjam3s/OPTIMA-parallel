import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";

import "./styles/index.css"
import "./styles/layout.css";
import "./styles/buttons.css";

import "./styles/landing.css";
import "./styles/notes.css";
import "./styles/focus.css";
import "./styles/library.css";
import "./styles/movies.css";
import "./styles/music.css";
import "./styles/news.css";
import "./styles/settings.css";
import "./styles/responsiveness.css"
import "./styles/calendar.css"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MusicProvider>
            <App />
          </MusicProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


