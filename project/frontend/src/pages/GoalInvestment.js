import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { CurrentUserRiskProfile } from "components/CurrentUserRiskProfile";
import { InvestmentFundsTable } from "components/InvestmentFundsTable";
import { useParams } from "react-router-dom";
import { AssetSummaryGoalTable } from "../components/AssetSummaryGoalTable_GoalBased";
import { GoalAssetPriceSummary } from "components/GoalAssetPriceSummary";
import { ReductionGoalBuyInformation } from "components/ReductionGoalBuyInformation";
import { GoalPercentageAchieved } from "components/GoalPercentageAchieved";
import Paper from "@mui/material/Paper";
import { Container } from "react-bootstrap";
import { Footer } from "components/Footer";
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

async function fetchGoalAsset(goalData, userStore) {
    try {
        const res = await axios.get(`${baseURL}/db/get_user_asset_by_goal_id`, {
            headers: {
                userId: userStore.userId,
                Authorization: userStore.userToken,
                goalObjId: goalData._id,
            },
        });
        return res.data;
    } catch (err) {
        console.log("err :: ", err);
    }
}

async function fetchLastestPrice(assetsData, userStore) {
    try {
        const res = await axios.post(
            `${baseURL}/db/get_goal_asset_lastest_price`,
            {
                assetsData: assetsData,
            },
            {
                headers: {
                    userId: userStore.userId,
                    Authorization: userStore.userToken,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.log("err :: ", err);
    }
}

export const GoalInvestment = () => {
    const userStore = useSelector((state) => state.userStore);
    const { goalObjId } = useParams();
    const [goalData, setGoalData] = useState(null);
    const [fundsData, setFundData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoalAssetPriceSummaryLoading, setIsGoalAssetPriceSummaryLoading] = useState(false);
    const [assetSummaryGoalData, setAssetSummaryGoalData] = useState(null);

    useEffect(() => {
        async function fetchGoal() {
            return Promise.all([
                fetchGoalData(userStore, goalObjId),
                fetchFundsData(userStore),
            ]);
        };
        if (goalObjId && userStore.userId !== null) {
            setIsLoading(true);
            setIsGoalAssetPriceSummaryLoading(true);
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
                if (fetchGoalData) {
                    fetchAndDigestData(fetchGoalData, userStore);
                }
                digestFundsData(userStore, neededDigestFunds).then((resDigest) => {
                    setIsLoading(false);
                    const digestedFundsData = resDigest.fundsData;
                    setFundData(digestedFundsData);
                    setGoalData(fetchGoalData);

                }).catch(err => {
                    console.log('err :: ', err)
                    setIsLoading(false);
                });
            });
        }
    }, [goalObjId, userStore]);

    async function fetchAndDigestData(goalData, userStore) {
        const fetchedGoalAsset = await fetchGoalAsset(goalData, userStore);
        const allFundsMap = new Map();
        fetchedGoalAsset.forEach((asset) => {
            const { unit, fundName, spec_code, proj_id } = asset.Funds[0];
            if (allFundsMap.has(fundName)) {
                allFundsMap.set(fundName, {
                    unit: allFundsMap.get(fundName).unit + unit,
                    fundName: fundName,
                    spec_code: spec_code,
                    proj_id: proj_id,
                });
            } else {
                allFundsMap.set(fundName, {
                    unit: unit,
                    fundName: fundName,
                    spec_code: spec_code,
                    proj_id: proj_id,
                });
            }
        });
        const allFunds = [];
        allFundsMap.forEach((object, fundName) => {
            allFunds.push({
                fundName: fundName,
                unit: object.unit,
                spec_code: object.spec_code,
                proj_id: object.proj_id,
            });
        });
        const digestedFundsData = await fetchLastestPrice(allFunds, userStore);
        setAssetSummaryGoalData(digestedFundsData);
        setIsGoalAssetPriceSummaryLoading(false);
    }
    return (
        <React.Fragment>
            <Navigate />
            <CurrentUserRiskProfile />
            {goalData && goalData.Name === "ลดหย่อนภาษี" ? <ReductionGoalBuyInformation goalData={goalData}></ReductionGoalBuyInformation> : <GoalPercentageAchieved goalData={goalData} assetSummaryGoalData={assetSummaryGoalData} isLoading={isGoalAssetPriceSummaryLoading}/>}
            <InvestmentFundsTable fundsData={fundsData} goalData={goalData} isLoading={isLoading} />
            {/* Because AssetSummaryGoalTable and GoalAssetPrice Summary in sub Component inside another component it will need another container */}
            <Container sx={{ maxWidth: "100%" }}>
                <Box sx={{ width: "100%" }}>
                    <Paper sx={{ width: "100%" }}>
                        <GoalAssetPriceSummary assetSummaryGoalData={assetSummaryGoalData} isLoading={isGoalAssetPriceSummaryLoading}/>
                        <AssetSummaryGoalTable goalData={goalData} mode={"specific"} isLoading={isLoading} />
                    </Paper>
                </Box>
            </Container>
            <Footer />
        </React.Fragment>
    );
};
