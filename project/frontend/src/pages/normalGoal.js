import React from "react";

import Navigate from "components/Navbar";
import { FormGoal } from "components/formNormalGoal_normalGoal";

import "./normalGoal.css";

export const NormalGoal = () => {
  return (
    <React.Fragment>
      <Navigate />
      <FormGoal />
    </React.Fragment>
  );
};
