import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {  useSelector } from "react-redux";
import axios from "axios";
import "./RiskLevel_RiskEvalNormal.css";
const baseURL = "http://localhost:8000";
export const RiskLevel = ({
  evaluationResult,
  setshowRiskLevel,
  setAllowedToAccessNormalGoal,
}) => {
  const navigate = useNavigate();
  const userStore = useSelector((state) => state.userStore);
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

  // const handleCreateGoal = () => {
  //   setAllowedToAccessNormalGoal(true);
  //   navigate("../Goal-based/normal-goal", { state: { profile: risk_profile } });
  // };

   const saveUserRiskProfile = async () => {
    console.log("profile: ", risk_profile);
    console.log("userStore :: ",userStore);
    const returnData = await axios.post(`${baseURL}/db/create_user_risk_profile`,
    {
        risk_profile
    },
    {
        headers: {
            Authorization: userStore.userToken,
            UserId: userStore.userId,
        },
    })
    console.log('returnData :: ',returnData)
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
          <Button variant="contained" onClick={saveUserRiskProfile}>
            Create Goal
          </Button>
        </Stack>
      </div>
    </React.Fragment>
  );
};
