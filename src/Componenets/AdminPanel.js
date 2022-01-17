import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./FirebaseConfig";
import { addSurvey } from "./FirebaseFunctions";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router";

export default function AdminPanel() {
  const [surveyName, setSurveyName] = useState(""); // state for survey name
  const [allSurveys, setAllSurvey] = useState([]); // state for getting user created survey
  const navigate = useNavigate(); // React Router Hook to navigate user

  useEffect(() => {
    // getting current user to show user's crated survey
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        //query for getting data of survey from firestore
        const q = query(
          collection(db, "survey"),
          where("createdByUser", "==", uid),
          orderBy("timestamp")
        );
        onSnapshot(q, (querySnapshot) => {
          //getting data realtime by snapshot
          setAllSurvey([]);
          querySnapshot.forEach((doc) => {
            //pushing all data in to allSurvey's array
            let data = { ...doc.data(), docId: doc.id };
            setAllSurvey((val) => [...val, data]);
          });
        });
      }
    });
  }, []);

  return (
    <>
      <h4 className="heading">Welcome to COVID 19 Survey Web App</h4>
      <input
        type="text"
        onChange={(e) => setSurveyName(e.target.value)}
        placeholder="Enter Your Survey Name"
      />
      <button className="btn btn-primary" onClick={() => addSurvey(surveyName)}>
        Create Survey
      </button>
      <button className="btn btn-danger">Sign Out</button>

      <div id="allServ">
        {allSurveys.length !== 0 && (
          <>
            {allSurveys.map((e, index) => {
              return (
                <div
                  onClick={() => navigate(`./${e.docId}`)}
                  className="surv"
                  key={index + e.surveyName}
                >
                  <p>{e.surveyName}</p>
                  <p style={{ fontSize: "17px", textAlign: "end" }}>
                    Created On : {e.time}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
