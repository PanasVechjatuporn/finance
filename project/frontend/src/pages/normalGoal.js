import React, { useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { NormalGoalCreateNew } from "components/NormalGoalCreateNew";
import { NormalGoalOverview } from "components/NormalGoalOverview";
export const NormalGoal = () => {
  const userStore = useSelector((state) => state.userStore);
  console.log('userStore :: ',userStore)
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
  });
  let currentComponent;
  switch (currentStep) {
    case 1:
      currentComponent = <NormalGoalCreateNew currentStep={currentStep} setCurrentStep={setCurrentStep} goalData={goalData} setGoalData={setGoalData} />;
      break;
    case 2:
      currentComponent = <NormalGoalOverview currentStep={currentStep} setCurrentStep={setCurrentStep} goalData={goalData} setGoalData={setGoalData} />;
      break;
    default:
      break;
  }
  return (
    <React.Fragment>
      <Navigate />
      {currentComponent}
    </React.Fragment>
  );
};
