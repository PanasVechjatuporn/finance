import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";

import { EvaluationForm } from "components/RiskEvalForm_RiskEvalNormal";
import "./normalGoal.css";

export const RiskEvalNormalPage = () => {
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
      <EvaluationForm />
    </React.Fragment>
  );
};
