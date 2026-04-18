import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Dark mode — localStorage dan o'qib sahifaga qo'llash
const darkMode = localStorage.getItem("darkMode") === "true";
if (darkMode) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
