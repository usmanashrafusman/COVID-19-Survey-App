import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router";
import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import Question from "./Question";

export default function Result() {
  const { docId, docID } = useParams(); //useParam React Router Hook to manage Urls
  const [attempResult, setAttempResult] = useState({});
  useLayoutEffect(() => {
      //Getting Data Of Attemped Sruvey From DB
    const ref = doc(db, "survey", docId, "attemps", docID);
    onSnapshot(ref, (doc) => {
      let attendResult;
      if (doc.data().trueArr.length >= doc.data().passCrit) {
        attendResult = "Pass";
      } else {
        attendResult = "Fail";
      }
      let data = { ...doc.data(), attendResult, id: doc.id };
      setAttempResult(data);
    });
  }, []);

  return (
    <>
      {attempResult.info && (
        <>
          <div id="resultDiv">
            <p>Name : {attempResult.info.username}</p>
            <p>Email : {attempResult.info.email}</p>
            <p>Time Attended : {attempResult.info.time}</p>
            <p>Result : {attempResult.attendResult}</p>
          </div>

          {attempResult.answeres && (
            <>
              {attempResult.answeres.map((e, index) => {
                return (
                  <div className="qna" key={e.queId}>
                    <Question id={e.queId} />

                    <div className="ans">
                      <p>Answere : {e.givenAns}</p>
                      <p>
                        {e.rightAns
                          ? "Right Answere"
                          : e.rightAns === null
                          ? "Data"
                          : "Wrong Answere"}
                      </p>
                    </div>
                    {e.comment !== "" && (
                      <div className="comment">
                        <p>Comment : {e.comment}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </>
  );
}
