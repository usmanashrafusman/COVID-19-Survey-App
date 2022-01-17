import React from "react";

export default function Dropdown(props) {
  return (
    <div className="main">
      <p className="type">Question Type</p>
      <select onChange={props.type} className="dropdown-menu select">
        <option value="Data" className="dropdown-item">
          Data
        </option>
        <option value="Single" className="dropdown-item">
          Single
        </option>
        <option value="Multiple" className="dropdown-item">
          Multiple
        </option>
      </select>
      <button
        onClick={props.setQue}
        className="btn btn-primary"
        style={{ width: "30%" }}
      >
        + Add Question
      </button>
    </div>
  );
}
