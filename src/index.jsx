import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tokens.css";
import "./index.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/themes.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
