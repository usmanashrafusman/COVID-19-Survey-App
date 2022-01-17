import { auth, db } from "./FirebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

// functions to get user readable time
export const userReadableTime = () => {
  let d = new Date();
  let timestamp = d.getTime();
  let date = d.toDateString();
  let hours = d.getHours();
  let mins = d.getMinutes();
  let period = "AM";
  if (hours <= 9) {
    hours = "0" + hours;
  }
  if (mins <= 9) {
    mins = "0" + mins;
  }
  if (hours > 11) {
    period = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }
  let createdTime = `${hours}:${mins} ${period}`;
  let time = `${date} ${createdTime}`;

  return { time, timestamp };
};

// User Answere Survey Form Function Exported
export const submitForm = (username, email, navigate) => {
  //Regex For Email Validation
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //if name is written
  if (username !== "") {
    // if email is in valid format
    if (regex.test(email)) {
      let obj = {
        username,
        email,
      };
      //checking if any user is signed in if yes then signing out user
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          signOut(auth) // signing out
            .then(() => {
              //send user name & email to browser localstorage
              localStorage.setItem("user", JSON.stringify(obj));
              //navigating user
              navigate("/allsurvey");
            })
            .catch((error) => {});
        } else {
          //send user name & email to browser localstorage
          localStorage.setItem("user", JSON.stringify(obj));
          //navigating user
          navigate("/allsurvey");
        }
      });
    } else {
      alert("Please Provide Valid Email");
    }
  } else {
    alert("Please Write Your Name");
  }
};

// SignUp User Function Exported
export const signUp = (email, password, navigate) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Navigating User On SignUp
      navigate("/survey");
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

// SignIn User Function Exported
export const signIn = (email, password, navigate) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Navigating User On SignUp
      navigate("/survey");
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

//ad new survey function
export const addSurvey = async (surveyName) => {
  // if value is empty then
  if (surveyName === "") {
    alert("Please Write Name For Survey");
  } else {
    //Getting Currently Signed In User and getting data from user obj then adding survey doc to DB.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // extracting user readable time &

        let { time, timestamp } = userReadableTime();

        //Getting Currently Signed In User
        const createdByUser = user.uid;
        const createdBy = user.email;

        // getting data from user obj then adding survey doc to DB

        addDoc(collection(db, "survey"), {
          time,
          createdBy,
          createdByUser,
          timestamp,
          surveyName,
        });

        alert("Your New Survey Is Created");
      } else {
        // if user is not logged in
        alert("You don't have rights for creating any survey");
      }
    });
  }
};

//// Firebase Function For Adding Documents

export const addDataQue = async (docId, question, type, data) => {
  const d = new Date();
  const timestamp = d.getTime();
  await addDoc(collection(db, "survey", docId, "questions"), {
    question,
    type,
    timestamp,
    questionType: "Data",
  });
};

export const addFail_pass = async (docId, question, trueAns, type, data) => {
  const d = new Date();
  const timestamp = d.getTime();
  await addDoc(collection(db, "survey", docId, "questions"), {
    question,
    trueAns,
    type,
    timestamp,
    questionType: data,
  });
};

export const addMulti = async (docId, question, arrOptions, type, data) => {
  const d = new Date();
  const timestamp = d.getTime();
  await addDoc(collection(db, "survey", docId, "questions"), {
    question,
    options: arrOptions,
    type,
    timestamp,
    questionType: data,
  });
};

export const addOption = async (docId, question, type, data) => {
  const d = new Date();
  const timestamp = d.getTime();
  await addDoc(collection(db, "survey", docId, "questions"), {
    question,
    trueAns: null,
    type,
    timestamp,
    questionType: data,
  });
};
