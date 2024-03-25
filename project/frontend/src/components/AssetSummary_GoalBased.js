import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import { AssetSummaryGoalTable } from "./AssetSummaryGoalTable_GoalBased";
import { AssetSummaryGoalPieChart } from "./AssetSummaryGoalPieChart_GoalBased";
import axios from "axios";

const baseURL = "http://localhost:8000";

async function getUserAssets(userStore) {
    const getResult = await axios.get(`${baseURL}/db/get_user_asset`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    });
    return getResult.data.queryResult;
}

async function getUserGoal(userStore) {
    const getResult = await axios.get(`${baseURL}/db/get_user_goal`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    });
    return getResult.data.queryResult;
}

function combineGoalAndAsset(assetData, goalData) {
    goalData.forEach((goal, index) => {
        const thisGoalAssets = assetData.filter(
            (asset) => asset.goalObjId === goal._id
        );
        goalData[index].assets = thisGoalAssets;
    });
    return goalData;
}

export const AssetSummary = () => {
    const userStore = useSelector((state) => state.userStore);
    const [userData, setUserData] = useState(null);
    const [selectGoalValue, setSelectGoalValue] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const assetData = await getUserAssets(userStore);
                const goalData = await getUserGoal(userStore);
                const userData = combineGoalAndAsset(assetData, goalData);
                if (userData.length > 0) {
                    setSelectGoalValue(userData[0].Name);
                }
                setUserData(userData);
            } catch (error) {
                console.error("Error fetching user assets:", error);
            }
        };
        fetchData();
    }, [userStore]);

    useEffect(() => {
        if(userData){
            setSelectedData(userData.find((data) => data.Name === selectGoalValue));
        }
    }, [selectGoalValue, userData]);
    if (userData) {
        return (
            <Container sx={{ marginTop: 5, display: "flex", position: "relative" }}>
                <Box sx={{ width: 140, position: "absolute", right: 0 }}>
                    <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="select-goal-label">Goals</InputLabel>
                        <Select
                            labelId="select-goal"
                            id="select-goal"
                            value={selectGoalValue}
                            label="Goals"
                            onChange={(e) => {
                                setSelectGoalValue(e.target.value);
                            }}
                        >
                            {userData.map((data, index) => (
                                <MenuItem key={data._id + "-select-item"} value={data.Name}>
                                    {data.Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <AssetSummaryGoalTable
                        selectedData={selectedData}
                    ></AssetSummaryGoalTable>
                </Box>
                <Box>
                    <AssetSummaryGoalPieChart
                        selectedData={selectedData}
                    >
                    </AssetSummaryGoalPieChart>
                </Box>
            </Container>
        );
    } else {
        return <></>;
    }
};
