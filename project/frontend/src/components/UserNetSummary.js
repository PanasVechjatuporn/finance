import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { formatNumberWithCommas } from "utils/numberUtil";
import Grid from "@mui/material/Grid";
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
        fetchData();
    }, [userData, userStore]);
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
                >
                    Summary Fund
                </Typography>
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="left"
                    justifyContent="left"
                >
                    <Grid item xs={4} md={6}>
                        <Typography style={{ fontSize: 18 }}>
                            Total income ={" "}
                            {userNetSummary &&
                                formatNumberWithCommas(userNetSummary.netIncome) + " Baht"}
                        </Typography>
                        <Typography style={{ fontSize: 18 }}>
                            Total expense ={" "}
                            {userNetSummary &&
                                formatNumberWithCommas(userNetSummary.netExpense) + " Baht"}
                        </Typography>
                        <Typography style={{ fontSize: 18 }}>
                        Total income - Total expense ={" "}
                            {userNetSummary && (
                                <span
                                    style={{
                                        color:
                                            userNetSummary.netIncomeExpense > 0 ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {formatNumberWithCommas(userNetSummary.netIncomeExpense) +
                                        " "}
                                </span>
                            )}
                            Baht
                        </Typography>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Typography style={{ fontSize: 18 }}>
                            Total bought fund ={" "}
                            {userNetSummary &&
                                formatNumberWithCommas(userNetSummary.netBoughtAsset) + " Baht"}
                        </Typography>
                        <Typography style={{ fontSize: 18 }}>
                            Total sold fund ={" "}
                            {userNetSummary &&
                                formatNumberWithCommas(userNetSummary.netSoldAsset) + " Baht"}
                        </Typography>
                        <Typography style={{ fontSize: 18 }}>
                            Summary ={" "}
                            {userNetSummary && (
                                <span
                                    style={{
                                        color:
                                            userNetSummary.netIncomeExpense > 0 ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {formatNumberWithCommas(userNetSummary.netWealth) + " "}
                                </span>
                            )}
                            Baht
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
