import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  where,
  getDoc,
} from "firebase/firestore";
import { userReadableTime } from "./FirebaseFunctions";
import { db } from "./FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import Timer from "./Timer";

export default function SurveyUI() {
  const { docId } = useParams(); //useParam React Router Hook to manage Urls
  const [surveyQue, setSurveyQue] = useState([]); //
  const [lastVisible, setLastVisible] = useState({}); // state to paginate questions
  const [attempID, setAttempID] = useState(""); // user attempt id
  const [givenAns, setGivenAns] = useState(""); // user's given ans
  const [firstQue, setFirstQue] = useState(true); // state to check the given ans if first or not
  const [comment, setComment] = useState(""); // to set userComments
  const [questions, setQuestions] = useState([]); // to set userQuestions
  const [resultStatus, setResultStatus] = useState(false); // state to manage result text
  const [result, setResult] = useState(""); // state to manage result text
  const [count, setCount] = useState(1);
  const submitRef = useRef(null);
  const { username, email } = JSON.parse(localStorage.getItem("user"));

  let arr = ["0"];
  //handle change function for ans
  const handleChange = (e) => {
    setGivenAns(e.target.value);
  };

  useEffect(() => {
    // getting first data of question form DB
    const getQuesLen = async () => {
      const q = query(
        collection(db, "survey", docId, "questions"),
        where("questionType", "==", "Fail/Pass")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setQuestions((pre) => [...pre, doc.id]);
      });
    };
    getQuesLen();
    const paginate = async () => {
      // query to get first data
      const first = query(
        collection(db, "survey", docId, "questions"),
        orderBy("timestamp"),
        limit(1)
      );
      //getting data & pushing data in arr
      const documentSnapshots = await getDocs(first);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      documentSnapshots.forEach((doc) => {
        let data = { ...doc.data(), id: doc.id };
        setSurveyQue(data);
      });
    };
    //calling about function
    paginate();
  }, []);

  const submitSur = async () => {
    //getting results on DB to checking user Result
    const attempedDoc = doc(db, "survey", docId, "attemps", attempID);
    const docSnap = await getDoc(attempedDoc);
    if (docSnap.exists()) {
      if (docSnap.data().trueArr.length >= docSnap.data().passCrit) {
        setResult("You Passed!");
      } else {
        setResult("You Failed!");
      }
      setResultStatus(true);
    } else {
      alert("This Survey Is Empty");
    }
  };

  useEffect(()=>{
    // ten mins timer
    setTimeout(submitSur, 600000);
  },[])

  //function to get data of question from DB one by one
  const nextQuestion = async () => {
    if (givenAns !== "" || submitRef.current.innerText === "Show Result") {
      if (lastVisible !== undefined) {
        // query to get data from DB
        const next = query(
          collection(db, "survey", docId, "questions"),
          orderBy("timestamp"),
          startAfter(lastVisible),
          limit(1)
        );
        //getting & setting data into obj
        let nextQues = await getDocs(next);
        setLastVisible(nextQues.docs[nextQues.docs.length - 1]);
        nextQues.forEach((doc) => {
          let data = { ...doc.data(), id: doc.id };
          setSurveyQue(data);
        });
        //conditions to checking if the user given ans is right or wrong
        let rightAns = null;
        if (surveyQue.questionType === "Fail/Pass") {
          // condition to checking right ans of single quesion
          if (surveyQue.type === "Single") {
            if (surveyQue.trueAns === givenAns) {
              rightAns = true;
            } else {
              rightAns = false;
            }
          } else if (surveyQue.type === "Multiple") {
            //condition to check right ans of multiple question
            let trueArr = [];
            surveyQue.options.forEach((e) => {
              if (e.ans === true) {
                trueArr.push(e.option);
              }
            }); //conditon to check right ans
            if (trueArr.includes(givenAns)) {
              rightAns = true;
            } else {
              rightAns = false;
            }
          }
        }

        if (firstQue) {
          let { time, timestamp } = userReadableTime();

          // if the attempt question is first then add user initial data to DB
          let length = questions.length;
          if (length >= 1 && length % 2 !== 0) {
            length = length - 1;
          }
          length = length / 2;
          // add user data
          const docRef = await addDoc(
            collection(db, "survey", docId, "attemps"),
            {
              info: {
                username,
                email,
              },
              answeres: [
                {
                  givenAns,
                  queId: surveyQue.id,
                  type: surveyQue.type,
                  rightAns,
                  comment,
                },
              ],
              passCrit: length,
              trueArr: [],
              falseArr: [],
              timestamp,
              time,
            }
          );
          //getting id in which user data is added
          setAttempID(docRef.id);
          let attempDocID = docRef.id;
          setGivenAns("");
          setComment("");
          setFirstQue(false);
          setCount(count + 1);
          const attempDoc = doc(db, "survey", docId, "attemps", attempDocID);
          if (rightAns) {
            //now updateing arr on giving ans
            await updateDoc(attempDoc, {
              trueArr: arrayUnion(surveyQue.id),
            });
          } else if (rightAns !== null) {
            //now updateing arr on giving ans
            await updateDoc(attempDoc, {
              falseArr: arrayUnion(surveyQue.id),
            });
          }
        } else {
          //now updateing user data on giving furthur ans
          const attempRef = doc(db, "survey", docId, "attemps", attempID);
          await updateDoc(attempRef, {
            answeres: arrayUnion({
              givenAns,
              queId: surveyQue.id,
              type: surveyQue.type,
              rightAns,
              comment,
            }),
          });
          if (rightAns) {
            //now updateing arr on giving ans
            await updateDoc(attempRef, {
              trueArr: arrayUnion(surveyQue.id),
            });
          } else if (rightAns !== null) {
            //now updateing arr on giving ans
            await updateDoc(attempRef, {
              falseArr: arrayUnion(surveyQue.id),
            });
          }
          setGivenAns("");
          setComment("");
          setCount(count + 1);
        }
      } else {
        submitSur();
      }
    } else {
      if (surveyQue.type !== "Data") {
        alert("Please Select Option To Send");
      } else {
        alert("Please Write Something To Send");
      }
    }
  };

  return (
    <>
      {!resultStatus && <Timer />}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {resultStatus ? (
          <p className="result">{result}</p>
        ) : (
          <>
            {surveyQue !== {} && (
              <>
                <div className="question">
                  {lastVisible ? (
                    <>
                      <p className="que">
                        Question No {count}: {surveyQue.question}
                      </p>
                      {surveyQue.type === "Data" && (
                        <input
                          type="text"
                          onChange={handleChange}
                          value={givenAns}
                          placeholder="Write Your Answere Here..."
                        />
                      )}
                      {surveyQue.type === "Single" && (
                        <>
                          {arr.map((e) => {
                            return (
                              <div className="radio" key={surveyQue.id}>
                                <input
                                  onChange={handleChange}
                                  type="radio"
                                  id="True"
                                  name={surveyQue.id}
                                  value="True"
                                />
                                <label htmlFor="True">True</label>
                                <input
                                  onChange={handleChange}
                                  type="radio"
                                  id="False"
                                  name={surveyQue.id}
                                  value="False"
                                />
                                <label htmlFor="data">False</label>
                              </div>
                            );
                          })}
                          <input
                            type="text"
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            placeholder="Enter Your Comment Here ..."
                          />
                        </>
                      )}

                      {surveyQue.type === "Multiple" && (
                        <>
                          {surveyQue.options.map((e, index) => {
                            return (
                              <div
                                className="multiOpt"
                                key={surveyQue.id + index}
                              >
                                <input
                                  type="radio"
                                  name="Multiple"
                                  onChange={handleChange}
                                  value={e.option}
                                />
                                <label htmlFor="multiple">{e.option}</label>
                              </div>
                            );
                          })}
                          <input
                            type="text"
                            placeholder="Enter Your Comment Here ..."
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <p className="que">
                      No Questions Remaining Click Button Below
                    </p>
                  )}
                  <button
                    className="sendBtn"
                    ref={submitRef}
                    onClick={nextQuestion}
                  >
                    {lastVisible ? "Next" : "Show Result"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
