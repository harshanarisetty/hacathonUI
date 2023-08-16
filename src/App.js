/** @format */

import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
import OddEven from "./OddEven";
import { Search } from "./Search";
import "react-select-search/style.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <div className="App">
      {/* <OddEven /> */}
      <Search />
    </div>
  );
}

export default App;
