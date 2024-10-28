import React from "react";
import logo from "./logo.png";
import { Dropdown } from "react-bootstrap";

export default function Header({ click, onFontChange, saveImage, undo }) {
  const fontList = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Trebuchet MS",
    "Comic Sans MS",
    "Impact",
    "Tahoma",
    "Lucida Console",
  ];

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="logo"
              width="30"
              height="30"
              className="d-inline-block align-text-top mx-2"
            />
            Photo Editing
          </a>
        </div>
        <div className="header-color container-fluid d-flex justify-content-start header-margin height-navbar">
          <a
            className="text-dark text-decoration-none header-content header-icon"
            href="#"
            onClick={click}
          >
            File
          </a>
          <a
            className="text-dark text-decoration-none header-content header-icon"
            href="#"
            onClick={saveImage}
          >
            Save
          </a>
          <a
            className="text-dark text-decoration-none header-content header-icon"
            href="#"
          >
            Option
          </a>
          <a
            className="text-dark text-decoration-none header-content header-icon"
            href="#"
            onClick={undo}
          >
            Undo
          </a>
          <a
            className="text-dark text-decoration-none header-content header-icon"
            href="#"
          >
            Square
          </a>

          {/* Dropdown for Fonts */}
          <Dropdown className="header-content header-icon">
            <Dropdown.Toggle
              as="a" // Use the dropdown as an anchor tag
              className="text-dark text-decoration-none  header-icon"
              id="dropdown-fonts"
              href="#"
            >
              Fonts
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {fontList.map((font, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => onFontChange(font)} // Pass selected font to App.js
                  style={{ fontFamily: font }}
                >
                  {font}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
    </>
  );
}
