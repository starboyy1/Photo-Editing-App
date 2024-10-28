import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import "./Sidebar.css"; // Import Sidebar-specific CSS

export default function Sidebar({ activeState, setActiveState }) {
  return (
    <div className="sidebar header-color d-flex flex-column Sidebar">
      {/* Marker Tool */}
      <i
        className={`bi bi-pencil-fill my-3 marker-icon ${
          activeState === "marker" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("marker")} // Set active state to "marker"
      ></i>

      {/* Crop Tool */}
      <i
        className={`bi bi-crop my-3 marker-icon ${
          activeState === "crop" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("crop")} // Set active state to "crop"
      ></i>

      {/* Text Tool */}
      <i
        className={`bi bi-fonts my-3 marker-icon ${
          activeState === "text" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("text")} // Set active state to "text"
      ></i>

      {/* Line Tool */}
      <i
        className={`bi bi-slash-lg my-3 marker-icon ${
          activeState === "line" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("line")} // Set active state to "line"
      ></i>

      {/* Zoom In Tool */}
      <i
        className={`bi bi-zoom-in my-3 marker-icon ${
          activeState === "zoomIn" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("zoomIn")} // Zoom in
      ></i>

      {/* Zoom Out Tool */}
      <i
        className={`bi bi-zoom-out my-3 marker-icon ${
          activeState === "zoomOut" ? "active-icon" : ""
        }`}
        onClick={() => setActiveState("zoomOut")} // Zoom out
      ></i>
    </div>
  );
}
