import React, { useEffect, useState } from "react";
import { db } from "./FirebaseConfig";
import { useParams } from "react-router";
import AddQuestion from "./AddQuestion";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Attends from "./Attends";

export default function Survey() {
  const { docId } = useParams(); // Getting Params For Unique Survey
  const [ques, setQues] = useState([]); // State to manage all question of survey
  const [result, setResult] = useState(false); // to visible results

  useEffect(() => {
    //query to get all question of survey
    const q = query(
      collection(db, "survey", docId, "questions"),
      orderBy("timestamp")
    );
    onSnapshot(q, (querySnapshot) => {
      setQues([]);
      querySnapshot.forEach((doc) => {
        // mergeing doc.id with data for dynamic keys
        let data = { ...doc.data(), queId: doc.id };
        setQues((val) => [...val, data]);
      });
    });
  }, []);
  return (
    <>
      {result ? (
        <Attends />
      ) : (
        <>
          <AddQuestion />
          <div id="allQues">
            {ques.map((e, index) => {
              return (
                <div className="servQus" key={e.queId + index}>
                  <p>Question : {e.question}</p>
                  <p>Type : {e.type} </p>
                  <p>Question Type : {e.questionType} </p>
                  {e.type === "Multiple" && (
                    <>
                      {e.options.map((element, ind) => {
                        return (
                          <p key={ind}>
                            Option No {ind + 1} : {element.option}
                          </p>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0px",
            }}
          ></div>
        </>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "15px 0px",
        }}
      >
        <button
          onClick={() => {
            setResult(!result);
          }}
          className="btn btn-warning"
        >
          {result ? "Back To Question" : "Show Results"}
        </button>
      </div>
    </>
  );
}
