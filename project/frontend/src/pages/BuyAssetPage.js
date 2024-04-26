import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import axios from "axios";
import { ComponentLoading, OverlayLoading } from "../components/OverlayLoading";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Button from "react-bootstrap/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { LineChart } from "@mui/x-charts/LineChart";
import { roundNumber } from "utils/numberUtil";
import Navigate from "components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Footer } from "components/Footer";
import { SellPriceZeroPromptModal } from "components/SellPriceZeroPromptModal";

const baseURL = "http://localhost:8000";

async function getFundsLastestNav(proj_id, userStore) {
    try {
        const res = await axios.get(`${baseURL}/secapiutils/get_lastest_nav`, {
            headers: {
                proj_id: proj_id,
                userId: userStore.userId,
                userToken: userStore.userToken,
            },
        });
        return res.data[0];
    } catch (err) {
        console.log("err :: ", err);
    }
}

async function getNavYearToDate(proj_id, userStore) {
    try {
        const res = await axios.get(`${baseURL}/db/get_nav`, {
            headers: {
                ProjectId: proj_id,
                Authorization: userStore.userToken,
                UserId: userStore.userId,
                GetYearToDate: true,
            },
        });
        return res.data.navYearToDate;
    } catch (err) {
        console.log("err :: ", err);
    }
}

function digestYearToDateData(data) {
    let graphWholeData = [];
    let graphDayData = [];
    let graphData = [];
    data.forEach((entry) => {
        graphData.push(entry.lastVal);
        graphDayData.push(entry.navDate);
    });
    graphWholeData.push(graphData);
    graphWholeData.push(graphDayData);
    return graphWholeData;
}

function digestDataWithPrediction(data, fundData) {
    //digestDataWithPrediction fundData will gives us growth rate that model predict
    let tmpNav = [];
    let tmpDate = [];
    let tmpPredNav = [];
    let tmpPredDate = [];
    let tmpWholeData = [];
    let lastPushedMonth;
    //create real data from data year to that params of this function
    for (let i = data.length - 1; i > 0; i--) {
        if (tmpNav.length === 12) {
            break;
        }
        if (new Date(data[i].navDate).getMonth() !== lastPushedMonth) {
            tmpNav.unshift(data[i].lastVal);
            tmpDate.unshift(data[i].navDate);
            lastPushedMonth = new Date(data[i].navDate).getMonth();
        }
    }
    for (let i = 0; i < tmpNav.length; i++) {
        tmpPredNav.push(null);
    }
    tmpPredNav.push(tmpNav[tmpNav.length - 1]);
    tmpPredDate.push(tmpDate[tmpDate.length - 1]);
    for (let i = tmpNav.length; i < tmpNav.length * 2; i++) {
        if (
            tmpPredNav[i] +
            tmpPredNav[i] * fundData.growth_rate_predict +
            Number.EPSILON >
            0
        ) {
            tmpPredNav.push(
                tmpPredNav[i] +
                tmpPredNav[i] * fundData.growth_rate_predict +
                Number.EPSILON
            );
            tmpPredDate.push(
                formatDate(
                    new Date(
                        new Date(tmpPredDate[i - tmpNav.length]).getFullYear(),
                        new Date(tmpPredDate[i - tmpNav.length]).getMonth() + 1,
                        new Date(tmpPredDate[i - tmpNav.length]).getDate()
                    )
                )
            );
        } else {
            tmpPredNav.push(0);
            tmpPredDate.push(
                formatDate(
                    new Date(
                        new Date(tmpPredDate[i - tmpNav.length]).getFullYear(),
                        new Date(tmpPredDate[i - tmpNav.length]).getMonth() + 1,
                        new Date(tmpPredDate[i - tmpNav.length]).getDate()
                    )
                )
            );
        }
    }
    tmpWholeData.push(tmpNav);
    tmpWholeData.push(tmpDate);
    tmpWholeData.push(tmpPredNav);
    tmpWholeData.push(tmpPredDate);
    return tmpWholeData;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const BuyAssetPage = () => {
    const userStore = useSelector((state) => state.userStore);
    const location = useLocation();
    const navigate = useNavigate();
    const fundData = location.state.row;
    const goalData = location.state.goalData

    const [isLoading, setIsLoading] = useState(false);
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const [fetchedNav, setFetchedNav] = useState(null);
    const [yearToDateGraphData, setYearToDateGraphData] = useState(null);
    const [graphWithPredictionData, setGraphWithPredictionData] = useState(null);

    const [userInputBuyAmount, setUserInputBuyAmount] = useState(0);
    const [inputBuyError, setInputBuyError] = useState(false);
    const [inputErrorText, setInputErrorText] = useState("");
    const [calculatedUnitBuy, setCalculatedUnitBuy] = useState(0);


    const handleOnSave = async (buy, amount, fetchedNav, goalData, userStore) => {
        return new Promise((resolve, reject) => {
            try {
                if (!buy || buy === 0) {
                    setInputBuyError(true);
                    setInputErrorText("กรุณากรอกข้อมูลให้ครบ");
                    reject(false);
                } else {
                    setInputBuyError(false);
                    const navDate = new Date(
                        new Date(fetchedNav.nav_date).getFullYear(),
                        new Date(fetchedNav.nav_date).getMonth(),
                        new Date(fetchedNav.nav_date).getDay()
                    );
                    const insertAssetObj = {
                        timeStamp: new Date(),
                        day: new Date().getDate(),
                        month: new Date().getMonth(),
                        year: new Date().getFullYear(),
                        userId: userStore.userId,
                        Funds: [
                            {
                                amount: buy,
                                fundName: fundData.proj_name_th,
                                unit: amount,
                                assetType: "fund",
                                spec_code: fundData.spec_code,
                                buyDate: navDate,
                                buyDay: navDate.getDate(),
                                buyMonth: navDate.getMonth(),
                                year: navDate.getFullYear(),
                                buyPrice: fetchedNav.sell_price,
                                proj_id: fundData.proj_id
                            },
                        ],
                        goalObjId: goalData._id
                    };
                    axios
                        .post(
                            `${baseURL}/db/insert_asset`,
                            {
                                insertAssetObj,
                            },
                            {
                                headers: {
                                    Authorization: userStore.userToken,
                                    UserId: userStore.userId,
                                },
                            }
                        )
                        .then((res) => {
                            resolve(true);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            } catch (err) {
                console.log("err :: ", err);
                reject(err);
            }
        });
    };

    useEffect(() => {
        if (!fundData || !goalData || !userStore.userToken) return;

        setIsLoading(true);
        Promise.all([
            getFundsLastestNav(fundData.proj_id, userStore),
            getNavYearToDate(fundData.proj_id, userStore),
        ])
            .then((res) => {
                setFetchedNav(res[0]);
                setYearToDateGraphData(digestYearToDateData(res[1]));
                setGraphWithPredictionData(digestDataWithPrediction(res[1], fundData));
                if(res[0].sell_price === 0){
                    setIsPromptModalOpen(true);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("err :: ", err);
                setIsLoading(false);
            });
    }, [fundData, goalData, userStore]);

    return (
        <>
            <Navigate />
            <Container
                sx={{
                    marginTop: 5,
                    display: "ruby-text",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        overflow: "auto",
                        justifyContent: "center",
                    }}
                >
                    <div>
                        <Typography
                            variant="h5"
                            style={{
                                color: "#757575",
                                textDecoration: "underline",
                                textDecorationColor: "transparent",
                                display: "inline-block",
                                width: "100%",
                                userSelect: "none",
                                fontWeight: "bold",
                            }}
                        >
                            {fundData && fundData.proj_name_th}
                        </Typography>
                    </div>
                    {!isLoading && (
                        <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={6} md={6} sx={{ position: "relative" }}>
                                    <Box
                                        width={"100%"}
                                    >
                                        <Typography
                                            variant="h8"
                                            style={{
                                                color: "#757575",
                                                textDecoration: "underline",
                                                textDecorationColor: "transparent",
                                                userSelect: "none",
                                                position: "absolute",
                                                left: "34%",
                                                top: "10%"
                                            }}
                                        >
                                            Graph showing prices since establishment.
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {yearToDateGraphData && (
                                            <LineChart
                                                sx={{
                                                    "& .MuiChartsAxis-tickContainer": {
                                                        "&:not(:has(>.MuiChartsAxis-tickLabel))": {
                                                            "& .MuiChartsAxis-tick": {
                                                                strokeWidth: 0,
                                                            },
                                                        },
                                                    },
                                                    ".MuiChartsAxis-directionY .MuiChartsAxis-label": {
                                                        transform: "translateX(-10px) !important"
                                                    }
                                                }}
                                                width={800}
                                                height={600}
                                                series={[
                                                    {
                                                        data: yearToDateGraphData[0],
                                                        label: "Unit Price",
                                                        showMark: false,
                                                    },
                                                ]}
                                                xAxis={[
                                                    {
                                                        scaleType: "point",
                                                        data: yearToDateGraphData[1],
                                                        label: 'Date (Y/M/D)'
                                                    },
                                                ]}
                                                yAxis={[
                                                    {
                                                        label: 'Unit Price (Baht)'
                                                    }
                                                ]}
                                            />
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={6} sx={{ position: "relative" }}>
                                    <Box
                                        width={"100%"}
                                    >
                                        <Typography
                                            variant="h8"
                                            style={{
                                                color: "#757575",
                                                textDecoration: "underline",
                                                textDecorationColor: "transparent",
                                                userSelect: "none",
                                                position: "absolute",
                                                left: "20%",
                                                top: "10%"
                                            }}
                                        >
                                            Graph showing prices for the past 1 year, forecasted for the next 1 year.
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {graphWithPredictionData && (
                                            <LineChart
                                                sx={{
                                                    "& .MuiLineElement-series-Predict": {
                                                        strokeDasharray: "5 2",
                                                        strokeWidth: 2,
                                                        color: "red",
                                                    },
                                                    ".MuiChartsAxis-directionY .MuiChartsAxis-label": {
                                                        transform: "translateX(-10px) !important"
                                                    }
                                                }}
                                                width={800}
                                                height={600}
                                                series={[
                                                    {
                                                        data: graphWithPredictionData[0],
                                                        label: "Unit Price (Actual)",
                                                        showMark: false,
                                                    },
                                                    {
                                                        id: "Predict",
                                                        data: graphWithPredictionData[2],
                                                        label: "Unit Price (Predict)",
                                                        showMark: false,
                                                        color: "orange",
                                                    },
                                                ]}
                                                xAxis={[
                                                    {
                                                        scaleType: "point",
                                                        data: graphWithPredictionData[1].concat(
                                                            graphWithPredictionData[3]
                                                        ),
                                                        label: 'Date (Y/M/D)'
                                                    },
                                                ]}
                                                yAxis={[
                                                    {
                                                        label: 'Unit Price (Baht)'
                                                    }
                                                ]}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={4} md={4}>
                                    {fetchedNav && <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            id={"asset-price"}
                                            label="Latest Price"
                                            disabled={true}
                                            size="small"
                                            margin="normal"
                                            helperText={
                                                fetchedNav &&
                                                "Last updated on " +
                                                new Date(
                                                    fetchedNav.last_upd_date
                                                ).toLocaleDateString("en-GB")
                                            }
                                            value={fetchedNav && fetchedNav.last_val}
                                        />
                                    </Box>}
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    {fetchedNav && <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            id={"asset-price"}
                                            label="Selling price"
                                            disabled={true}
                                            size="small"
                                            margin="normal"
                                            helperText={
                                                fetchedNav &&
                                                "Last updated on " +
                                                new Date(
                                                    fetchedNav.last_upd_date
                                                ).toLocaleDateString("en-GB")
                                            }
                                            value={fetchedNav && fetchedNav.sell_price}
                                        />
                                    </Box>}
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    {fetchedNav && <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            id={"asset-price"}
                                            label="Redemption Price"
                                            disabled={true}
                                            size="small"
                                            margin="normal"
                                            helperText={
                                                fetchedNav &&
                                                "Last updated on " +
                                                new Date(
                                                    fetchedNav.last_upd_date
                                                ).toLocaleDateString("en-GB")
                                            }
                                            variant="outlined"
                                            value={fetchedNav && fetchedNav.buy_price}
                                        />
                                    </Box>}
                                </Grid>
                                
                            </Grid>
                            <Box display="flex" justifyContent="center">
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "#757575",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Investors should check the actual price received with the asset management company as fund prices are updated after the end of the business day.
                                    </Typography>
                            </Box>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={4} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            required
                                            id={"asset-buy"}
                                            label="Investment"
                                            size="small"
                                            margin="normal"
                                            helperText={
                                                !inputBuyError
                                                    ? "The amount of money you want to invest in this fund"
                                                    : inputErrorText
                                            }
                                            type="number"
                                            error={inputBuyError}
                                            onChange={(e) => {
                                                setUserInputBuyAmount(e.target.value);
                                                setCalculatedUnitBuy(roundNumber(e.target.value / fetchedNav.sell_price + Number.EPSILON, 6));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={4} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <TextField
                                            id={"asset-buy"}
                                            label="Investment units received"
                                            disabled={true}
                                            size="small"
                                            margin="normal"
                                            helperText={"*Investment units that can be purchased from the entered funds based on the latest selling price."}
                                            value={calculatedUnitBuy}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <ComponentLoading isLoading={isLoading} size={"75vh"} />
                    <Container>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid
                                container
                                spacing={0}
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                navigate(-1)
                                            }}
                                        >
                                            <div>
                                                <ArrowBackIcon /> Back
                                            </div>
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            variant="primary"
                                            onClick={async () => {
                                                try {
                                                    setIsOverlayLoading(true);
                                                    handleOnSave(
                                                        userInputBuyAmount,
                                                        calculatedUnitBuy,
                                                        fetchedNav,
                                                        goalData,
                                                        userStore,
                                                        fundData
                                                    )
                                                        .then((res) => {
                                                            navigate(-1)
                                                            setIsOverlayLoading(false);
                                                        })
                                                        .catch((err) => {
                                                            setIsOverlayLoading(false);
                                                            console.log("err :: ", err);
                                                        });
                                                } catch (err) {
                                                    setIsOverlayLoading(false);
                                                    console.log("err :: ", err);
                                                    alert(err);
                                                }
                                            }}
                                        >
                                            <div>
                                                <AddShoppingCartIcon /> Buy
                                            </div>
                                        </Button>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                    <OverlayLoading isLoading={isOverlayLoading}></OverlayLoading>
                </Box>
            </Container>
            <SellPriceZeroPromptModal open={isPromptModalOpen} fundData={fundData}/>
            <Footer />
        </>
    );
};
