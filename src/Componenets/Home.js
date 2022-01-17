import React from "react";
import { useNavigate } from "react-router";

export default function Home() {
  // React Router Hook useNavigate to Navigate User
  const navigate = useNavigate();

  const createSurvey = () => {
    // Navigating user to login or signup form
    navigate("./adminfrom");
  };

  const ansSurvey = () => {
    // Navigating user to all survey's view
    navigate("./form");
  };

  return (
    <div>
      <h4 className="heading">COVID 19 Survey </h4>
      <button className="btn btn-primary" onClick={ansSurvey}>
        Answer Survey
      </button>
      <button className="btn btn-primary" onClick={createSurvey}>
        Create Survey
      </button>
    </div>
  );
}
