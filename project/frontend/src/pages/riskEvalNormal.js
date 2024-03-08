import React from "react";
import Navigate from "components/Navbar";

import EvaluationForm from "components/RiskEval_GoalBased";
import "./normalGoal.css";

export const RiskEvalNormalPage = ({ setAllowedToAccessNormalGoal }) => {
  return (
    <React.Fragment>
      <Navigate />
      <EvaluationForm
        setAllowedToAccessNormalGoal={setAllowedToAccessNormalGoal}
      />
    </React.Fragment>
  );
};
