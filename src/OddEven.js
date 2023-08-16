/** @format */

import React, { useState } from "react";

function OddEven() {
  const [number, setNumber] = useState();
  const [response, setResponse] = useState();

  const handleFetchData = async () => {
    const response = await fetch(`/api/check_even_odd?number=${number}`);
    const data = await response.json();
    setResponse(data);
  };
  return (
    <div>
      <div className="inputContainer">
        <input
          className="inputBox"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
        />
        <button className="actionButton" onClick={handleFetchData}>
          Validate
        </button>
      </div>
      {response?.number ? (
        <div className="result">
          <div>
            Number {"   "}-> <b>{response?.number}</b>{" "}
          </div>
          <div>
            Prediction -> <b>{response?.prediction} </b>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default OddEven;
