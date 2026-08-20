import React from "react"; 

import ReactDOM from "react-dom/client"; 

import App from "./App.jsx"; 

import "./index.css"; 

  

if (typeof navigator !== "undefined" && "clearAppBadge" in navigator) { 

  navigator.clearAppBadge().catch(() => {}); 

} 

  

ReactDOM.createRoot(document.getElementById("root")).render( 

  <React.StrictMode> 

    <App /> 

  </React.StrictMode> 

); 

  
