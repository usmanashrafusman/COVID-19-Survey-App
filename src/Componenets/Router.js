import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./Home";
import From from "./Form";
import AdminForm from "./AdminForm";
import AdminPanel from "./AdminPanel";
import Survey from "./Survey";
import UserSurvey from "./UserSurvey";
import SurveyUI from "./SurveyUI";
import Result from "./Result";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/form" element={<From />} />
        <Route exact path="/adminfrom" element={<AdminForm />} />
        <Route exact path="/survey" element={<AdminPanel />} />
        <Route exact path="/survey/:docId" element={<Survey />} />
        <Route exact path="/allsurvey" element={<UserSurvey />} />
        <Route exact path="/allsurvey/:docId" element={<SurveyUI />} />
        <Route exact path="/result/:docId/:docID" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
