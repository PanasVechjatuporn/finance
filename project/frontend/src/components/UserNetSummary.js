
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { formatNumberWithCommas } from "utils/numberUtil";
import axios from "axios";

const baseURL = "http://localhost:8000";

async function fetchUserNetSummary(userStore) {
    const getResult = await axios.get(`${baseURL}/db/get_user_net_summary`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    });
    return getResult.data;
}

export const UserNetSummary = ({ userData }) => {
    const userStore = useSelector((state) => state.userStore);
    const [userNetSummary, setUserNetSummary] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userStore.userId) {
                    const userNetSummary = await fetchUserNetSummary(userStore);
                    setUserNetSummary(userNetSummary);
                }
            } catch (error) {
                console.error("Error fetching user assets:", error);
            }
        };
        fetchData()
    }, [userData, userStore])
    return (
        <Box>
            <Container>
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
                >ยอดสรุปเงินของคุณ</Typography>
                <>
                    รายรับทั้งหมดของคุณ = {userNetSummary && formatNumberWithCommas(userNetSummary.netIncome)+" บาท"}
                    <br />
                    รายจ่ายทั้งหมดของคุณ = {userNetSummary && formatNumberWithCommas(userNetSummary.netExpense)+" บาท"}
                    <br />
                    รายรับทั้งหมด - รายจ่ายทั้งหมด = {userNetSummary && formatNumberWithCommas(userNetSummary.netIncomeExpense)+" บาท"}
                    <br />
                    ซื้อกองทุนไปทั้งหมด = {userNetSummary && formatNumberWithCommas(userNetSummary.netBoughtAsset)+" บาท"}
                    <br />
                    ขายกองทุนไปทั้งหมด = {userNetSummary && formatNumberWithCommas(userNetSummary.netSoldAsset)+" บาท"}
                    <br />
                    ความมั่งคั่งของคุณ = {userNetSummary && formatNumberWithCommas(userNetSummary.netWealth)+" บาท"}
                    <br />
                </>
            </Container>
        </Box>
    )
}