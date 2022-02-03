import React, { useEffect, useState } from "react";

export default function Timer() {
  const [timer, setTimer] = useState(600); //State For Timer

  useEffect(() => {
    setInterval(() => {
      setTimer((count) => count - 1);
    }, 1000);
  }, []);

  return (
    <div className="timer">

      <p style={{margin:"0px 10px",padding:"0px"}}>
       Remainig Time :  {timer === 600
          ? "10 Mins 00 Seconds"
          : `0${Math.floor(timer / 60)} Mins ${timer % 60} Seconds`}
      </p>
    </div>
  );
}
