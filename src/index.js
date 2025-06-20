import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './around-icons.min.css'
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { AppKitProvider } from './AppKitProvider';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
   <AppKitProvider>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      stacked
      />
      </AppKitProvider>
   
  </>
);

reportWebVitals();
