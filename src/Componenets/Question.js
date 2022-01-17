import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./FirebaseConfig";

export default function Question(props) {
  const { docId } = useParams(); //useParam React Router Hook to manage Urls
  const { id } = props;
  const [question, setQuestion] = useState(""); // state to manage questions

  useLayoutEffect(() => {
      //getting question which user answere by id props
    const ref = doc(db, "survey", docId, "questions", id);
    onSnapshot(ref, (doc) => {
      setQuestion(doc.data());
    });
  }, [id]);
  return (
    <>
      {question && (
        <div className="ques">
          <p>Question : {question.question}</p>
          <p>
            Type : {question.type} & {question.questionType}
          </p>
        </div>
      )}
    </>
  );
}
