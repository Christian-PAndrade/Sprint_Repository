import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "./styles/index.css";
import HomePage from "./pages/HomePage";

render(
  <Router>
    <HomePage />
  </Router>,
  document.getElementById("root")
);
