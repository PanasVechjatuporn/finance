import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";

import { RiskLevel } from "components/RiskLevel_RiskEvalNormal";
import { EvaluationForm } from "components/RiskEvalForm_RiskEvalNormal";
import "./normalGoal.css";

export const RiskEvalNormalPage = () => {
  const [showRiskLevel, setshowRiskLevel] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [allowedToAccessNormalGoal, setAllowedToAccessNormalGoal] =
    useState(false);
  // const userStore = useSelector((state) => state.userStore);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (allowedToAccessNormalGoal) {
  //     axios.post(
  //       `http://localhost:8000/db/upsert_risk_profile=${userStore.userId}`,
  //       { userId: userStore.userId, riskProfile: evaluationResult },
  //       {
  //         headers: {
  //           Authorization: userStore.userToken,
  //           UserId: userStore.userId,
  //         },
  //       }
  //     );

  //     // navigate("../Goal-based/normal-goal", {
  //     //   state: { risk_profile: evaluationResult },
  //     // });
  //   }
  // }, allowedToAccessNormalGoal);

  return (
    <React.Fragment>
      <Navigate />
      {!showRiskLevel ? (
        <EvaluationForm
          setshowRiskLevel={setshowRiskLevel}
          setEvaluationResult={setEvaluationResult}
        />
      ) : (
        <RiskLevel
          evaluationResult={evaluationResult}
          setshowRiskLevel={setshowRiskLevel}
          setAllowedToAccessNormalGoal={setAllowedToAccessNormalGoal}
        />
      )}
    </React.Fragment>
  );
};
