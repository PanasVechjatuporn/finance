import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { ComponentLoading } from "./OverlayLoading";
import { roundNumber } from "utils/numberUtil";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
const baseURL = "http://localhost:8000";

async function setCurrentGoalStatus(goalStatus,goalData, userStore){
    await axios.post(
        `${baseURL}/db/update_goal_status_flag`,
        {
            goalData,
            goalStatus
        },
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId,
            },
        }
    );
}


export const GoalPercentageAchieved = ({
    goalData,
    assetSummaryGoalData,
    isLoading,
}) => {
    const userStore = useSelector((state) => state.userStore);
    const [percentAchieved, setPercentAchieved] = useState(null);
    const [goalStatus, setGoalStatus] = useState(null);
    const [goalValueAchieved, setGoalValueAchieved] = useState(null);
    useEffect(() => {
        if (goalData && assetSummaryGoalData && !isLoading) {
            let valueInsideGoal = 0;
            assetSummaryGoalData.forEach((asset) => {
                valueInsideGoal += asset.value;
            });
            const percentAchieved = Math.trunc(((valueInsideGoal / goalData.Goal) * 100 + Number.EPSILON )*100)/100;
            valueInsideGoal > goalData.Goal ? setCurrentGoalStatus(valueInsideGoal > goalData.Goal, goalData, userStore) : setCurrentGoalStatus(valueInsideGoal > goalData.Goal, goalData, userStore)
            setGoalStatus(valueInsideGoal > goalData.Goal);
            setGoalValueAchieved(roundNumber(valueInsideGoal,6));
            setPercentAchieved(percentAchieved);
        }
    }, [goalData, assetSummaryGoalData, isLoading, userStore]);
    return (
        <Container
            sx={{
                marginTop: 5,
                display: "ruby-text",
            }}
        >
            <Box
                sx={{
                    minWidth: "90%",
                    minHeight: "90%",
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: 6,
                    boxShadow: 6,
                    padding: 4,
                    position: "relative",
                    overflow: "auto",
                    justifyContent: "center",
                }}
            >
                {isLoading ? (
                    <ComponentLoading isLoading={isLoading}></ComponentLoading>
                ) : <>
                    {(goalData && assetSummaryGoalData) && (
                        <>
                            <Typography
                                variant="h5"
                                style={{
                                    color: "#757575",
                                    textDecoration: "underline",
                                    textDecorationColor: "transparent",
                                    borderBottom: "2px solid #757575",
                                    width: "100%",
                                    paddingBottom: "8px",
                                    userSelect: "none",
                                    marginBottom: "15px",
                                    fontWeight: "bold",
                                }}
                                sx={{
                                    padding: 1,
                                }}
                            >
                                {goalData && (
                                    <span>
                                        สถานะของเป้าหมาย 
                                        <span style={{color : "#d1973e"}}>{" "+goalData.Name+" "}</span>
                                        <span>:</span>
                                        <span style={{ color: goalStatus ? "green" : "red" }}>{goalStatus ? " Success" : " On going"}</span>
                                    </span>
                                )}
                            </Typography>
                            <Typography
                                style={{
                                    fontSize: "18px"
                                }}
                            >
                                <span>ขณะนี้คุณลงทุนไปในเป้าหมายแล้ว</span>
                                 <span style={{fontWeight : "bold", fontSize : "22px"}}> {percentAchieved}%</span> / 100%, คิดเป็นเงิน {goalValueAchieved} Baht จากเป้าหมาย {goalData.Goal} Baht
                            </Typography>
                        </>)
                    }
                </>
                }
            </Box>
        </Container>
    );
};
