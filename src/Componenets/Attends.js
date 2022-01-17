import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

export default function Attends() {
  const navigate = useNavigate();
  const { docId } = useParams(); //useParam React Router Hook to manage Urls
  const [attemps, setAttemps] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "survey", docId, "attemps"),
      orderBy("timestamp")
    );
    onSnapshot(q, (querySnapshot) => {
      //getting data realtime by snapshot
      setAttemps([]);
      let attendResult;
      querySnapshot.forEach((doc) => {
        //pushing all data in to allSurvey's array
        if (doc.data().trueArr.length >= doc.data().passCrit) {
          attendResult = "Pass";
        } else {
          attendResult = "Fail";
        }
        let data = { ...doc.data(), id: doc.id, attendResult };
        setAttemps((val) => [...val, data]);
      });
    });
  }, []);

  return (
    <div id="attemps" style={{ borderLeft: "1px solid #615f5f" }}>
      {attemps.map((e) => {
        return (
          <div className="attempList" key={e.id}>
            <div style={{ width: "25%", borderLeft: "1px solid #615f5f" }}>
              {e.info.username}
            </div>
            <div style={{ width: "25%" }}>{e.info.email}</div>
            <div style={{ width: "10%" }}>{e.attendResult}</div>
            <div style={{ width: "30%" }}>{e.time}</div>
            <div style={{ width: "10%", padding: "3px" }}>
              <button
                onClick={() => {
                  navigate(`/result/${docId}/${e.id}`);
                }}
                className="btn btn-primary"
              >
                Open
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
