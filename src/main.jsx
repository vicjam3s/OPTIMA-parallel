import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { FakeAuthProvider } from "./context/FakeAuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FakeAuthProvider>
        <App />
      </FakeAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


