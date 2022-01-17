import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { useNavigate } from "react-router";

export default function UserSurvey() {
  const [allSurvey, setAllSurvey] = useState([]); // state to get all suvey's
  const navigate = useNavigate() // use nagivate hook to navigate user

  useEffect(() => {
    //getting all data 
    const q = query(collection(db, "survey"),orderBy("timestamp"))
    onSnapshot(q, (snapshot) => {
      setAllSurvey(snapshot.docs.map((doc)=>({...doc.data() , docId : doc.id})));
    });
  }, []);
  return (
    <div id="allServ">
      {allSurvey.map((e, i) => {
        return (
          <div className="surv" key={e.docId} onClick={()=>navigate(`/allsurvey/${e.docId}`)}>
            <p>{e.surveyName}</p>
            <div className="surInfo">
              <p>Created On : {e.time}</p>
              <p>Created By : {e.createdBy}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
