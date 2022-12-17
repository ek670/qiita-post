import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Input } from "./pages/Input";
import { Result } from "./pages/Result";
import "./style.css";

process.env.NODE_ENV !== "development" &&
  (() => {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  })();

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={process.env.PUBLIC_URL} element={<Input />} />
      <Route path={process.env.PUBLIC_URL + "/result"} element={<Result />} />
    </Routes>
  </BrowserRouter>
);

export default App;
