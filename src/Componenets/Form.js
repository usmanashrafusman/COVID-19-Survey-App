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
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="Enter Your Name"
      />
      <input
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter Your Email"
      />
      <button className="btn btn-primary" onClick={submit}>
        Answere Survey
      </button>
    </>
  );
}
