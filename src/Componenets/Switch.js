import React from "react";

export default function Switch(props) {
    // JSX for switch of fail/pass question & data
  return (
    <>
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
        Fail / Pass
      </label>
      <div className="form-check form-switch ">
        <input
          onChange={props.askQueTyp}
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          Data
        </label>
      </div>
    </>
  );
}
