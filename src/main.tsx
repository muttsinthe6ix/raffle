import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

const ROOT = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(ROOT).render(
  <StrictMode>
    <App />
  </StrictMode>
);
