import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { CurrentUserRiskProfile } from "components/CurrentUserRiskProfile";
import { InvestmentFundsTable } from "components/InvestmentFundsTable";
import { useParams } from "react-router-dom";
import { AssetSummaryGoalTable } from "../components/AssetSummaryGoalTable_GoalBased";
import Paper from "@mui/material/Paper";
import { Container } from "react-bootstrap";
import Box from "@mui/material/Box";
import axios from "axios";
const baseURL = "http://localhost:8000";

async function fetchGoalData(userStore, goalObjId) {
    const result = await axios.get(`${baseURL}/db/get_goal_by_obj_id`, {
        headers: {
            Authorization: userStore.userToken,
            UserId: userStore.userId,
            GoalObjId: goalObjId,
        },
    });
    return result.data;
}

async function fetchFundsData(userStore) {
    const result = await axios.get(`${baseURL}/db/funds`, {
        headers: {
            Authorization: userStore.userToken,
            UserId: userStore.userId,
        },
    });
    return result.data;
}

async function digestFundsData(userStore, fundsData) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(
                `${baseURL}/db/get_and_calculate_fund_growth`,
                {
                    fundsData: fundsData,
                },
                {
                    headers: {
                        Authorization: userStore.userToken,
                        UserId: userStore.userId,
                    },
                }
            );
            resolve(result.data);
        } catch (err) {
            reject(err);
        }
    });
}

export const GoalInvestment = () => {
    const userStore = useSelector((state) => state.userStore);
    const { goalObjId } = useParams();
    const [goalData, setGoalData] = useState(null);
    const [fundsData, setFundData] = useState(null);

    useEffect(() => {
        if (goalObjId && userStore.userId !== null) {
            const fetchGoal = async () => {
                return Promise.all([
                    fetchGoalData(userStore, goalObjId),
                    fetchFundsData(userStore),
                ]);
            };
            fetchGoal().then((res) => {
                const fetchGoalData = res[0];
                const fetchFundsData = res[1];
                const goalTypeFlag = fetchGoalData.type === "normal";
                const neededDigestFunds = goalTypeFlag
                    ? fetchFundsData.filter(
                        (fund) =>
                            !(
                                fund.spec_code.includes("RMF") ||
                                fund.spec_code.includes("SSF")
                            )
                    )
                    : fetchFundsData.filter(
                        (fund) =>
                            fund.spec_code.includes("RMF") || fund.spec_code.includes("SSF")
                    );
                digestFundsData(userStore, neededDigestFunds).then((resDigest) => {
                    const digestedFundsData = resDigest.fundsData;
                    setFundData(digestedFundsData);
                    setGoalData(fetchGoalData);
                });
            });
        }
    }, [goalObjId, userStore]);

    return (
        <React.Fragment>
            <Navigate />
            <CurrentUserRiskProfile />
            <InvestmentFundsTable fundsData={fundsData} goalData={goalData} />

            {/* Because AssetSummaryGoalTable in sub Component inside another component it will need another container */}
            <Container sx={{ maxWidth: "100%" }}>
                <Box sx={{ width: "100%" }}>
                    <Paper sx={{ width: "100%" }}>
                        <AssetSummaryGoalTable goalData={goalData} mode={"specific"} />
                    </Paper>
                </Box>
            </Container>
        </React.Fragment>
    );
};
