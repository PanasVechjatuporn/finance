import React from "react";
import { useLocation } from "react-router-dom";
import Navigate from "components/Navbar";

import "./normalGoal.css";

export const NormalGoal = () => {
  const location = useLocation();
  const score = location.state.score;
  return (
    <React.Fragment>
      <Navigate />
      <div>{score}</div>
    </React.Fragment>
  );
};
