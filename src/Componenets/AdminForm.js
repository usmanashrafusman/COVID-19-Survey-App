import React, { useState } from "react";
import { useNavigate } from "react-router";
import { signUp, signIn } from "./FirebaseFunctions";

export default function AdminForm() {
  const [email, setEmail] = useState(""); //State For Email
  const [password, setPassword] = useState(""); // State For Password
  const navigate = useNavigate(); // Use Navigate React Router Hook To Navigate User

  //SignIn User Using Exported Function
  const signInUser = () => {
    signIn(email, password, navigate);
  };

  //SignUp User Using Exported Function
  const signUpUser = () => {
    signUp(email, password, navigate);
  };

  return (
    <>
      <div className="form">
        <h4 className="heading">Login to Create or Manage Survey</h4>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          className="my-2"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="my-2"
        />
        <button className="btn btn-primary my-2" onClick={signUpUser}>
          Sign Up
        </button>
        <button className="btn btn-primary my-2" onClick={signInUser}>
          Sign In
        </button>
      </div>
    </>
  );
}
