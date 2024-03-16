import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import "./RiskLevel_RiskEvalNormal.css";

export const RiskLevel = ({
  evaluationResult,
  setshowRiskLevel,
  setAllowedToAccessNormalGoal,
}) => {
  const navigate = useNavigate();

  const score = evaluationResult;
  var risk_profile;
  if (score < 15) {
    risk_profile = "low";
  } else if (score >= 15 && score <= 21) {
    risk_profile = "medium low";
  } else if (score >= 22 && score <= 29) {
    risk_profile = "medium high";
  } else if (score >= 30 && score <= 36) {
    risk_profile = "high";
  } else if (score >= 37) {
    risk_profile = "very high";
  }

  const handleBackButton = () => {
    setshowRiskLevel(false);
  };

  const handleCreateGoal = () => {
    setAllowedToAccessNormalGoal(true);
    navigate("../Goal-based/normal-goal", { state: { profile: risk_profile } });
  };

  return (
    <React.Fragment>
      <div className="EvaluationResult">
        <p>คะแนนของคุณคือ: {score}</p>
      </div>
      <div className="EvaluationResult">
        <p>คะแนนของคุณคือ: {risk_profile}</p>
      </div>
      <div className="BackAndCreateGoalButton">
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={handleBackButton}>
            Back
          </Button>
          <Button variant="contained" onClick={handleCreateGoal}>
            Create Goal
          </Button>
        </Stack>
      </div>
    </React.Fragment>
  );
};
