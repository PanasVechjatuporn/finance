import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import axios from "axios";
import "./RiskLevel_RiskEvalNormal.css";

export const RiskLevel = ({
  evaluationResult,
}) => {
  const userStore = useSelector((state) => state.userStore);
  const navigate = useNavigate();

  const score = evaluationResult;
  var riskProfile;
  if (score < 15) {
    riskProfile = "low";
  } else if (score >= 15 && score <= 21) {
    riskProfile = "medium low";
  } else if (score >= 22 && score <= 29) {
    riskProfile = "medium high";
  } else if (score >= 30 && score <= 36) {
    riskProfile = "high";
  } else if (score >= 37) {
    riskProfile = "very high";
  }


  const handleCreateGoal = (e) => {
    // console.log(userStore);
    // console.log("risk profile", riskProfile);
    // console.log(userStore.userId)
    // const params = { userId: userStore.userId, riskProfile: riskProfile };
    // console.log(params);
    axios.post(
      `http://localhost:8000/db/upsert_risk_profile=${userStore.userId}`,
      { userId: userStore.userId, riskProfile: riskProfile },
      {
        headers: {
          Authorization: userStore.userToken,
          UserId: userStore.userId,
        },
      }
    );
    navigate("../Goal-based/normal-goal", { state: { riskProfile: riskProfile, Percentage: 100 } });
  };

  return (
    <React.Fragment>
      <div className="EvaluationResult">
        <p>คะแนนของคุณคือ: {score}</p>
      </div>
      <div className="EvaluationResult">
        <p>ความเสี่ยงที่รับได้คือ: {riskProfile}</p>
      </div>
      <div className="BackAndCreateGoalButton">
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleCreateGoal}>
            Create Goal
          </Button>
        </Stack>
      </div>
    </React.Fragment>
  );
};
