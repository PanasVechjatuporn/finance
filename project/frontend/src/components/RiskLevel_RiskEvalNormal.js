import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import axios from "axios";
import "./RiskLevel_RiskEvalNormal.css";
import { getMasterDataByName } from "utils/masterDataUtil";
const baseURL = "http://localhost:8000";

export const RiskLevel = ({ evaluationResult, setshowRiskLevel }) => {
  const navigate = useNavigate();
  const userStore = useSelector((state) => state.userStore);
  const score = evaluationResult;
  const [riskProfileMasterData,setRiskProfileMasterData] = useState(null)
  useEffect(() => {
    const fetchRiskProfileMasterData = async () => {
      try {
        const tmpFetchData = await getMasterDataByName("riskProfileMasterData");
        console.log('tmpFetchData :: ',tmpFetchData.risk)
        console.log(tmpFetchData.risk.find(data => data.level === "low").labelTH)
        setRiskProfileMasterData(tmpFetchData.risk)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRiskProfileMasterData();
  }, []); 
  let risk_profile;
  if (score < 15) {
    risk_profile = "low";
  } else if (score >= 15 && score <= 21) {
    risk_profile = "mediumLow";
  } else if (score >= 22 && score <= 29) {
    risk_profile = "mediumHigh";
  } else if (score >= 30 && score <= 36) {
    risk_profile = "high";
  } else if (score >= 37) {
    risk_profile = "veryHigh";
  }
  //
  const handleBackButton = () => {
    setshowRiskLevel(false);
  };

  const saveUserRiskProfile = async () => {
    await axios.post(
      `${baseURL}/db/create_user_risk_profile`,
      {
        risk_profile,
      },
      {
        headers: {
          Authorization: userStore.userToken,
          UserId: userStore.userId,
        },
      }
    );
    navigate("/Goal-based/");
  };
  return (
    <React.Fragment>
      <div className="EvaluationResult">
        <p>Your final score is : {score}</p>
      </div>
      <div className="EvaluationResult">
        <p>Your risk level is : {riskProfileMasterData !== null && (riskProfileMasterData.find(data => data.level === risk_profile).labelTH)}</p>
      </div>
      <div className="BackAndCreateGoalButton">
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={handleBackButton}>
            Redo the questionaire
          </Button>
          <Button
            variant="contained"
            onClick={async (e) => {
              await saveUserRiskProfile();
            }}
          >
            Save and then return to Goal-Based
          </Button>
        </Stack>
      </div>
    </React.Fragment>
  );
};
