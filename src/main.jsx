import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { MusicProvider } from "./context/MusicContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MusicProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </MusicProvider>
  </React.StrictMode>
);


