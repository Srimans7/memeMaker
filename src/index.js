import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";


const rootStyle = {
  background: 'linear-gradient(to bottom, #b3d9ff, #ffffff)', // Light blue gradient background
  minHeight: '100vh', // Set minimum height to fill the viewport
};

ReactDOM.render(
  <React.StrictMode>
  <div style={rootStyle}>
    <App />
   </div>
  </React.StrictMode>,
  document.getElementById("root")
);


