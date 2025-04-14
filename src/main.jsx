import "rc-slider/assets/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./App.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css";
import { store } from "./store/store.js";
import { ChatProvider } from "./context/ChatContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>

      <Provider store={store}>
        <App />
        <Toaster position="top-right" />
      </Provider>
     </AppProvider>
  </StrictMode>
);
