import React, { useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { NormalGoalCreateEdit } from "components/NormalGoalCreateEdit";
export const NormalGoal = () => {
  const userStore = useSelector((state) => state.userStore);
  const [goalData, setGoalData] = useState({
    userId : userStore.userId,
    Name : "",
    Goal : "",
    CreatedDate : new Date(),
    GoalTime : new Date()
  });
  return (
    <React.Fragment>
      <Navigate />
      <NormalGoalCreateEdit goalData={goalData} setGoalData={setGoalData} />
    </React.Fragment>
  );
};
