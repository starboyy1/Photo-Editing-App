import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./component/Sidebar";
import "./component/Sidebar.css";
import Header from "./component/Header";
import { SketchPicker } from "react-color";

function App() {
  // Image uploading
  const inputElement = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);

  // For tool activation
  const [activeState, setActiveState] = useState(null);

  // Marker and line drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2); // Default line width
  const [currentColor, setCurrentColor] = useState("#000000"); // Default color
  const [startPos, setStartPos] = useState(null);
  const [zoomScale, setZoomScale] = useState(1); // Zoom scale for image
  // Text input and position
  const [textValue, setTextValue] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Font change
  const [selectedFont, setSelectedFont] = useState("Arial");
 // Upload image
  const handleOnClick = () => {
    inputElement.current.click();
  };
  const uploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          imgRef.current = img; // Set imgRef to the loaded image
          redrawImage(scale); // Draw the image with the initial scale
        };
        setImgSrc(reader.result); // Set image source for undo functionality
      };
      reader.readAsDataURL(file);
    }
  };
  
  const zoomIn = () => {
    const zoomAmount = 0.1; // Amount to zoom in
    setScale((prevScale) => {
      const newScale = prevScale + zoomAmount; // Increase scale for zoom in
      redrawImage(newScale); // Redraw the image with the new scale
      return newScale; // Update the scale state
    });
  };
  
  // Zoom out function
  const zoomOut = () => {
    const zoomAmount = 0.1; // Amount to zoom out
    setScale((prevScale) => {
      const newScale = Math.max(prevScale - zoomAmount, 0.1); // Decrease scale for zoom out, prevent it from going below 0.1
      redrawImage(newScale); // Redraw the image with the new scale
      return newScale; // Update the scale state
    });
  };
  // Redraw the image on the canvas with the current scale
  const redrawImage = (currentScale) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    
    if (imgRef.current) {
      // Set the canvas size based on the scaled image size
      canvas.width = imgRef.current.width * currentScale;
      canvas.height = imgRef.current.height * currentScale;
  
      // Draw the image based on the current scale
      ctx.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.width * currentScale,
        imgRef.current.height * currentScale
      );
    }
  };
  
  useEffect(() => {
    if (imgSrc && imgRef.current) {
      redrawImage(scale); // Redraw the image with the current scale whenever imgSrc changes
    }
  }, [imgSrc]);

  // Handle font change
  const handleFontChange = (font) => {
    setSelectedFont(font);
  };

  // Handle tool activation
  const handleIconClick = (iconName) => {
    setActiveState(iconName);
    console.log(iconName, "is now active");
    
    // Call zoom functions based on active state
    if (iconName === "zoomIn") {
      zoomIn(); // Trigger zoom in
    } else if (iconName === "zoomOut") {
      zoomOut(); // Trigger zoom out
    }
  };

  // Start drawing (marker or line)
  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (activeState === "marker" && event.button === 0) {
      setIsDrawing(true);
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      draw(event); // Call draw to start drawing immediately
    }
    if (activeState === "line" && event.button === 0) {
      setStartPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  // Stop drawing
  const stopDrawing = (event) => {
    if (activeState === "marker" && isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
      setIsDrawing(false);
    }
    if (activeState === "line" && startPos) {
      const rect = canvasRef.current.getBoundingClientRect();
      const endPos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      drawStraightLine(startPos, endPos);
      setStartPos(null);
    }
  };

  // Drawing functions
  const draw = (event) => {
    if (!isDrawing || activeState !== "marker") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
  };

  const drawStraightLine = (startPos, endPos) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = currentColor;
    ctx.stroke();
  };

  // Resize image on canvas
  useEffect(() => {
    if (imgSrc) {
      const canvas = canvasRef.current;
      const img = new Image();
      img.src = imgSrc;

      img.onload = () => {
        const container = canvas.parentElement;
        const maxWidth = container.clientWidth;

        const imgWidth = img.width;
        const imgHeight = img.height;

        const scale = Math.min(maxWidth / imgWidth, 1);

        canvas.width = imgWidth * scale * zoomScale;
        canvas.height = imgHeight * scale * zoomScale;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [imgSrc, zoomScale]);

  // Handle color change
  const handleOnChange = (color) => {
    setCurrentColor(color.hex);
  };

  // Undo function
  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  // Draggable text logic
  const handleMouseDown = (event) => {
    if (activeState === "text") {
      setIsDragging(true);
      const offsetX = event.clientX - textPosition.x;
      const offsetY = event.clientY - textPosition.y;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      setTextPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Handle text input keypress
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.font = `20px ${selectedFont}`;
      ctx.fillStyle = currentColor;

      if (textPosition.x && textPosition.y) {
        ctx.fillText(textValue, textPosition.x, textPosition.y);
      }

      setActiveState(null);
      setTextValue("");
    }
  };

  useEffect(() => {
    if (activeState === "text") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [activeState, textValue, textPosition, currentColor]);

  // Save image logic
  const saveImage = () => {
    const canvas = canvasRef.current;
    const combinedCanvas = document.createElement("canvas");
    const ctx = combinedCanvas.getContext("2d");

    const image = new Image();
    image.src = imgSrc;

    image.onload = () => {
      const imgWidth = image.width;
      const imgHeight = image.height;

      combinedCanvas.width = imgWidth * zoomScale;
      combinedCanvas.height = imgHeight * zoomScale;

      ctx.drawImage(image, 0, 0, combinedCanvas.width, combinedCanvas.height);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

      const dataURL = combinedCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "edited-image.png";
      link.click();
    };
  };

  return (
    <>
      <div className="container-fluid main-container">
        <Header
          click={handleOnClick}
          undo={handleUndo}
          saveImage={saveImage}
          onFontChange={handleFontChange}
        />
        <div className="row">
          <div className="sidebar-menu col-md-1 col-lg-1 col-2">
            <Sidebar activeState={activeState} setActiveState={handleIconClick} />
          </div>
          <div
            className="col-lg-7 col-md-7 col-7 img-container "
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="edit-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              style={{
                overflow : 'auto'
              }}
            />
            {activeState === "text" && (
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onMouseDown={handleMouseDown}
                style={{
                  position: "absolute",
                  top: textPosition.y,
                  left: textPosition.x,
                  zIndex: 1,
                }}
              />
            )}
          </div>
          <div className="col-lg-2 col-md-1 col-1 ">
            <h5>Color Picker</h5>
            <SketchPicker
              color={currentColor}
              onChangeComplete={handleOnChange}
            />
            <div className="line-width-options">
              <h5>Select Line Width</h5>
              <button className="mx-1" onClick={() => setLineWidth(2)}>
                Thin
              </button>
              <button className="mx-1" onClick={() => setLineWidth(5)}>
                Medium
              </button>
              <button className="mx-1" onClick={() => setLineWidth(10)}>
                Thick
              </button>
              {/* <input
              type="range"
              min="20"
              max="200"
              value={zoomValue}
              onChange={handleZoomChange}
              className="zoom-slider"
            />
            <span>{zoomValue}%</span> */}
            </div>
          </div>

        </div>
        <input
          type="file"
          ref={inputElement}
          style={{ display: "none" }}
          onChange={uploadImage}
        />
      </div>
    </>
  );
}

export default App;
