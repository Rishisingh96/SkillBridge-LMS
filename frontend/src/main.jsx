import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

import { store, persistor } from "./redux/slices/store.js";

import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "./context/ThemeContext";

import { HelmetProvider } from "react-helmet-async";

import GoogleAnalytics from "./components/seo/GoogleAnalytics";

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider>
            <PersistGate loading={null} persistor={persistor}>
              <GoogleAnalytics measurementId={import.meta.env.VITE_GA_MEASUREMENT_ID} />
              <App />
            </PersistGate>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);