/** @format */

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import DataPath from "./data.csv";
// import SelectSearch from "react-select-search";
import SelectSearch from "react-select";
import DatePicker from "react-datepicker";

export const Search = () => {
  const [data, setData] = useState([]);
  const [workerRoleMap, setWorkerRoleMap] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [response, setResponse] = useState();

  useEffect(() => {
    readCSVFile();
  }, []);

  const readCSVFile = () => {
    Papa.parse(DataPath, {
      download: true,
      header: true,
      complete: handleCSVData,
    });
  };

  const handleCSVData = (result) => {
    console.log("Parsed CSV Data:", result.data);
    let worker = new Set();
    let positions = new Set();
    let time = new Set();
    let month = new Set();
    let workerRoleMapLocal = {};
    result.data.map((data) => {
      worker.add(data.worker);
      positions.add(data.position);
      time.add(data.time);
      month.add(data.month);
      workerRoleMapLocal[data.worker] = data.position;
    });
    setData({
      worker,
      positions,
      time,
      month,
    });
    setWorkerRoleMap(workerRoleMapLocal);
  };

  function getFirstHalfMonth(date) {
    const month = date.getMonth(); // zero-indexed
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[month];

    let halfOfMonth;
    if (day <= Math.ceil(daysInMonth / 2)) {
      halfOfMonth = "firsthalf";
    } else {
      halfOfMonth = "secondhalf";
    }
    return `${monthName}${halfOfMonth}`;
  }

  const getPredictions = async () => {
    const response = await fetch(
      encodeURI(
        `/api/searchPrediction?worker=${selectedWorker.value}&position=${
          workerRoleMap[selectedWorker.value]
        }&time=${selectedTime.value}&month=${getFirstHalfMonth(selectedMonth)}`
      )
    );
    const data = await response.json();
    setResponse(data);
    console.log(55, data);
  };

  const arrayToOptionMap = (array) => {
    if (!array) return [{ value: "", label: "" }];
    console.log(array);
    return [...array].map((a) => {
      return {
        label: a,
        value: a,
      };
    });
  };
  if (!data) {
    return "loading..!";
  }
  return (
    <div className="searchComp">
      {/* <div className="dropdownInputs"> */}
      <SelectSearch
        className="searchBox workerDrop"
        options={arrayToOptionMap(data?.worker)}
        onChange={setSelectedWorker}
        value={selectedWorker}
        name="Worker"
        placeholder="Worker"
      />
      <SelectSearch
        className="searchBox timeBox"
        options={arrayToOptionMap(data?.time)}
        onChange={setSelectedTime}
        value={selectedTime}
        name="Time"
        placeholder="Time"
      />
      <div className="dateBox">
        <DatePicker
          className="datePicker"
          onChange={setSelectedMonth}
          selected={selectedMonth}
          isClearable
          name="Month"
          placeholderText="Choose date"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [5, 10],
              },
            },
            {
              name: "preventOverflow",
              options: {
                rootBoundary: "viewport",
                tether: false,
                altAxis: true,
              },
            },
          ]}
        />
      </div>
      {/* </div> */}

      <input
        className="inputBox2"
        type="text"
        placeholder="search..."
        onFocus={getPredictions}
        onBlur={() => setResponse([])}
      />
      {response?.length > 0 ? (
        <div className="recomendationList">
          <span className="helpText">AI Recommended actions...</span>
          {response.map((r, k) => (
            <div className="recomendation" key={k}>
              {r}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
