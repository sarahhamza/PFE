import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { PrimeReactProvider } from "primereact/api";

ReactDOM.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <PrimeReactProvider>
      <App />
      </PrimeReactProvider>
    </DarkModeContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
