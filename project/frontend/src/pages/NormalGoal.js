import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { NormalGoalCreateEdit } from "components/NormalGoalCreateEdit";
import { useParams } from "react-router-dom";
import { Footer } from "components/Footer";
import axios from "axios";
const baseURL = "http://localhost:8000";
async function fetchGoalData(userStore, goalObjId) {
  const result = await axios.get(
    `${baseURL}/db/get_goal_by_obj_id`,
    {
      headers: {
        Authorization: userStore.userToken,
        UserId: userStore.userId,
        GoalObjId: goalObjId
      },
    }
  )
  return result.data
}
export const NormalGoal = () => {
  const userStore = useSelector((state) => state.userStore);
  const { goalObjId } = useParams();
  const [mode, setMode] = useState("new");
  const [goalData, setGoalData] = useState({
    userId: userStore.userId,
    Name: "",
    Goal: "",
    CreatedDate: new Date(),
    GoalTime: new Date(),
  });
  useEffect(() => {
    if (goalObjId && userStore.userId !== null) {
       const fetchGoal = async () => {
       return await fetchGoalData(userStore,goalObjId)
      }
      fetchGoal().then(fetchedGoalObj => {
        setGoalData(fetchedGoalObj)
        setMode("edit")
      })
    }
  }, [goalObjId,userStore]);
  return (
    <React.Fragment>
      <Navigate />
      <NormalGoalCreateEdit
        goalData={goalData}
        setGoalData={setGoalData}
        mode={mode}
      />
      <Footer/>
    </React.Fragment>
  );
};
