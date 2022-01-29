import React, { useState } from "react";
import { useNavigate } from "react-router";
import { submitForm } from "./FirebaseFunctions";

export default function Form() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); //State For Username
  const [email, setEmail] = useState(""); // State For Email

  const submit = () => {
    // using imported function
    submitForm(username, email, navigate);
  };

  return (
    <>
    <div className="form">
    <h4 className="heading">Enter Your Name & Email To Attend Survey</h4>
      <div className="d-flex" style={{justifyContent:"center", alignItems:"center" , flexDirection:"column"}}>
        <input
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="Enter Your Name"
          className="my-2"
        />
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter Your Email"  className="my-2"
        />
        <button className="btn btn-primary my-2" onClick={submit}>
          Answere Survey
        </button>
      </div>
    </div>
    </>
  );
}
