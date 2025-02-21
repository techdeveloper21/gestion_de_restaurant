"use client";
import { useEffect } from "react";

 // Required for interactivity

export default function HeaderDropdown() {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js"); // Load Bootstrap JS once
    }, []);
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-success">Username</button>
        <button
          type="button"
          className="btn btn-success dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#">Action</a></li>
          <li><a className="dropdown-item" href="#">Another action</a></li>
          <li><a className="dropdown-item" href="#">Something else here</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Separated link</a></li>
        </ul>
      </div>
    );
}
