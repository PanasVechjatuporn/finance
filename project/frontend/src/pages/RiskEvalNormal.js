import React, { useState } from "react";
import Navigate from "components/Navbar";

import { RiskLevel } from "components/RiskLevel_RiskEvalNormal";
import { EvaluationForm } from "components/RiskEvalForm_RiskEvalNormal";
import Container from "@mui/material/Container";
import "./NormalGoal.css";
import { Footer } from "components/Footer";

export const RiskEvalNormalPage = ({ setAllowedToAccessNormalGoal }) => {
  const [showRiskLevel, setshowRiskLevel] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  return (
    <React.Fragment>
      <Navigate />
      <Container sx={{height : "65vh"}}>
      {!showRiskLevel ? (
        <EvaluationForm
          setshowRiskLevel={setshowRiskLevel}
          setEvaluationResult={setEvaluationResult}
        />
      ) : (
        <RiskLevel
          evaluationResult={evaluationResult}
          setshowRiskLevel={setshowRiskLevel}
        />
      )}
      </Container>
      <Footer/>
    </React.Fragment>
  );
};
