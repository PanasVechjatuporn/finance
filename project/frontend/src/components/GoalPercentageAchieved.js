import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { ComponentLoading } from "./OverlayLoading";
import { roundNumber } from "utils/numberUtil";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
const baseURL = "http://localhost:8000";

async function setCurrentGoalStatus(goalStatus,goalData){
    // await axios.post()
    
}


export const GoalPercentageAchieved = ({
    goalData,
    assetSummaryGoalData,
    isLoading,
}) => {
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
            valueInsideGoal > goalData.Goal ? setCurrentGoalStatus(valueInsideGoal > goalData.Goal, goalData) : setCurrentGoalStatus(valueInsideGoal > goalData.Goal, goalData)
            setGoalStatus(valueInsideGoal > goalData.Goal);
            setGoalValueAchieved(roundNumber(valueInsideGoal,6));
            setPercentAchieved(percentAchieved);
        }
    }, [goalData, assetSummaryGoalData, isLoading]);
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
                                        <span style={{ color: goalStatus ? "green" : "red" }}>{goalStatus ? " บรรลุเป้าหมาย" : " ยังไม่บรรลุเป้าหมาย"}</span>
                                    </span>
                                )}
                            </Typography>
                            <Typography>
                                ขณะนี้คุณลงทุนไปในเป้าหมายแล้ว {percentAchieved}% / 100%, คิดเป็นเงิน {goalValueAchieved} บาท จากเป้าหมาย {goalData.Goal} บาท
                            </Typography>
                        </>)
                    }
                </>
                }
            </Box>
        </Container>
    );
};
