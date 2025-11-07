import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { I18nProvider } from "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </HelmetProvider>
  </React.StrictMode>
);
