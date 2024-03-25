import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import axios from "axios";

const baseURL = "http://localhost:8000";


async function getUserAssets(userStore) {
        const getResult = await axios
        .get(`${baseURL}/db/get_user_asset`, {
            headers: {
                Authorization: userStore.userToken,
                userId: userStore.userId,
            },
        })
        return getResult.data.queryResult
}

async function getUserGoal(userStore){
    const getResult = await axios
    .get(`${baseURL}/db/get_user_goal`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    })
    return getResult.data.queryResult
}

function combineGoalAndAsset(assetData, goalData){
    console.log('assetData :: ',assetData)
    console.log('goalData :: ',goalData)
    return "GAY"
}

export const AssetSummary = () => {
    const userStore = useSelector((state) => state.userStore);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const assetData = await getUserAssets(userStore);
                const goalData = await getUserGoal(userStore);
                const userData = combineGoalAndAsset(assetData,goalData);
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user assets:', error);
            }
        };
        fetchData();
    }, [userStore]);
    return (
        <>
            {JSON.stringify(userData)}
        </>
    )
}