import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Result } from "./pages/Result";
import "./style.css";

process.env.NODE_ENV !== "development" &&
  (() => {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  })();

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Result />} />
    </Routes>
  </BrowserRouter>
);

export default App;
