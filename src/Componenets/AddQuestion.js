import React, { useState } from "react";
import { useParams } from "react-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import {
  addOption,
  addDataQue,
  addFail_pass,
  addMulti,
} from "./FirebaseFunctions";
import Dropdown from "./Dropdown";
import Switch from "./Switch";

export default function AddQuestion() {
  const { docId } = useParams(); // Params to Get Doc Id & Show Questions
  const [type, setType] = useState("Data"); // Questions Type Defualt Is Data
  const [question, setQuestion] = useState(""); // Qustion Input State
  const [questionFrom, setQuestionFrom] = useState(false); // Question From PopUp State
  const [askQueType, setAskQueType] = useState(true); // state to manage question type as data or passed fail
  const [trueAns, setTrueAns] = useState(""); // state to manage ture ans of question type single
  const [options, setOptions] = useState([""]); //state where add option element pushed
  const [optionsVal, setOptionsVal] = useState({
    0: { option: "", ans: false },
  }); // state for manageing mutiple question type result
  const [count, setCount] = useState(1); // simple state for manageing options count

  // function to reset form
  const formFunc = () => {
    // states which needed to be updated when form ends
    setOptionsVal({ 0: { option: "", ans: false } });
    setOptions([""]);
    setCount(1);
    setQuestionFrom(false);
    setQuestion("");
    setTrueAns("");
    setAskQueType(true);
  };

  // function to add options dynamically
  const addOptions = () => {
    if (options.length <= 4) {
      // setting initial value of option & checkbox
      setOptionsVal({ ...optionsVal, [count]: { option: "", ans: false } });
      //increseing count by 1 to add option input
      setCount(count + 1);
      // simple state to map for options to show user options
      setOptions((val) => [...val, ""]);
    } else {
      alert("Maximum Options Can Be 5");
    }
  };
  // function to add questions to DB.
  const sendQuestion = () => {
    // question is not empty
    if (question !== "") {
      // gettig timestamp
      let d = new Date();
      let timestamp = d.getTime();
      const docRef = collection(db, "survey", docId, "questions");
      // if asked question type is pass/fail
      if (type === "Data") {
        addDataQue(docId, question, type, "Data");
        formFunc();
      } else {
        if (askQueType) {
          if (type === "Single") {
            //if ans is selected
            if (trueAns !== "") {
              // sending question to DB
              addFail_pass(docId, question, trueAns, type, "Fail/Pass");
              formFunc();
            } else {
              alert(
                "It is mandatory to select right answere in Fail / Pass questions"
              );
            }
            // if question type is multiple
          } else if (type === "Multiple") {
            if (askQueType) {
              //array of options in multiple question
              let arrOptions = [];
              let optionErr = false;
              let ansArr = [];
              // ans array for storeing ans
              for (const key in optionsVal) {
                //getting multiple value from obj for in loop
                arrOptions.push(optionsVal[key]);
              }
              // length for loop
              let length = arrOptions.length;
              //loop to push options in arr & check empty option
              for (let i = 0; i < length; i++) {
                if (arrOptions[i].option !== "") {
                  ansArr.push(arrOptions[i].ans);
                } else {
                  //if any option is empty
                  optionErr = true;
                  break;
                }
              }
              if (optionErr) {
                // if any option is empty
                alert("Options Can't Be Empty");
              }
              //checking if any option is selected or not
              else if (!ansArr.includes(true)) {
                alert(
                  "It is mandatory to select right answere in Fail / Pass questions"
                );
              } else {
                //sending data to DB
                addMulti(docId, question, arrOptions, type, "Fail/Pass");
                formFunc();
              }
            }
          }
        } else {
          //if question type is multiple
          if (type === "Multiple") {
            let optionsErr = false;
            let arrOptions = [];
            //pushing option in arr options arr
            for (const key in optionsVal) {
              arrOptions.push({ option: optionsVal[key].option });
            }
            //geting length for loop
            let length = arrOptions.length;
            //loop for checking empty option
            for (let i = 0; i < length; i++) {
              if (arrOptions[i].option === "") {
                // if any option is empty then
                optionsErr = true;
                break;
              }
            }
            if (optionsErr) {
              // giving alert on empty options
              alert("Options Can't Be Empty");
            } else {
              formFunc();
            }
          } else if (type === "Single") {
            //adding document for simple data question
            addOption(docId, question, type, "Data");
            formFunc();
          }
        }
      }
    } else {
      alert("Please Write Your Question Before Sending");
    }
  };

  //change handle functions for options input
  const handleChangeCheck = (event, index) => {
    setOptionsVal({
      ...optionsVal,
      [index]: {
        ...optionsVal[index],
        ans: event.target.checked,
      },
    });
  };

  const handleChange = (event, index) => {
    setOptionsVal({
      ...optionsVal,
      [index]: {
        ...optionsVal[index],
        option: event.target.value,
      },
    });
  };

  return (
    <>
      <h4 className="heading" style={{ margin: "10px 0px", fontWeight: 600 }}>
        Survey Name
      </h4>

      <Dropdown
        type={(e) => {
          setType(e.target.value);
        }}
        setQue={() => {
          setQuestionFrom(true);
        }}
      />
      {questionFrom && (
        <div id="askQueDIv" style={{ display: "flex", zIndex: 1000 }}>
          <div onClick={formFunc} id="close">
            X
          </div>

          <div id="queDiv">
            <p>Question</p>
            <input
              id="mainQues"
              placeholder="Write Your Question Here"
              type="text"
              onChange={(e) => setQuestion(e.target.value)}
            />
            {type === "Single" && (
              <>
                {askQueType ? (
                  <>
                    <p>
                      Please Check Answere Which You Want To Consider Passed
                    </p>
                    <div className="radio">
                      <input
                        onChange={(e) => setTrueAns(e.target.value)}
                        type="radio"
                        id="True"
                        name="select"
                        value="True"
                      />
                      <label htmlFor="True">True</label>
                      <input
                        onChange={(e) => setTrueAns(e.target.value)}
                        type="radio"
                        id="False"
                        name="select"
                        value="False"
                      />
                      <label htmlFor="data">False</label>
                    </div>
                  </>
                ) : (
                  <p>Question Is In Data Mode</p>
                )}
              </>
            )}

            {type === "Multiple" && (
              <>
                <div className="optDiv">
                  <div>
                    {askQueType ? (
                      <p className="message">
                        Please Check Answere Which You Want To Consider Passed
                      </p>
                    ) : (
                      <p className="message">Question Is In Data Mode</p>
                    )}
                    <button
                      onClick={addOptions}
                      className="btn btn-warning addOP"
                    >
                      + Add Options
                    </button>

                    {options.map((e, index) => {
                      return (
                        <div key={index}>
                          {askQueType && (
                            <input
                              type="checkbox"
                              onChange={(event) =>
                                handleChangeCheck(event, index)
                              }
                              className="check"
                            />
                          )}
                          <input
                            type="text"
                            onChange={(event) => handleChange(event, index)}
                            className="options "
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <button className="btn btn-primary" onClick={sendQuestion}>
              Send
            </button>
            <div className="switchDiv">
              {type !== "Data" && (
                <Switch askQueTyp={() => setAskQueType(!askQueType)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
